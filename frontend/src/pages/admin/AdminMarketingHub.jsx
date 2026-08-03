import { useState } from 'react';
import { Sparkles, Tag, Zap, Clock, Users, Award, Send, Bell, Gift, Percent, PlusCircle, Check, Copy, Share2, ArrowRight } from 'lucide-react';
import AaanLogo from '../../components/common/AaanLogo';
import { toastSuccess, toastError } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminMarketingHub.css';

export default function AdminMarketingHub() {
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'flash' | 'affiliate' | 'loyalty' | 'broadcast'

  // Coupons state
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'AAAN50', type: 'percentage', value: 50, minSpend: 499, usageCount: 184, active: true },
    { id: '2', code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 0, usageCount: 412, active: true },
    { id: '3', code: 'FLAT500', type: 'flat', value: 500, minSpend: 1999, usageCount: 92, active: true },
    { id: '4', code: 'BUY2GET1', type: 'bogo', value: 'Buy 2 Get 1 Free', minSpend: 999, usageCount: 65, active: true }
  ]);

  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '', minSpend: 0 });

  // Broadcast state
  const [broadcast, setBroadcast] = useState({ type: 'sms', audience: 'all', title: '', message: '' });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.value) {
      toastError('Missing Fields', 'Please enter coupon code and discount value.');
      return;
    }

    const created = {
      id: `c-${Date.now()}`,
      code: newCoupon.code.trim().toUpperCase(),
      type: newCoupon.type,
      value: newCoupon.value,
      minSpend: parseInt(newCoupon.minSpend, 10) || 0,
      usageCount: 0,
      active: true
    };

    setCoupons([created, ...coupons]);
    setNewCoupon({ code: '', type: 'percentage', value: '', minSpend: 0 });
    toastSuccess('Coupon Code Created!', `${created.code} is now live.`);
  };

  const toggleCouponStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toastSuccess('Status Updated', 'Coupon state updated.');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcast.title || !broadcast.message) {
      toastError('Missing Content', 'Please enter title and message content.');
      return;
    }

    setSendingBroadcast(true);
    setTimeout(() => {
      setSendingBroadcast(false);
      toastSuccess(
        `${broadcast.type.toUpperCase()} Campaign Sent! 🚀`,
        `Broadcast delivered to ${broadcast.audience === 'all' ? '12,480 customers' : 'VIP Buyers'}.`
      );
      setBroadcast({ type: 'sms', audience: 'all', title: '', message: '' });
    }, 1000);
  };

  return (
    <div className="aaan-mktg-studio-shell">
      {/* Hero Banner */}
      <div className="mktg-studio-hero">
        <div>
          <div className="mktg-hub-badge">
            <AaanLogo size="sm" light={true} />
            <span>AAAN Marketing &amp; Growth Studio</span>
          </div>
          <h2>🎯 Marketing, Offers &amp; Referral Automation</h2>
          <p>Manage Coupons, Buy X Get Y, Flash Sales, Affiliate Referrals, Loyalty Tiers &amp; SMS Broadcasts.</p>
        </div>

        <div className="mktg-kpi-pill">
          <span>Active Campaigns</span>
          <strong>14 Active Deals</strong>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="mktg-tabs-bar">
        <button className={`mktg-tab ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>
          <Tag size={16} /> Coupons &amp; BOGO Offers
        </button>
        <button className={`mktg-tab ${activeTab === 'flash' ? 'active' : ''}`} onClick={() => setActiveTab('flash')}>
          <Zap size={16} /> Flash Sales &amp; Countdown Deals
        </button>
        <button className={`mktg-tab ${activeTab === 'affiliate' ? 'active' : ''}`} onClick={() => setActiveTab('affiliate')}>
          <Users size={16} /> Affiliate &amp; Referral System
        </button>
        <button className={`mktg-tab ${activeTab === 'loyalty' ? 'active' : ''}`} onClick={() => setActiveTab('loyalty')}>
          <Award size={16} /> Loyalty Tiers (Silver/Gold/Platinum)
        </button>
        <button className={`mktg-tab ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}>
          <Send size={16} /> Push &amp; SMS Campaign Studio
        </button>
      </div>

      {/* Tab 1: Coupons & Buy X Get Y */}
      {activeTab === 'coupons' && (
        <div className="mktg-grid">
          
          {/* Create Coupon Form */}
          <div className="mktg-card">
            <h3 className="mktg-card-title">🎟️ Create Coupon / Buy X Get Y Offer</h3>
            <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="mktg-label">Coupon Promo Code *</label>
                <input
                  type="text"
                  placeholder="e.g. AAAN50 or BUY2GET1"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="mktg-input"
                  required
                />
              </div>

              <div>
                <label className="mktg-label">Offer Type</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  className="mktg-select"
                >
                  <option value="percentage">Percentage OFF (%)</option>
                  <option value="flat">Flat Discount (₹)</option>
                  <option value="bogo">Buy X Get Y Free (BOGO)</option>
                </select>
              </div>

              <div>
                <label className="mktg-label">Discount Value / Description *</label>
                <input
                  type="text"
                  placeholder={newCoupon.type === 'bogo' ? 'e.g. Buy 2 Get 1 Free' : 'e.g. 50 or 500'}
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                  className="mktg-input"
                  required
                />
              </div>

              <div>
                <label className="mktg-label">Minimum Order Spend (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 499"
                  value={newCoupon.minSpend}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                  className="mktg-input"
                />
              </div>

              <button type="submit" className="btn-mktg-primary">
                + Create Promo Code
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="mktg-card">
            <h3 className="mktg-card-title">📜 Active Promo &amp; BOGO Offers ({coupons.length})</h3>
            <div className="coupons-table-wrap">
              <table className="mktg-table">
                <thead>
                  <tr>
                    <th>Promo Code</th>
                    <th>Discount</th>
                    <th>Min Spend</th>
                    <th>Usages</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td><strong style={{ fontFamily: 'monospace', color: '#4F46E5', fontSize: '1rem' }}>{c.code}</strong></td>
                      <td>{c.type === 'percentage' ? `${c.value}% OFF` : c.type === 'flat' ? `₹${c.value} OFF` : c.value}</td>
                      <td>₹{c.minSpend}</td>
                      <td>{c.usageCount} uses</td>
                      <td>
                        <button
                          onClick={() => toggleCouponStatus(c.id)}
                          className={`status-chip ${c.active ? 'active' : 'inactive'}`}
                        >
                          {c.active ? 'Active ✓' : 'Paused ⏸'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Flash Sales & Daily Deals */}
      {activeTab === 'flash' && (
        <div className="mktg-card">
          <h3 className="mktg-card-title">⚡ Flash Sales &amp; Countdown Deals Scheduler</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#FEF3C7', padding: '20px', borderRadius: '18px', border: '1px solid #FCD34D' }}>
              <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 800 }}>LIVE COUNTDOWN CAMPAIGN</span>
              <h4 style={{ fontSize: '1.2rem', color: '#92400E', margin: '4px 0 8px' }}>🔥 24-Hour Midnight Flash Sale</h4>
              <p style={{ fontSize: '0.88rem', color: '#B45309' }}>Countdown timer displayed live on storefront header: <strong>04h : 18m : 42s remaining</strong></p>
              <button onClick={() => toastSuccess('Flash Sale Active', 'Storefront timer updated.')} className="btn-mktg-primary" style={{ background: '#D97706' }}>
                Update Timer Duration
              </button>
            </div>

            <div style={{ background: '#EEF2FF', padding: '20px', borderRadius: '18px', border: '1px solid #C7D2FE' }}>
              <span style={{ fontSize: '0.78rem', color: '#4F46E5', fontWeight: 800 }}>DAILY DEALS PROGRAM</span>
              <h4 style={{ fontSize: '1.2rem', color: '#1E1B4B', margin: '4px 0 8px' }}>🎁 Today's Super Deal (50% OFF)</h4>
              <p style={{ fontSize: '0.88rem', color: '#4338CA' }}>Auto-selects 4 top-selling products for daily discounted showcase.</p>
              <button onClick={() => toastSuccess('Daily Deal Updated', 'New product deals selected.')} className="btn-mktg-primary">
                Auto-Select Daily Deals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Affiliate & Referral System */}
      {activeTab === 'affiliate' && (
        <div className="mktg-card">
          <h3 className="mktg-card-title">👥 Affiliate &amp; Customer Referral System</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Customers get ₹250 wallet credit for every friend who places their first order.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '20px 0' }}>
            <div className="stat-box-card">
              <span>Total Affiliates</span>
              <strong>1,420 Promoters</strong>
            </div>
            <div className="stat-box-card">
              <span>Referral Sales Volume</span>
              <strong>₹4,85,000</strong>
            </div>
            <div className="stat-box-card">
              <span>Commission Paid (10%)</span>
              <strong>₹48,500</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Loyalty Tiers */}
      {activeTab === 'loyalty' && (
        <div className="mktg-card">
          <h3 className="mktg-card-title">🏆 Customer Loyalty Tiers &amp; Rewards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="tier-card silver">
              <h4>🥈 Silver Tier</h4>
              <p>Spend ₹0 - ₹4,999</p>
              <ul>
                <li>✓ Standard Reward Points</li>
                <li>✓ Basic Email Deals</li>
              </ul>
            </div>

            <div className="tier-card gold">
              <h4>🥇 Gold Tier</h4>
              <p>Spend ₹5,000 - ₹19,999</p>
              <ul>
                <li>✓ 1.25x Reward Points</li>
                <li>✓ Free Express Shipping</li>
                <li>✓ Early Sale Access</li>
              </ul>
            </div>

            <div className="tier-card platinum">
              <h4>💎 Platinum VIP</h4>
              <p>Spend ₹20,000+</p>
              <ul>
                <li>✓ 1.5x Reward Points</li>
                <li>✓ Priority 24/7 Human Agent</li>
                <li>✓ Exclusive VIP Gifts</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Push & SMS Broadcast Studio */}
      {activeTab === 'broadcast' && (
        <div className="mktg-card">
          <h3 className="mktg-card-title">📲 Push Notification &amp; SMS Campaign Broadcast</h3>
          
          <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="mktg-label">Channel</label>
                <select value={broadcast.type} onChange={(e) => setBroadcast({ ...broadcast, type: e.target.value })} className="mktg-select">
                  <option value="sms">SMS Text Broadcast</option>
                  <option value="push">Browser Push Notification</option>
                  <option value="whatsapp">WhatsApp Business Campaign</option>
                </select>
              </div>

              <div>
                <label className="mktg-label">Target Audience Segment</label>
                <select value={broadcast.audience} onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })} className="mktg-select">
                  <option value="all">All Registered Customers (12,480)</option>
                  <option value="vip">Platinum &amp; Gold VIP Buyers (1,840)</option>
                  <option value="cart_abandoners">Recent Cart Abandoners (320)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mktg-label">Campaign Title / Headline *</label>
              <input
                type="text"
                placeholder="e.g. 🎉 50% OFF Flash Sale Starts Now!"
                value={broadcast.title}
                onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                className="mktg-input"
                required
              />
            </div>

            <div>
              <label className="mktg-label">Message Body / Content *</label>
              <textarea
                placeholder="Write message copy with offer link..."
                rows={4}
                value={broadcast.message}
                onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                className="mktg-textarea"
                required
              />
            </div>

            <button type="submit" className="btn-mktg-primary" disabled={sendingBroadcast}>
              {sendingBroadcast ? 'Broadcasting…' : '🚀 Launch Broadcast Campaign'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
