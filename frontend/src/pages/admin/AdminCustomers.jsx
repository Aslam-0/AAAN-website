import { useState } from 'react';
import { Users, Search, Mail, ShieldCheck, ShoppingBag, DollarSign, UserCheck, Star } from 'lucide-react';
import '../../styles/Panel.css';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');

  const [customers] = useState([
    {
      id: 'usr-1',
      name: 'Alina Putri',
      email: 'alina.putri@gmail.com',
      ordersCount: 8,
      totalSpent: 42800,
      joinedDate: '2025-11-12',
      role: 'Customer',
      vip: true
    },
    {
      id: 'usr-2',
      name: 'Manish Kumar',
      email: 'manish.dev@gmail.com',
      ordersCount: 14,
      totalSpent: 96500,
      joinedDate: '2025-08-04',
      role: 'Admin',
      vip: true
    },
    {
      id: 'usr-3',
      name: 'Reaz Afsha',
      email: 'reazafsha0@gmail.com',
      ordersCount: 5,
      totalSpent: 28990,
      joinedDate: '2026-01-20',
      role: 'Customer',
      vip: false
    },
    {
      id: 'usr-4',
      name: 'Priya Sharma',
      email: 'priya.sharma@yahoo.com',
      ordersCount: 3,
      totalSpent: 14500,
      joinedDate: '2026-03-10',
      role: 'Customer',
      vip: false
    },
    {
      id: 'usr-5',
      name: 'Vikram Singh',
      email: 'vikram.singh@outlook.com',
      ordersCount: 6,
      totalSpent: 38200,
      joinedDate: '2026-02-01',
      role: 'Customer',
      vip: true
    }
  ]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            👥 Customer &amp; Buyer Insights
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Manage registered buyers, lifetime order values, and VIP customer status.
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '50px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <div className="stat-label" style={{ color: '#0284C7', fontWeight: 700 }}>Total Buyers</div>
          <div className="stat-value" style={{ color: '#0284C7' }}>{customers.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Registered accounts</div>
        </div>

        <div className="stat-card" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <div className="stat-label" style={{ color: '#D97706', fontWeight: 700 }}>VIP Buyers</div>
          <div className="stat-value" style={{ color: '#D97706' }}>
            {customers.filter((c) => c.vip).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>High-value repeat shoppers</div>
        </div>

        <div className="stat-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div className="stat-label" style={{ color: '#059669', fontWeight: 700 }}>Avg Customer Spend</div>
          <div className="stat-value" style={{ color: '#059669' }}>
            ₹{Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Average revenue per user</div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Total Orders</th>
              <th>Lifetime Spend</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td data-label="Customer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0F172A' }}>{c.name}</strong>
                      {c.vip && (
                        <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 800 }}>★ VIP Buyer</span>
                      )}
                    </div>
                  </div>
                </td>
                <td data-label="Email">{c.email}</td>
                <td data-label="Orders" style={{ fontWeight: 700, color: '#6366F1' }}>
                  {c.ordersCount} orders
                </td>
                <td data-label="Spent" style={{ fontWeight: 800, color: '#10B981' }}>
                  ₹{c.totalSpent.toLocaleString()}
                </td>
                <td data-label="Role">
                  <span
                    style={{
                      background: c.role === 'Admin' ? '#FEE2E2' : '#F1F5F9',
                      color: c.role === 'Admin' ? '#DC2626' : '#475569',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {c.role}
                  </span>
                </td>
                <td data-label="Joined">{c.joinedDate}</td>
                <td data-label="Status">
                  <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>● Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
