import { useEffect, useState, useRef } from 'react';
import { Edit, Trash2, PlusCircle, Upload, X, Layers, ImagePlus, Sparkles, Check, Search } from 'lucide-react';
import { fetchAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../api';
import { compressImage } from '../../utils/imageCompressor.js';
import AaanLogo from '../../components/common/AaanLogo';
import { toastSuccess, toastError } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminCategories.css';

const categoryPresets = [
  { name: 'Home Decor & Wall Art', icon: '🏠' },
  { name: 'Lighting, Lamps & Candles', icon: '🕯️' },
  { name: 'Cushions, Curtains & Bedding', icon: '🛋️' },
  { name: 'Idols, Showpieces & Vases', icon: '🏺' },
  { name: 'Mirrors & Wall Clocks', icon: '🪞' },
  { name: 'Kitchenware & Dining Decor', icon: '🍳' },
  { name: 'Planters & Garden Decor', icon: '🪴' },
  { name: 'Clothes & Fashion', icon: '👔' },
  { name: 'Electronics & Tech', icon: '⚡' }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef(null);

  const demoCategories = [
    { _id: 'cat-1', name: 'Home Decor & Wall Art', imageUrl: '/aaan-logo.svg', productCount: 42 },
    { _id: 'cat-2', name: 'Lighting, Lamps & Candles', imageUrl: '/aaan-logo.svg', productCount: 28 },
    { _id: 'cat-3', name: 'Cushions, Curtains & Bedding', imageUrl: '/aaan-logo.svg', productCount: 35 },
    { _id: 'cat-4', name: 'Idols, Showpieces & Vases', imageUrl: '/aaan-logo.svg', productCount: 19 }
  ];

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAdminCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    try {
      const compressed = await compressImage(selected);
      setFile(compressed);
      setFilePreview(URL.createObjectURL(compressed));
      toastSuccess('Image Optimized', 'Compressed for ultra-fast loading.');
    } catch {
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    }
  };

  function startCreate() {
    setEditing(null);
    setName('');
    setFile(null);
    setFilePreview(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startEdit(cat) {
    setEditing(cat);
    setName(cat.name || '');
    setFile(null);
    setFilePreview(cat.imageUrl || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Name Required', 'Please enter a category name.');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateAdminCategory(editing._id, { name }, file);
        toastSuccess('Category Updated', `${name} has been updated.`);
      } else {
        await createAdminCategory({ name }, file);
        toastSuccess('Category Created', `${name} is now live.`);
      }
      await load();
      startCreate();
    } catch (err) {
      toastError('Save Error', err.message || 'Could not save category');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteAdminCategory(id);
      toastSuccess('Category Deleted', 'Removed successfully.');
      await load();
    } catch (err) {
      toastError('Delete Error', err.message);
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="aaan-categories-shell">
      {/* Header Banner */}
      <div className="cat-header-banner">
        <div>
          <div className="cat-hub-badge">
            <AaanLogo size="sm" />
            <span>AAAN Category Manager</span>
          </div>
          <h2>📁 Product Categories &amp; Collections</h2>
          <p>Organize products into high-converting storefront categories with fast WebP image optimization.</p>
        </div>

        <div className="cat-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cat-portal-grid">
        {/* Editor Form Card */}
        <div className="cat-form-card">
          <h3 className="cat-card-title">
            {editing ? '✏️ Edit Category' : '✨ Add New Category'}
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="cat-label">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clothes &amp; Apparel or Electronics"
                required
                className="cat-input"
              />
            </div>

            {/* Quick Preset Selector */}
            <div>
              <label className="cat-label">Quick Name Presets</label>
              <div className="preset-chips">
                {categoryPresets.map((p) => (
                  <button
                    type="button"
                    key={p.name}
                    className="preset-chip"
                    onClick={() => setName(p.name)}
                  >
                    {p.icon} {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Image Upload */}
            <div>
              <label className="cat-label">Category Cover Banner / Image</label>
              
              <div
                className="cat-dropzone"
                onClick={() => fileRef.current?.click()}
              >
                {filePreview ? (
                  <div className="cat-preview-box">
                    <img src={filePreview} alt="Preview" loading="lazy" decoding="async" />
                    <span className="cat-preview-change">Click to Change Image</span>
                  </div>
                ) : (
                  <div className="cat-drop-empty">
                    <ImagePlus size={28} color="#6366F1" />
                    <strong>Upload WebP Cover Image</strong>
                    <p>Optimized for instant page loading</p>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            <div className="cat-form-actions">
              <button type="submit" className="btn-cat-save" disabled={saving}>
                {saving ? 'Saving…' : editing ? '✓ Update Category' : '+ Create Category'}
              </button>
              {editing && (
                <button type="button" className="btn-cat-cancel" onClick={startCreate}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Cards Grid */}
        <div className="cat-cards-list-wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Storefront Categories ({categories.length})</h3>
            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 800 }}>⚡ High Speed WebP Ready</span>
          </div>

          <div className="cat-cards-grid">
            {filteredCategories.map((c) => (
              <div key={c._id} className="cat-card-item">
                <div className="cat-card-img-wrap">
                  <img
                    src={c.imageUrl || '/aaan-logo.svg'}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cat-card-overlay">
                    <button className="cat-btn-icon" onClick={() => startEdit(c)} title="Edit category">
                      <Edit size={16} />
                    </button>
                    <button className="cat-btn-icon danger" onClick={() => handleDelete(c._id)} title="Delete category">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="cat-card-info">
                  <strong className="cat-card-name">{c.name}</strong>
                  <span className="cat-card-count">Catalog Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}