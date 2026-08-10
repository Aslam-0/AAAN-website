import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ImagePlus, Sparkles, RefreshCw, ShieldCheck, Truck, Check, Eye, Tag, DollarSign, Wand2 } from 'lucide-react';
import { fetchAdminCategories, createProduct, updateProduct, fetchAdminProducts, formatPrice } from '../../api';
import AaanLogo from '../../components/common/AaanLogo';
import AdminAiGenerator from './AdminAiGenerator';
import { toastSuccess } from '../../utils/toast.js';
import '../../styles/Panel.css';
import '../auth/Auth.css';
import './AdminProductForm.css';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const emptyForm = {
  name: '',
  sku: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  stockQuantity: 50,
  discountPercent: 0,
  bestseller: false,
  warranty: '1 Year AAAN Official Warranty',
  shippingType: 'Free Express Shipping',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...emptyForm, sizes: [] });
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [originalUrls, setOriginalUrls] = useState([]);
  const [removedIndices, setRemovedIndices] = useState(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showImageEnhancerModal, setShowImageEnhancerModal] = useState(false);

  // Category detection
  const selectedCatObj = categories.find((c) => c._id === form.category);
  const catName = (selectedCatObj?.name || '').toLowerCase();

  const isHomeDecor = catName.includes('home') || catName.includes('decor') || catName.includes('light') || catName.includes('curtain') || catName.includes('cushion') || catName.includes('showpiece') || catName.includes('vase') || catName.includes('mirror') || catName.includes('clock') || catName.includes('art') || catName.includes('idol') || catName.includes('kitchen') || catName.includes('planter') || catName.includes('bed');
  const isClothing = catName.includes('cloth') || catName.includes('fashion') || catName.includes('apparel') || catName.includes('wear') || catName.includes('shirt') || catName.includes('pant') || catName.includes('dress');
  const isFurnitureOrElectronics = catName.includes('furniture') || catName.includes('electron') || catName.includes('tech') || catName.includes('appliance') || catName.includes('living') || catName.includes('wellness');

  const generateSku = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = isHomeDecor ? 'MEESHO-DECOR' : isClothing ? 'AAAN-CLT' : isFurnitureOrElectronics ? 'AAAN-TEC' : 'AAAN-CAT';
    const sku = `${prefix}-${randomCode}`;
    setForm((prev) => ({ ...prev, sku }));
    toastSuccess('SKU Generated', `Assigned code ${sku}`);
  };

  const toggleSize = (sz) => {
    setForm((prev) => {
      const current = prev.sizes || [];
      if (current.includes(sz)) {
        return { ...prev, sizes: current.filter((s) => s !== sz) };
      }
      return { ...prev, sizes: [...current, sz] };
    });
  };

  const addCustomSize = () => {
    const s = customSizeInput.trim();
    if (!s) return;
    setForm((prev) => {
      const current = prev.sizes || [];
      if (!current.includes(s)) {
        return { ...prev, sizes: [...current, s] };
      }
      return prev;
    });
    setCustomSizeInput('');
  };

  const keptOriginals = originalUrls
    .map((url, i) => ({ url, originalIndex: i }))
    .filter((entry) => !removedIndices.has(entry.originalIndex));

  const previews = [
    ...keptOriginals.map((entry) => ({ url: entry.url, isExisting: true, originalIndex: entry.originalIndex })),
    ...newFiles.map((file) => ({ url: URL.createObjectURL(file), isExisting: false, file })),
  ];
  const totalCount = previews.length;

  useEffect(() => {
    fetchAdminCategories().then(setCategories);
    if (isEdit) {
      fetchAdminProducts().then((products) => {
        const p = products.find((x) => x._id === id);
        if (p) {
          setForm({
            name: p.name,
            sku: p.sku || `AAAN-CAT-${Math.floor(1000 + Math.random() * 9000)}`,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice || '',
            category: p.category?._id || p.category,
            stockQuantity: p.stockQuantity,
            discountPercent: p.discountPercent || 0,
            bestseller: p.bestseller || false,
            warranty: p.warranty || '1 Year AAAN Official Warranty',
            shippingType: p.shippingType || 'Free Express Shipping',
            sizes: p.sizes || []
          });
          const imgs = Array.isArray(p.images) ? p.images : [];
          setOriginalUrls(imgs.length > 0 ? imgs : p.image ? [p.image] : []);
        }
      });
    } else {
      generateSku();
    }
  }, [id, isEdit]);

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    setError('');
    setNewFiles((prev) => {
      const room = MAX_IMAGES - keptOriginals.length - prev.length;
      if (room <= 0) {
        setError(`Maximum ${MAX_IMAGES} images allowed per catalog item.`);
        return prev;
      }
      const accepted = [];
      for (const f of incoming) {
        if (accepted.length >= room) {
          setError(`Only ${room} more image${room === 1 ? '' : 's'} can be added.`);
          break;
        }
        if (f.size > MAX_FILE_SIZE) {
          setError(`${f.name} exceeds 5 MB limit.`);
          continue;
        }
        accepted.push(f);
      }
      return [...prev, ...accepted];
    });
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removePreview = (idx) => {
    const target = previews[idx];
    if (!target) return;
    if (target.isExisting) {
      setRemovedIndices((prev) => new Set(prev).add(target.originalIndex));
    } else {
      setNewFiles((prev) => prev.filter((_, i) => i !== idx - keptOriginals.length));
    }
  };

  const calculateDiscountInfo = () => {
    const curr = parseFloat(form.price) || 0;
    const orig = parseFloat(form.originalPrice) || 0;
    if (orig > curr && curr > 0) {
      const saveAmt = orig - curr;
      const pct = Math.round((saveAmt / orig) * 100);
      return { saveAmt, pct };
    }
    return null;
  };

  const discountInfo = calculateDiscountInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalCount === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    setLoading(true);
    try {
      const fields = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : '',
        stockQuantity: parseInt(form.stockQuantity, 10),
        discountPercent: discountInfo ? discountInfo.pct : (parseInt(form.discountPercent, 10) || 0),
        bestseller: form.bestseller,
      };

      if (isEdit) {
        const hasNew = newFiles.length > 0;
        const opts = hasNew ? {} : { deleteIndices: [...removedIndices] };
        await updateProduct(id, fields, newFiles, opts);
        toastSuccess('Catalog Updated!', `${form.name} updated successfully.`);
      } else {
        await createProduct(fields, newFiles);
        toastSuccess('Catalog Published!', `${form.name} is now live on AAAN Storefront.`);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAiContent = (aiData) => {
    setForm((prev) => ({
      ...prev,
      description: (aiData.professionalDescription || '') + '\n\n' + (Array.isArray(aiData.bulletPoints) ? aiData.bulletPoints.join('\n') : '')
    }));
    setShowAiModal(false);
    toastSuccess('AI Copy Applied!', 'Product description & bullet points updated.');
  };

  const handleApplyEnhancedImage = (enhancedFile) => {
    setNewFiles((prev) => [enhancedFile, ...prev]);
    setShowImageEnhancerModal(false);
    toastSuccess('Enhanced Image Added!', 'AI WebP photo added to gallery.');
  };

  return (
    <div className="meesho-panel-shell">
      {/* Top Header Summary Banner */}
      <div className="meesho-top-header">
        <img
          src={previews.length > 0 ? previews[0].url : '/aaan-logo.svg'}
          className="meesho-top-thumb"
          alt="Product Thumbnail"
        />
        <div style={{ flex: 1 }}>
          <h3 className="meesho-top-title">
            {form.name || 'Wooden Buddha Engraved Wall Hanging Decorative Frame for Home, Office & Living Room (Brown, Rectangular) (Pack of 1)'}
          </h3>
          <span className="meesho-top-style-id">Style ID: {form.sku || 'AAAN-Buddha Engraved Wall 1'}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-ai-modal-trigger"
            onClick={() => setShowAiModal(true)}
            style={{ background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <Sparkles size={14} /> AI Copy
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

        <div className="catalog-form-grid">
          {/* Left Column — Product Details Forms */}
          <div className="catalog-form-main">
            
            {/* Section 1: Price, Size and Inventory */}
            <div className="meesho-card">
              <h3 className="meesho-card-title">Product Details</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#616161', margin: '-8px 0 16px' }}>Price, Size and Inventory</p>
              
              <div className="meesho-grid-2">
                <div className="meesho-field">
                  <label className="meesho-label">GST * <span className="meesho-info-icon" title="Tax Rate">i</span></label>
                  <select value={form.gst || '5'} onChange={update('gst')} className="meesho-select">
                    <option value="5">5</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="28">28</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">HSN Code * <span className="meesho-info-icon" title="Harmonized System Nomenclature">i</span></label>
                  <div>
                    <select value={form.hsnCode || '442090'} onChange={update('hsnCode')} className="meesho-select">
                      <option value="442090">442090</option>
                      <option value="9405">9405</option>
                      <option value="8306">8306</option>
                      <option value="6304">6304</option>
                    </select>
                    <a href="#hsn" onClick={(e) => { e.preventDefault(); toastSuccess('HSN Code', 'Selected HSN: 442090 (Home Decor)'); }} className="meesho-calc-link">Find Relevant HSN Code &gt;</a>
                  </div>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Net Weight (gms) * <span className="meesho-info-icon" title="Weight in grams">i</span></label>
                  <input type="number" value={form.netWeight || '50'} onChange={update('netWeight')} className="meesho-input" placeholder="50" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Style code/ Product ID (optional) <span className="meesho-info-icon" title="Supplier Style ID">i</span></label>
                  <input type="text" value={form.sku} onChange={update('sku')} className="meesho-input" placeholder="AAAN-Buddha Engraved Wall 1" />
                </div>

                <div className="meesho-field meesho-field-full">
                  <label className="meesho-label">Product Name * <span className="meesho-info-icon" title="Catalog Title">i</span></label>
                  <input type="text" value={form.name} onChange={update('name')} required className="meesho-input" placeholder="Wooden Buddha Engraved Wall Hanging Decorative Frame for Home, Office & Living Room (Brown, Rectangular) (Pack of 1)" />
                </div>

                <div className="meesho-field meesho-field-full">
                  <label className="meesho-label">Category * <span className="meesho-info-icon" title="Select Category">i</span></label>
                  <select value={form.category} onChange={update('category')} required className="meesho-select">
                    <option value="">
                      {categories.length === 0 ? '⚠️ No categories found — Create one first in Category Manager' : 'Select product category…'}
                    </option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="meesho-yellow-banner">
                <span>ⓘ</span> To increase price and modify variation details, please raise a ticket in support
              </div>

              {/* Price & Inventory Table */}
              <div className="meesho-table-wrapper">
                <table className="meesho-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Meesho Price* ⓘ</th>
                      <th>Wrong/Defective Returns Price ⓘ</th>
                      <th>Prepaid Discount ⓘ</th>
                      <th>MRP* ⓘ</th>
                      <th>Inventory * ⓘ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Free Size</strong></td>
                      <td>
                        <input type="number" value={form.price} onChange={update('price')} className="meesho-table-input" placeholder="370" required />
                        <span className="meesho-calc-link" onClick={() => toastSuccess('Price Calculator', 'Selling price calculated based on Meesho margin.')}>Calculate your selling price</span>
                      </td>
                      <td>
                        <input type="number" value={form.defectiveReturnPrice || '369'} onChange={update('defectiveReturnPrice')} className="meesho-table-input" placeholder="369" />
                      </td>
                      <td>
                        <input type="text" value={form.prepaidDiscount || ''} onChange={update('prepaidDiscount')} className="meesho-table-input" placeholder="₹" />
                      </td>
                      <td>
                        <input type="number" value={form.originalPrice || '1299'} onChange={update('originalPrice')} className="meesho-table-input" placeholder="1299" />
                      </td>
                      <td>
                        <input type="number" value={form.stockQuantity} onChange={update('stockQuantity')} className="meesho-table-input" placeholder="40" required />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Product Details */}
            <div className="meesho-card">
              <h3 className="meesho-card-title">Product Details</h3>

              <div className="meesho-grid-2">
                <div className="meesho-field">
                  <label className="meesho-label">Color * <span className="meesho-info-icon">i</span></label>
                  <select value={form.color || 'Brown'} onChange={update('color')} className="meesho-select">
                    <option value="Select">Select</option>
                    <option value="Brown">Brown</option>
                    <option value="Black">Black</option>
                    <option value="Gold">Gold</option>
                    <option value="White">White</option>
                    <option value="Multicolor">Multicolor</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Generic Name * <span className="meesho-info-icon">i</span></label>
                  <select value={form.genericName || 'Wall Decor & Hangings'} onChange={update('genericName')} className="meesho-select">
                    <option value="Wall Decor & Hangings">Wall Decor &amp; Hangings</option>
                    <option value="Showpiece & Idols">Showpiece &amp; Idols</option>
                    <option value="Lighting & Lamps">Lighting &amp; Lamps</option>
                    <option value="Cushion Covers">Cushion Covers</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Ideal For * <span className="meesho-info-icon">i</span></label>
                  <select value={form.idealFor || 'Bedroom'} onChange={update('idealFor')} className="meesho-select">
                    <option value="Bedroom">Bedroom</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Puja Room">Puja Room</option>
                    <option value="Office">Office</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Included Components * <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.includedComponents || '1 x Wooden Wall Frame'} onChange={update('includedComponents')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Material * <span className="meesho-info-icon">i</span></label>
                  <select value={form.material || 'Wooden'} onChange={update('material')} className="meesho-select">
                    <option value="Wooden">Wooden</option>
                    <option value="Brass">Brass</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Metal">Metal</option>
                    <option value="Velvet">Velvet</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Net Quantity (N) * <span className="meesho-info-icon">i</span></label>
                  <select value={form.netQuantity || '1'} onChange={update('netQuantity')} className="meesho-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Product Breadth * <span className="meesho-info-icon">i</span></label>
                  <input type="number" value={form.productBreadth || '48'} onChange={update('productBreadth')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Product Height * <span className="meesho-info-icon">i</span></label>
                  <input type="number" value={form.productHeight || '33'} onChange={update('productHeight')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Product Length * <span className="meesho-info-icon">i</span></label>
                  <input type="number" step="0.1" value={form.productLength || '1.5'} onChange={update('productLength')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Product Unit * <span className="meesho-info-icon">i</span></label>
                  <select value={form.productUnit || 'cm'} onChange={update('productUnit')} className="meesho-select">
                    <option value="cm">cm</option>
                    <option value="inches">inches</option>
                    <option value="mm">mm</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Type * <span className="meesho-info-icon">i</span></label>
                  <select value={form.type || 'Religious'} onChange={update('type')} className="meesho-select">
                    <option value="Religious">Religious</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Modern">Modern</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Weight * <span className="meesho-info-icon">i</span></label>
                  <input type="number" step="0.1" value={form.weight || '0.1'} onChange={update('weight')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Weight Unit * <span className="meesho-info-icon">i</span></label>
                  <select value={form.weightUnit || 'kg'} onChange={update('weightUnit')} className="meesho-select">
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">COUNTRY OF ORIGIN * <span className="meesho-info-icon">i</span></label>
                  <select value={form.countryOfOrigin || 'India'} onChange={update('countryOfOrigin')} className="meesho-select">
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Manufacturer Name * <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.manufacturerName || 'AAAN'} onChange={update('manufacturerName')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Manufacturer Address <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.manufacturerAddress || 'NCR Delhi'} onChange={update('manufacturerAddress')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Manufacturer Pincode * <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.manufacturerPincode || '201013'} onChange={update('manufacturerPincode')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Packer Name * <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.packerName || 'AAAN'} onChange={update('packerName')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Packer Address <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.packerAddress || 'NCR Delhi'} onChange={update('packerAddress')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Packer Pincode <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.packerPincode || '201013'} onChange={update('packerPincode')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Importer Name <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.importerName || 'Not Required'} onChange={update('importerName')} className="meesho-input" />
                </div>

                <div className="meesho-field">
                  <label className="meesho-label">Importer Address <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.importerAddress || 'Not Required'} onChange={update('importerAddress')} className="meesho-input" />
                </div>

                <div className="meesho-field meesho-field-full">
                  <label className="meesho-label">Importer Pincode <span className="meesho-info-icon">i</span></label>
                  <input type="text" value={form.importerPincode || 'Not Required'} onChange={update('importerPincode')} className="meesho-input" />
                </div>

                <div className="meesho-field meesho-field-full">
                  <label className="meesho-label">Product Description * <span className="meesho-info-icon">i</span></label>
                  <textarea
                    value={form.description}
                    onChange={update('description')}
                    required
                    rows={3}
                    className="meesho-input"
                    placeholder="Handcrafted Wooden Buddha Engraved Decorative Wall Hanging Frame..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar — Image Guidelines & Image Slots */}
          <div className="catalog-form-sidebar">
            <div className="meesho-guide-box">
              <span>ⓘ</span> Follow guidelines to reduce quality check failure
            </div>

            <div className="meesho-image-guidelines-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#212121' }}>Image Guidelines</strong>
                <span className="meesho-calc-link" style={{ fontSize: '0.75rem' }} onClick={() => toastSuccess('Image Guidelines', 'Always upload high resolution solo product images.')}>View Full Image Guidelines</span>
              </div>

              <ul className="meesho-guidelines-list">
                <li>
                  <span className="meesho-guideline-num">1</span>
                  <span>Images with text/Watermark are not acceptable in primary images.</span>
                </li>
                <li>
                  <span className="meesho-guideline-num">2</span>
                  <span>Product image should not have any text</span>
                </li>
                <li>
                  <span className="meesho-guideline-num">3</span>
                  <span>Please add solo product image without any props.</span>
                </li>
              </ul>
            </div>

            <div className="meesho-card">
              <strong style={{ fontSize: '0.85rem', color: '#212121', marginBottom: '10px', display: 'block' }}>
                Add Images with details listed here
              </strong>

              <div className="meesho-image-slots-list">
                <div className="meesho-slot-item">
                  <span style={{ fontWeight: 600, color: '#D32F2F' }}>Front view *</span>
                  <span style={{ fontSize: '0.72rem', color: '#757575', marginLeft: 'auto' }}>add clear image</span>
                </div>
                <div className="meesho-slot-item">
                  <span style={{ fontWeight: 600, color: '#D32F2F' }}>Close up view *</span>
                  <span style={{ fontSize: '0.72rem', color: '#757575', marginLeft: 'auto' }}>add clear image</span>
                </div>
                <div className="meesho-slot-item">
                  <span style={{ fontWeight: 600, color: '#D32F2F' }}>Dimensional view *</span>
                  <span style={{ fontSize: '0.72rem', color: '#757575', marginLeft: 'auto' }}>add clear image with dimension</span>
                </div>
              </div>

              <strong style={{ fontSize: '0.85rem', color: '#212121', marginBottom: '10px', display: 'block' }}>Images</strong>

              {totalCount > 0 && (
                <div className="apf-thumb-grid">
                  {previews.map((p, i) => (
                    <div className={`apf-thumb ${i === 0 ? 'cover' : ''}`} key={i}>
                      <img src={p.url} alt={`Product ${i + 1}`} loading="lazy" />
                      {i === 0 && <span className="apf-cover-badge">Front Image *</span>}
                      <button
                        type="button"
                        className="apf-thumb-remove"
                        onClick={() => removePreview(i)}
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {totalCount < MAX_IMAGES && (
                <div
                  className="apf-dropzone"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="apf-dropzone-empty">
                    <ImagePlus size={24} color="#5925A9" />
                    <p className="apf-drop-title" style={{ fontSize: '0.82rem' }}>+ Add Images</p>
                    <p className="apf-drop-hint">Up to {MAX_IMAGES} images</p>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Meesho Sticky Bottom Action Bar */}
        <div className="meesho-sticky-footer">
          <button type="button" className="btn-meesho-discard" onClick={() => navigate('/admin/products')}>
            Discard and Go Back
          </button>
          <button type="submit" className="btn-meesho-submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>

      {/* AI Copy & SEO Generator Modal Popup */}
      {showAiModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAiModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '28px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAiModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#F1F5F9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '1rem',
                zIndex: 10
              }}
            >
              ✕
            </button>

            <AdminAiGenerator onApplyToCatalog={handleApplyAiContent} />
          </div>
        </div>
      )}

      {/* AI Image Enhancement Studio Modal Popup */}
      {showImageEnhancerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowImageEnhancerModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '28px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageEnhancerModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#F1F5F9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '1rem',
                zIndex: 10
              }}
            >
              ✕
            </button>

            <AdminImageEnhancer onApplyEnhancedImage={handleApplyEnhancedImage} />
          </div>
        </div>
      )}
    </div>
  );
}
