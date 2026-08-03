import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ImagePlus, X, CheckCircle, Loader2 } from 'lucide-react';
import {
  fetchProductReviews,
  fetchMyReview,
  createReview,
  updateReview,
  deleteReview,
} from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toastSuccess, toastError, confirmDialog } from '../../utils/toast.js';
import './ReviewSection.css';

const MAX_PHOTOS = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function Stars({ value = 0, size = 16, onChange }) {
  return (
    <div className="rs-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= value ? '#FFD700' : 'none'}
          color={n <= value ? '#FFD700' : '#E5E7EB'}
          onClick={onChange ? () => onChange(n) : undefined}
          className={onChange ? 'rs-star-btn' : ''}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ product, productId }) {
  const targetId = productId || product?._id || (typeof product === 'string' ? product : null);
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({ reviews: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState(null);
  const [myReviewLoading, setMyReviewLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [removedIndices, setRemovedIndices] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = () => {
    if (!targetId) return;
    setLoading(true);
    fetchProductReviews(targetId)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const loadMyReview = () => {
    if (!isAuthenticated || !targetId) { setMyReview(null); return; }
    setMyReviewLoading(true);
    fetchMyReview(targetId)
      .then(setMyReview)
      .catch(() => setMyReview(null))
      .finally(() => setMyReviewLoading(false));
  };

  useEffect(() => {
    if (targetId) {
      loadReviews();
      loadMyReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, isAuthenticated]);

  const resetForm = () => {
    setRating(myReview?.rating || 0);
    setComment(myReview?.comment || '');
    setNewFiles([]);
    setRemovedIndices(new Set());
    setError('');
  };

  const openEdit = () => {
    resetForm();
    setEditing(true);
  };

  const previews = [
    ...(myReview?.photos || [])
      .map((url, i) => ({ url, isExisting: true, originalIndex: i }))
      .filter((p) => !removedIndices.has(p.originalIndex)),
    ...newFiles.map((file) => ({ url: URL.createObjectURL(file), isExisting: false, file })),
  ];

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    setError('');
    setNewFiles((prev) => {
      const keptExisting = (myReview?.photos || []).filter((_, i) => !removedIndices.has(i)).length;
      const room = MAX_PHOTOS - keptExisting - prev.length;
      if (room <= 0) { setError(`Maximum ${MAX_PHOTOS} photos per review.`); return prev; }
      const accepted = [];
      for (const f of incoming) {
        if (accepted.length >= room) { setError(`Only ${room} more photo${room === 1 ? '' : 's'} allowed.`); break; }
        if (f.size > MAX_FILE_SIZE) { setError(`${f.name} exceeds 5 MB.`); continue; }
        accepted.push(f);
      }
      return [...prev, ...accepted];
    });
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePreview = (idx) => {
    const target = previews[idx];
    if (!target) return;
    if (target.isExisting) {
      setRemovedIndices((prev) => new Set(prev).add(target.originalIndex));
    } else {
      const keptExisting = (myReview?.photos || []).filter((_, i) => !removedIndices.has(i)).length;
      setNewFiles((prev) => prev.filter((_, i) => i !== idx - keptExisting));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating < 1 || rating > 5) { setError('Please select a star rating.'); return; }

    setSubmitting(true);
    try {
      if (myReview) {
        const hasNew = newFiles.length > 0;
        const opts = hasNew ? {} : { deleteIndices: [...removedIndices] };
        await updateReview(myReview._id, { rating, comment }, newFiles, opts);
        toastSuccess('Review updated!', 'Your review has been saved.');
      } else {
        await createReview({ productId: product._id, rating, comment }, newFiles);
        toastSuccess('Review submitted!', 'Thank you for your feedback.');
      }
      setEditing(false);
      await Promise.all([loadReviews(), loadMyReview()]);
      resetForm();
    } catch (err) {
      toastError('Submission failed', err.message);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    const result = await confirmDialog(
      'Delete your review?',
      'This action cannot be undone.',
      'Yes, delete it'
    );
    if (!result.isConfirmed) return;
    try {
      await deleteReview(myReview._id);
      setMyReview(null);
      resetForm();
      loadReviews();
      toastSuccess('Review deleted', 'Your review has been removed.');
    } catch (err) {
      toastError('Delete failed', err.message);
    }
  };

  // Rating breakdown derived from current page's reviews (best-effort snapshot).
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.reviews.filter((r) => r.rating === star).length,
  }));

  const canReview = isAuthenticated && !myReview;

  return (
    <section className="review-section" id="reviews">
      <h2 className="rs-title">Customer Reviews</h2>

      {/* Summary */}
      <div className="rs-summary">
        <div className="rs-summary-score">
          <span className="rs-score-big">{Number(product.rating || 0).toFixed(1)}</span>
          <Stars value={Math.round(product.rating || 0)} size={20} />
          <span className="rs-score-count">{product.reviewCount || 0} review{(product.reviewCount || 0) === 1 ? '' : 's'}</span>
        </div>
        <div className="rs-breakdown">
          {breakdown.map(({ star, count }) => {
            const total = data.reviews.length || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div className="rs-bar-row" key={star}>
                <span className="rs-bar-label">{star}★</span>
                <div className="rs-bar-track"><div className="rs-bar-fill" style={{ width: `${pct}%` }} /></div>
                <span className="rs-bar-pct">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write / Edit review */}
      {isAuthenticated ? (
        myReview && !editing ? (
          <div className="rs-mine">
            <div className="rs-mine-head">
              <strong>Your review</strong>
              <Stars value={myReview.rating} size={14} />
            </div>
            {myReview.comment && <p className="rs-mine-text">{myReview.comment}</p>}
            <div className="rs-mine-actions">
              <button className="btn btn-sm btn-secondary" onClick={openEdit}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        ) : (myReview && editing) || canReview ? (
          <form className="rs-form" onSubmit={handleSubmit}>
            <h3>{myReview ? 'Edit your review' : 'Write a review'}</h3>
            {error && <div className="rs-error">{error}</div>}
            <div className="rs-form-row">
              <label>Your rating</label>
              <Stars value={rating} size={28} onChange={setRating} />
            </div>
            <div className="rs-form-row">
              <label>Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder="Share your experience…"
              />
            </div>

            {previews.length > 0 && (
              <div className="rs-thumbs">
                {previews.map((p, i) => (
                  <div className="rs-thumb" key={i}>
                    <img src={p.url} alt={`Review ${i + 1}`} />
                    <button type="button" className="rs-thumb-remove" onClick={() => removePreview(i)} aria-label="Remove photo">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previews.length < MAX_PHOTOS && (
              <div className="rs-upload">
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />
                <button type="button" className="rs-upload-btn" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={15} /> Add photos ({previews.length}/{MAX_PHOTOS})
                </button>
              </div>
            )}

            <div className="rs-form-actions">
              <button type="submit" className="btn btn-sky" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="rs-spin" /> : null}
                {myReview ? 'Update Review' : 'Submit Review'}
              </button>
              {myReview && editing && (
                <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); resetForm(); }}>Cancel</button>
              )}
            </div>
          </form>
        ) : null
      ) : (
        <div className="rs-cta">
          <p><Link to="/login">Sign in</Link> to write a review.</p>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <p className="rs-empty">Loading reviews…</p>
      ) : data.reviews.length === 0 ? (
        <p className="rs-empty">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="rs-list">
          {data.reviews.map((r) => (
            <div className="rs-card" key={r._id}>
              <div className="rs-card-head">
                <div>
                  <span className="rs-name">{r.userName}</span>
                  <span className="rs-verified"><CheckCircle size={12} /> Verified Purchase</span>
                </div>
                <Stars value={r.rating} size={14} />
              </div>
              {r.comment && <p className="rs-comment">{r.comment}</p>}
              {r.photos?.length > 0 && (
                <div className="rs-card-photos">
                  {r.photos.map((url, i) => (
                    <img key={i} src={url} alt={`${r.userName} review photo ${i + 1}`} />
                  ))}
                </div>
              )}
              <span className="rs-date">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {data.pages > 1 && (
            <div className="rs-pagination">
              <button className="btn btn-sm btn-secondary" disabled={data.page <= 1} onClick={() => fetchProductReviews(product._id, { page: data.page - 1 }).then(setData)}>← Prev</button>
              <span>Page {data.page} of {data.pages}</span>
              <button className="btn btn-sm btn-secondary" disabled={data.page >= data.pages} onClick={() => fetchProductReviews(product._id, { page: data.page + 1 }).then(setData)}>Next →</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
