import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Mail, Send, Eye, Code, FileText, Gift, ShoppingBag, Package, Truck, Zap, HeartHandshake } from 'lucide-react';
import { generateEmailTemplate, EMAIL_TYPES } from '../../utils/emailGenerator';
import AaanLogo from '../../components/common/AaanLogo';
import { toastSuccess, toastError } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminEmailGenerator.css';

const TEMPLATES = [
  { id: EMAIL_TYPES.WELCOME, title: 'Welcome Email', icon: HeartHandshake, color: '#4F46E5', desc: 'Onboard new registered shoppers with 10% discount gift' },
  { id: EMAIL_TYPES.ABANDONED_CART, title: 'Abandoned Cart', icon: ShoppingBag, color: '#EF4444', desc: 'Recover lost sales with urgent cart item reminders' },
  { id: EMAIL_TYPES.ORDER_CONFIRMATION, title: 'Order Confirmation', icon: Package, color: '#10B981', desc: 'Send official purchase receipt & tax invoice details' },
  { id: EMAIL_TYPES.DELIVERY_UPDATE, title: 'Delivery Updates', icon: Truck, color: '#0284C7', desc: 'Notify customer when order is packed & dispatched' },
  { id: EMAIL_TYPES.PROMOTIONAL, title: 'Promotional Sale', icon: Zap, color: '#F59E0B', desc: 'Announce flash sales & mega discount promo codes' },
  { id: EMAIL_TYPES.FESTIVAL, title: 'Festival Greetings', icon: Gift, color: '#EC4899', desc: 'Festive Diwali, Eid, Christmas & New Year greetings' }
];

export default function AdminEmailGenerator() {
  const [selectedType, setSelectedType] = useState(EMAIL_TYPES.WELCOME);
  const [inputs, setInputs] = useState({
    customerName: 'Manish Kumar',
    productName: 'AAAN Luxury Silk Saree',
    orderId: 'ORD-AAAN-84920',
    discountCode: 'AAAN50',
    festivalName: 'Diwali'
  });

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'html' | 'text'
  const [emailResult, setEmailResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, [selectedType]);

  const handleGenerate = () => {
    const result = generateEmailTemplate({
      type: selectedType,
      customerName: inputs.customerName,
      productName: inputs.productName,
      orderId: inputs.orderId,
      discountCode: inputs.discountCode,
      festivalName: inputs.festivalName
    });
    setEmailResult(result);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toastSuccess('Copied to Clipboard! 📋', 'Email template code ready for Mailchimp / SendGrid.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTestEmail = () => {
    toastSuccess('Test Email Sent! 📧', `Sample campaign delivered to ${inputs.customerName || 'customer'}.`);
  };

  return (
    <div className="aaan-email-studio-shell">
      {/* Hero Banner */}
      <div className="email-studio-hero">
        <div>
          <div className="email-hub-badge">
            <AaanLogo size="sm" light={true} />
            <span>AAAN AI Campaign Engine</span>
          </div>
          <h2>✉️ AI Email Campaign &amp; Template Generator</h2>
          <p>Generate high-converting Welcome, Abandoned Cart, Shipping, Promo &amp; Festival emails in seconds.</p>
        </div>

        <button onClick={handleSendTestEmail} className="btn-send-test">
          <Send size={16} /> Send Test Campaign
        </button>
      </div>

      {/* Template Picker Grid */}
      <div className="template-picker-grid">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          const active = selectedType === t.id;
          return (
            <div
              key={t.id}
              className={`template-card ${active ? 'active' : ''}`}
              onClick={() => setSelectedType(t.id)}
            >
              <div className="template-icon-wrap" style={{ background: `${t.color}15`, color: t.color }}>
                <Icon size={22} />
              </div>
              <div>
                <strong className="template-title">{t.title}</strong>
                <p className="template-desc">{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Studio Grid */}
      <div className="email-studio-grid">
        
        {/* Left Column: Form Controls */}
        <div className="email-controls-col">
          <div className="email-card">
            <h3 className="email-card-title">⚙️ Campaign Parameters</h3>

            <div className="email-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={inputs.customerName}
                onChange={(e) => setInputs({ ...inputs, customerName: e.target.value })}
                placeholder="e.g. Manish Kumar"
                className="email-input"
              />
            </div>

            {selectedType === EMAIL_TYPES.ABANDONED_CART && (
              <div className="email-group">
                <label>Cart Product Name</label>
                <input
                  type="text"
                  value={inputs.productName}
                  onChange={(e) => setInputs({ ...inputs, productName: e.target.value })}
                  placeholder="e.g. AAAN Silk Saree"
                  className="email-input"
                />
              </div>
            )}

            {(selectedType === EMAIL_TYPES.ORDER_CONFIRMATION || selectedType === EMAIL_TYPES.DELIVERY_UPDATE) && (
              <div className="email-group">
                <label>Order ID</label>
                <input
                  type="text"
                  value={inputs.orderId}
                  onChange={(e) => setInputs({ ...inputs, orderId: e.target.value })}
                  placeholder="e.g. ORD-AAAN-98421"
                  className="email-input"
                />
              </div>
            )}

            {selectedType === EMAIL_TYPES.PROMOTIONAL && (
              <div className="email-group">
                <label>Discount Promo Code</label>
                <input
                  type="text"
                  value={inputs.discountCode}
                  onChange={(e) => setInputs({ ...inputs, discountCode: e.target.value })}
                  placeholder="e.g. AAAN50"
                  className="email-input"
                />
              </div>
            )}

            {selectedType === EMAIL_TYPES.FESTIVAL && (
              <div className="email-group">
                <label>Festival Name</label>
                <input
                  type="text"
                  value={inputs.festivalName}
                  onChange={(e) => setInputs({ ...inputs, festivalName: e.target.value })}
                  placeholder="e.g. Diwali, Eid, Christmas"
                  className="email-input"
                />
              </div>
            )}

            <button onClick={handleGenerate} className="btn-generate-email">
              <Sparkles size={18} /> ✨ Re-Generate Email Campaign
            </button>
          </div>
        </div>

        {/* Right Column: Live Email Studio Preview & Code Export */}
        <div className="email-preview-col">
          {emailResult && (
            <div className="email-card">
              
              {/* Inbox Header Snippet Bar */}
              <div className="inbox-header-snippet">
                <div className="inbox-row">
                  <span className="inbox-label">Subject:</span>
                  <strong className="inbox-val">{emailResult.subject}</strong>
                </div>
                <div className="inbox-row">
                  <span className="inbox-label">Preheader:</span>
                  <span className="inbox-val-dim">{emailResult.preheader}</span>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="studio-tabs-bar">
                <div className="tabs-left">
                  <button
                    className={`studio-tab ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye size={15} /> Rendered Preview
                  </button>
                  <button
                    className={`studio-tab ${activeTab === 'html' ? 'active' : ''}`}
                    onClick={() => setActiveTab('html')}
                  >
                    <Code size={15} /> HTML Code
                  </button>
                  <button
                    className={`studio-tab ${activeTab === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text')}
                  >
                    <FileText size={15} /> Plain Text
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(activeTab === 'text' ? emailResult.plainText : emailResult.html)}
                  className="btn-copy-code"
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              {/* Studio Display Content */}
              <div className="studio-display-area">
                {activeTab === 'preview' && (
                  <iframe
                    title="Email Render Preview"
                    srcDoc={emailResult.html}
                    className="email-iframe-preview"
                  />
                )}

                {activeTab === 'html' && (
                  <pre className="code-block-view">
                    <code>{emailResult.html}</code>
                  </pre>
                )}

                {activeTab === 'text' && (
                  <pre className="code-block-view">
                    <code>{emailResult.plainText}</code>
                  </pre>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
