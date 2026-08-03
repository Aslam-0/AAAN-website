import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Download, RefreshCw, Check, Image as ImageIcon, Sliders, Layers, Eye, ArrowRight, Sun, Zap, ShieldCheck } from 'lucide-react';
import { enhanceProductImage } from '../../utils/imageEnhancer';
import AaanLogo from '../../components/common/AaanLogo';
import { toastSuccess, toastError } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminImageEnhancer.css';

export default function AdminImageEnhancer({ onApplyEnhancedImage }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [options, setOptions] = useState({
    removeBg: true,
    improveLighting: true,
    superRes: true,
    squareCrop: true,
    quality: 0.85
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toastError('Invalid File', 'Please select an image file (JPG, PNG, WEBP).');
      return;
    }
    setSelectedFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setEnhancedResult(null);
  };

  const handleEnhance = async () => {
    if (!selectedFile) {
      toastError('No Image Selected', 'Please upload a product photo to enhance.');
      return;
    }

    setProcessing(true);
    try {
      const result = await enhanceProductImage(selectedFile, options);
      setEnhancedResult(result);
      toastSuccess('AI Image Enhanced! ✨', 'Background removed, resolution doubled & lighting boosted.');
    } catch (err) {
      toastError('Enhancement Failed', err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadVariant = (dataUrl, filename) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toastSuccess('Downloaded!', `${filename} downloaded successfully.`);
  };

  const handleApply = () => {
    if (!enhancedResult) return;
    if (onApplyEnhancedImage) {
      onApplyEnhancedImage(enhancedResult.file);
      toastSuccess('Applied to Catalog!', 'Enhanced WebP image set as product cover.');
    } else {
      navigate('/admin/products/new');
    }
  };

  return (
    <div className="aaan-img-enhancer-shell">
      {/* Hero Header */}
      <div className="img-enhancer-hero">
        <div>
          <div className="img-hub-badge">
            <AaanLogo size="sm" light={true} />
            <span>AAAN AI Media Studio</span>
          </div>
          <h2>🎨 AI Product Image Enhancer &amp; Studio</h2>
          <p>Remove backgrounds, double resolution, boost studio lighting &amp; export Instagram social graphics automatically.</p>
        </div>

        <div className="img-quick-stats">
          <div className="stat-pill-sm">
            <span>Compression</span>
            <strong>70% Smaller WebP</strong>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="img-studio-grid">
        
        {/* Left Column: Controls & Toggles */}
        <div className="img-controls-col">
          
          {/* Card 1: Upload Dropzone */}
          <div className="img-card">
            <h3 className="img-card-title">
              <Upload size={18} color="#6366F1" /> Upload Product Photo
            </h3>

            <div
              className="img-dropzone"
              onClick={() => fileRef.current?.click()}
            >
              {originalPreview ? (
                <div className="original-preview-box">
                  <img src={originalPreview} alt="Original" />
                  <span className="preview-label">Original Selected</span>
                </div>
              ) : (
                <div className="img-drop-empty">
                  <ImageIcon size={36} color="#6366F1" />
                  <strong>Click or Drag Product Image</strong>
                  <p>Supports JPG, PNG, WEBP up to 10 MB</p>
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

            <button
              type="button"
              className="btn-select-file"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={15} /> {selectedFile ? 'Change Photo' : 'Browse Computer'}
            </button>
          </div>

          {/* Card 2: AI Enhancement Toggles */}
          <div className="img-card">
            <h3 className="img-card-title">
              <Sliders size={18} color="#10B981" /> AI Processing Options
            </h3>

            <div className="toggles-list">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={options.removeBg}
                  onChange={(e) => setOptions({ ...options, removeBg: e.target.checked })}
                />
                <div>
                  <strong>Auto Background Removal</strong>
                  <span>Replaces messy backgrounds with clean studio white</span>
                </div>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={options.improveLighting}
                  onChange={(e) => setOptions({ ...options, improveLighting: e.target.checked })}
                />
                <div>
                  <strong>AI Studio Lighting &amp; Saturation Boost</strong>
                  <span>Optimizes brightness, contrast (+12%) &amp; color pop</span>
                </div>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={options.superRes}
                  onChange={(e) => setOptions({ ...options, superRes: e.target.checked })}
                />
                <div>
                  <strong>2x Super-Resolution Upscale</strong>
                  <span>Doubles image pixels &amp; sharpens fine details</span>
                </div>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={options.squareCrop}
                  onChange={(e) => setOptions({ ...options, squareCrop: e.target.checked })}
                />
                <div>
                  <strong>1:1 Square Storefront Thumbnail Crop</strong>
                  <span>Center-aligns product for storefront product cards</span>
                </div>
              </label>
            </div>

            <button
              onClick={handleEnhance}
              className="btn-process-ai"
              disabled={processing || !selectedFile}
            >
              {processing ? (
                <>
                  <RefreshCw size={18} className="spin" /> Enhancing Image…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> ✨ Enhance Image with AI
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Original vs AI Enhanced Comparison & Social Exports */}
        <div className="img-preview-col">
          {enhancedResult ? (
            <>
              {/* Top Action Header */}
              <div className="preview-top-actions">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>✨ AI Enhancement Complete</h3>
                  <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
                    {enhancedResult.originalWidth}×{enhancedResult.originalHeight} → {enhancedResult.enhancedWidth}×{enhancedResult.enhancedHeight} (WebP)
                  </span>
                </div>

                <button onClick={handleApply} className="btn-apply-enhanced">
                  Apply to Product Catalog <ArrowRight size={16} />
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="comparison-grid">
                <div className="comp-card">
                  <div className="comp-badge original">BEFORE (Original)</div>
                  <img src={originalPreview} alt="Original" />
                  <div className="comp-meta">{enhancedResult.originalWidth} × {enhancedResult.originalHeight} px</div>
                </div>

                <div className="comp-card">
                  <div className="comp-badge enhanced">AFTER (AI Enhanced)</div>
                  <img src={enhancedResult.dataUrl} alt="Enhanced" />
                  <div className="comp-meta">{enhancedResult.enhancedWidth} × {enhancedResult.enhancedHeight} px (WebP Compressed)</div>
                </div>
              </div>

              {/* Social Media & E-Commerce Exports Grid */}
              <div className="img-card">
                <h3 className="img-card-title">
                  <Layers size={18} color="#7C3AED" /> Social Media &amp; E-Commerce Export Formats
                </h3>

                <div className="exports-grid">
                  <div className="export-box">
                    <strong>🛍️ E-Commerce Catalog WebP</strong>
                    <span>1:1 Square (1200×1200)</span>
                    <button
                      onClick={() => handleDownloadVariant(enhancedResult.dataUrl, 'aaan_catalog_product.webp')}
                      className="btn-dl-variant"
                    >
                      <Download size={14} /> Download WebP
                    </button>
                  </div>

                  <div className="export-box">
                    <strong>📸 Instagram Post Square</strong>
                    <span>1:1 Square (1080×1080)</span>
                    <button
                      onClick={() => handleDownloadVariant(enhancedResult.variants.instagramPost, 'aaan_instagram_post.png')}
                      className="btn-dl-variant"
                    >
                      <Download size={14} /> Download PNG
                    </button>
                  </div>

                  <div className="export-box">
                    <strong>📱 Instagram Story / Reel</strong>
                    <span>9:16 Vertical (1080×1920)</span>
                    <button
                      onClick={() => handleDownloadVariant(enhancedResult.variants.instagramStory, 'aaan_instagram_story.png')}
                      className="btn-dl-variant"
                    >
                      <Download size={14} /> Download PNG
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-enhancer-card">
              <Sparkles size={52} color="#6366F1" />
              <h3>AI Image Enhancement Studio</h3>
              <p>Upload a product image on the left, select your AI enhancement options, and click <strong>"Enhance Image with AI"</strong> to automatically remove backgrounds, boost resolution &amp; export social media formats.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
