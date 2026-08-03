import { useState } from 'react';
import { Tag, Plus, Trash2, Copy, Check, Percent, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { toastSuccess } from '../../utils/toast.js';
import '../../styles/Panel.css';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([
    {
      id: 'c1',
      code: 'AAAN50',
      type: 'percentage',
      value: 50,
      minOrder: 499,
      usageCount: 142,
      maxUsage: 500,
      expiry: '2026-12-31',
      active: true
    },
    {
      id: 'c2',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrder: 299,
      usageCount: 88,
      maxUsage: 1000,
      expiry: '2026-10-15',
      active: true
    },
    {
      id: 'c3',
      code: 'FLAT500',
      type: 'flat',
      value: 500,
      minOrder: 1999,
      usageCount: 34,
      maxUsage: 200,
      expiry: '2026-09-01',
      active: true
    }
  ]);

  const [copiedId, setCopiedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    maxUsage: 100,
    expiry: ''
  });

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toastSuccess('Code Copied!', `${code} copied to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.code || !form.value) return;
    const newCoupon = {
      id: `c-${Date.now()}`,
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: parseFloat(form.value),
      minOrder: parseFloat(form.minOrder) || 0,
      usageCount: 0,
      maxUsage: parseInt(form.maxUsage) || 100,
      expiry: form.expiry || '2026-12-31',
      active: true
    };
    setCoupons([newCoupon, ...coupons]);
    setShowModal(false);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxUsage: 100, expiry: '' });
    toastSuccess('Coupon Created!', `Promo code ${newCoupon.code} is now live.`);
  };

  const toggleActive = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toastSuccess('Coupon Removed', 'Promo code has been deleted.');
  };

  return (
    <div className="panel-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            🎟️ Coupons &amp; Promo Codes
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Create and manage store discount codes, minimum order requirements &amp; usage limits.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            fontWeight: 800,
            padding: '12px 24px',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)'
          }}
        >
          <Plus size={18} /> Create New Coupon
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
          <div className="stat-label" style={{ color: '#4F46E5', fontWeight: 700 }}>Active Coupons</div>
          <div className="stat-value" style={{ color: '#4F46E5' }}>{coupons.filter(c => c.active).length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Ready for customer use</div>
        </div>

        <div className="stat-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div className="stat-label" style={{ color: '#059669', fontWeight: 700 }}>Total Redemptions</div>
          <div className="stat-value" style={{ color: '#059669' }}>
            {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Successful coupon uses</div>
        </div>

        <div className="stat-card" style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
          <div className="stat-label" style={{ color: '#E11D48', fontWeight: 700 }}>Customer Savings</div>
          <div className="stat-value" style={{ color: '#E11D48' }}>₹48,950</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Total discount granted</div>
        </div>
      </div>

      {/* Coupons List Grid */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Redemptions</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td data-label="Code">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#F1F5F9',
                        border: '1.5px dashed #6366F1',
                        color: '#4F46E5',
                        fontWeight: 800,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        letterSpacing: '1px',
                        fontFamily: 'monospace'
                      }}
                    >
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleCopy(c.code, c.id)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}
                      title="Copy code"
                    >
                      {copiedId === c.id ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td data-label="Discount" style={{ fontWeight: 800, color: '#0F172A' }}>
                  {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </td>
                <td data-label="Min Order">₹{c.minOrder}</td>
                <td data-label="Usage">
                  <strong style={{ color: '#4F46E5' }}>{c.usageCount}</strong> / {c.maxUsage}
                </td>
                <td data-label="Expiry">{c.expiry}</td>
                <td data-label="Status">
                  <button
                    onClick={() => toggleActive(c.id)}
                    style={{
                      border: 'none',
                      background: c.active ? '#DCFCE7' : '#F1F5F9',
                      color: c.active ? '#15803D' : '#64748B',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    {c.active ? '● Active' : 'Inactive'}
                  </button>
                </td>
                <td data-label="Actions">
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                    title="Delete coupon"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', fontWeight: 800 }}>Create New Promo Code</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>COUPON CODE</label>
                <input
                  type="text"
                  placeholder="e.g. AAAN50"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', textTransform: 'uppercase', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>TYPE</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>VALUE</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>MIN ORDER (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 499"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>MAX USES</label>
                  <input
                    type="number"
                    value={form.maxUsage}
                    onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>EXPIRY DATE</label>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    fontWeight: 700,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
