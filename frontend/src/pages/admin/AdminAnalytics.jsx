import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, Download, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../api';
import { toastSuccess } from '../../utils/toast.js';
import '../../styles/Panel.css';

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState('monthly');

  const handleExport = () => {
    toastSuccess('Report Exported!', 'Store sales report downloaded successfully.');
  };

  return (
    <div className="panel-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            📊 Analytics &amp; Revenue Hub
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Store performance metrics, sales volume, category distribution &amp; order trends.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '50px', border: '1px solid #E2E8F0', fontWeight: 700, background: 'white' }}
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>

          <button
            onClick={handleExport}
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: 'white',
              fontWeight: 800,
              padding: '10px 20px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
          <div className="stat-label" style={{ color: '#4F46E5', fontWeight: 700 }}>Total Store Revenue</div>
          <div className="stat-value" style={{ color: '#4F46E5' }}>₹2,48,950</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: 700 }}>
            <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> +18.4% vs last period
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label" style={{ fontWeight: 700 }}>Average Order Value (AOV)</div>
          <div className="stat-value">₹2,450</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: 700 }}>
            ↑ Higher item count per order
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label" style={{ fontWeight: 700 }}>Checkout Conversion Rate</div>
          <div className="stat-value">3.82%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Top 5% industry benchmark</div>
        </div>

        <div className="stat-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div className="stat-label" style={{ color: '#059669', fontWeight: 700 }}>Fulfillment Rate</div>
          <div className="stat-value" style={{ color: '#059669' }}>98.4%</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: 700 }}>Same-day express dispatch</div>
        </div>
      </div>

      {/* Visual Revenue Bars Chart */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1px solid #F1F5F9', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Revenue &amp; Sales Trend</h3>
          <span style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 700 }}>Monthly Volume (₹)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '10px 0', borderBottom: '2px solid #F1F5F9' }}>
          {[
            { month: 'Jan', val: 32000, pct: 40 },
            { month: 'Feb', val: 45000, pct: 55 },
            { month: 'Mar', val: 38000, pct: 48 },
            { month: 'Apr', val: 58000, pct: 72 },
            { month: 'May', val: 64000, pct: 80 },
            { month: 'Jun', val: 82000, pct: 100 }
          ].map((bar) => (
            <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5' }}>₹{(bar.val / 1000).toFixed(0)}k</span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '44px',
                  height: `${bar.pct}%`,
                  background: 'linear-gradient(180deg, #6366F1 0%, #A855F7 100%)',
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.5s ease'
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 800 }}>Category Sales Distribution</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { cat: 'Fashion & Apparel', pct: 38, val: '₹94,600', color: '#EC4899' },
            { cat: 'Electronics & Tech', pct: 32, val: '₹79,660', color: '#3B82F6' },
            { cat: 'Beauty & Skincare', pct: 18, val: '₹44,800', color: '#A855F7' },
            { cat: 'Massagers & Wellness', pct: 12, val: '₹29,890', color: '#F59E0B' }
          ].map((item) => (
            <div key={item.cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                <span>{item.cat} ({item.pct}%)</span>
                <span style={{ color: item.color }}>{item.val}</span>
              </div>
              <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '50px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '50px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
