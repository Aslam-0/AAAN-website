import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Copy, Check, Key, Bot, HelpCircle, FileText, Tag, Search, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { generateProductContent } from '../../utils/aiGenerator';
import AaanLogo from '../../components/common/AaanLogo';
import { toastSuccess, toastError } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminAiGenerator.css';

export default function AdminAiGenerator({ onApplyToCatalog }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: '',
    features: '',
    specifications: '',
    provider: 'gemini',
    apiKey: ''
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Load saved API keys from localStorage
  useEffect(() => {
    const savedKeys = JSON.parse(localStorage.getItem('aaan_ai_keys') || '{}');
    if (savedKeys[form.provider]) {
      setForm((prev) => ({ ...prev, apiKey: savedKeys[form.provider] }));
    }
  }, [form.provider]);

  const handleSaveKey = () => {
    if (!form.apiKey.trim()) return;
    const savedKeys = JSON.parse(localStorage.getItem('aaan_ai_keys') || '{}');
    savedKeys[form.provider] = form.apiKey.trim();
    localStorage.setItem('aaan_ai_keys', JSON.stringify(savedKeys));
    toastSuccess('API Key Saved!', `${form.provider.toUpperCase()} API Key saved for future AI generations.`);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      toastError('Product Name Required', 'Please enter a product name to generate content.');
      return;
    }

    setLoading(true);
    try {
      const res = await generateProductContent(form);
      setOutput(res);
      toastSuccess('AI Content Generated! ✨', 'Professional copy, bullet points & SEO metadata created.');
    } catch (err) {
      toastError('Generation Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toastSuccess('Copied!', 'Text copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApply = () => {
    if (!output) return;
    if (onApplyToCatalog) {
      onApplyToCatalog(output);
      toastSuccess('Applied to Catalog!', 'AI Description & SEO metadata attached.');
    } else {
      navigate('/admin/products/new', { state: { aiContent: output } });
    }
  };

  return (
    <div className="aaan-ai-studio-shell">
      {/* Hero Banner */}
      <div className="ai-studio-hero">
        <div>
          <div className="ai-hub-badge">
            <AaanLogo size="sm" light={true} />
            <span>AAAN AI Copywriter &amp; SEO Engine</span>
          </div>
          <h2>🤖 AI Product Description &amp; SEO Generator</h2>
          <p>Instant professional copy, feature bullet points, SEO titles, meta tags &amp; FAQs powered by AI.</p>
        </div>

        <div className="ai-provider-badge">
          <Sparkles size={18} color="#FFE600" />
          <span>Multi-Provider AI Engine</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="ai-studio-grid">
        
        {/* Left Column: Inputs & API Key Setup */}
        <div className="ai-input-column">
          
          {/* Card 1: AI Provider & API Key Setup */}
          <div className="ai-card">
            <h3 className="ai-card-title">
              <Key size={18} color="#6366F1" /> AI Engine Provider &amp; API Keys
            </h3>

            <div className="ai-group">
              <label>Choose AI Provider</label>
              <select
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="ai-select"
              >
                <option value="gemini">Google Gemini API (Gemini 1.5 Flash)</option>
                <option value="openrouter">OpenRouter API (GPT-3.5 / Claude)</option>
                <option value="huggingface">Hugging Face API (Mistral 7B / Llama 3)</option>
                <option value="fallback">Built-in AAAN Smart AI Copywriter</option>
              </select>
            </div>

            {form.provider !== 'fallback' && (
              <div className="ai-group">
                <label>{form.provider.toUpperCase()} API Key</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder={`Enter your ${form.provider} API key...`}
                    value={form.apiKey}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    className="ai-input"
                  />
                  <button type="button" onClick={handleSaveKey} className="btn-save-key" title="Save API Key">
                    Save Key
                  </button>
                </div>
                <span className="key-hint">Keys saved securely in local browser storage.</span>
              </div>
            )}
          </div>

          {/* Card 2: Input Details Form */}
          <form className="ai-card" onSubmit={handleGenerate}>
            <h3 className="ai-card-title">
              <Bot size={18} color="#10B981" /> Product Input Details
            </h3>

            <div className="ai-group">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. AAAN Ultra Smart Watch Series 9"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                required
                className="ai-input"
              />
            </div>

            <div className="ai-group">
              <label>Key Features &amp; Highlights</label>
              <textarea
                placeholder="e.g. 1.96-inch AMOLED display, Bluetooth calling, 7-day battery life, IP68 water resistant"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={3}
                className="ai-textarea"
              />
            </div>

            <div className="ai-group">
              <label>Technical Specifications</label>
              <textarea
                placeholder="e.g. Aluminum alloy casing, Silicone strap, Wireless charging, 320mAh battery"
                value={form.specifications}
                onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                rows={3}
                className="ai-textarea"
              />
            </div>

            <button type="submit" className="btn-generate-ai" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Generating AI Copy…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> ✨ Generate Copy &amp; SEO
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: AI Generated Output Cards */}
        <div className="ai-output-column">
          {output ? (
            <>
              {/* Header Actions */}
              <div className="ai-output-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>🎉 AI Content Ready</h3>
                  <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '2px 0 0' }}>
                    1-Click to copy or apply directly to catalog form.
                  </p>
                </div>

                <button onClick={handleApply} className="btn-apply-catalog">
                  Apply to New Catalog <ArrowRight size={16} />
                </button>
              </div>

              {/* Card A: Professional Description */}
              <div className="ai-card">
                <div className="output-card-head">
                  <h4 className="output-title"><FileText size={16} color="#4F46E5" /> Professional Description</h4>
                  <button
                    onClick={() => handleCopyText(output.professionalDescription, 'desc')}
                    className="btn-copy-sm"
                  >
                    {copiedKey === 'desc' ? <Check size={14} color="#10B981" /> : <Copy size={14} />} Copy
                  </button>
                </div>
                <div className="output-text-content">{output.professionalDescription}</div>
              </div>

              {/* Card B: Bullet Points */}
              <div className="ai-card">
                <div className="output-card-head">
                  <h4 className="output-title"><Tag size={16} color="#7C3AED" /> Feature Bullet Points</h4>
                  <button
                    onClick={() => handleCopyText(output.bulletPoints.join('\n'), 'bullets')}
                    className="btn-copy-sm"
                  >
                    {copiedKey === 'bullets' ? <Check size={14} color="#10B981" /> : <Copy size={14} />} Copy All
                  </button>
                </div>
                <ul className="output-bullets-list">
                  {output.bulletPoints.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>

              {/* Card C: SEO Title & Meta Description */}
              <div className="ai-card">
                <h4 className="output-title" style={{ marginBottom: '14px' }}>
                  <Search size={16} color="#0284C7" /> Search Engine Optimization (SEO)
                </h4>

                <div className="seo-block">
                  <div className="seo-head">
                    <label>SEO Title Tag ({output.seoTitle.length}/60 chars)</label>
                    <button onClick={() => handleCopyText(output.seoTitle, 'seoTitle')} className="btn-copy-xs">
                      {copiedKey === 'seoTitle' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="seo-snippet-title">{output.seoTitle}</div>
                </div>

                <div className="seo-block" style={{ marginTop: '12px' }}>
                  <div className="seo-head">
                    <label>Meta Description ({output.metaDescription.length}/155 chars)</label>
                    <button onClick={() => handleCopyText(output.metaDescription, 'metaDesc')} className="btn-copy-xs">
                      {copiedKey === 'metaDesc' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="seo-snippet-desc">{output.metaDescription}</div>
                </div>

                {/* Keywords Chips */}
                <div style={{ marginTop: '14px' }}>
                  <label className="seo-head" style={{ marginBottom: '6px', display: 'block' }}>SEO Keywords</label>
                  <div className="keywords-flex">
                    {output.keywords.map((kw, i) => (
                      <span key={i} className="kw-chip">#{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card D: Customer FAQs */}
              <div className="ai-card">
                <div className="output-card-head">
                  <h4 className="output-title"><HelpCircle size={16} color="#F59E0B" /> Customer FAQs</h4>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(output.faqs, null, 2), 'faqs')}
                    className="btn-copy-sm"
                  >
                    {copiedKey === 'faqs' ? <Check size={14} color="#10B981" /> : <Copy size={14} />} Copy JSON
                  </button>
                </div>
                <div className="faqs-output-list">
                  {output.faqs.map((faq, i) => (
                    <div key={i} className="faq-output-item">
                      <strong>Q: {faq.question}</strong>
                      <p>A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

            </>
          ) : (
            <div className="ai-empty-output-card">
              <Sparkles size={48} color="#6366F1" />
              <h3>Ready to Generate Copy &amp; SEO</h3>
              <p>Enter your product name and features on the left, then click <strong>"Generate Copy &amp; SEO"</strong> to produce professional descriptions, meta tags, bullet points &amp; FAQs instantly.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
