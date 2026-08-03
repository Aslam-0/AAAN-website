import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, FileText } from 'lucide-react';
import { fetchMyOrders, formatPrice, getStatusLabel, getStatusColor } from '../../api';
import OrderReceiptModal from '../../components/shop/OrderReceiptModal';
import OrderTimeline from '../../components/shop/OrderTimeline';
import '../../styles/Panel.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
      <h1>Order History</h1>
      <p className="panel-subtitle">Track your purchases, view order details &amp; download tax receipts</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No orders yet</h3>
          <p>Start shopping to see your order history here.</p>
          <Link to="/" className="btn btn-sky" style={{ marginTop: 16 }}>Shop Now</Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <strong>{order.orderNumber}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  className="status-badge"
                  style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
                <button
                  onClick={() => setSelectedReceiptOrder(order)}
                  style={{
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    border: '1px solid #C7D2FE',
                    padding: '6px 14px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Download Receipt
                </button>
              </div>
            </div>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="order-item-image-placeholder" aria-hidden="true" />
                  )}
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{item.name}</strong>
                    {item.selectedSize && (
                      <span style={{ fontSize: '0.75rem', color: '#6366F1', fontWeight: 700 }}>
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* 6-Stage Order Tracking Timeline */}
            <OrderTimeline order={order} />

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setSelectedReceiptOrder(order)}
                style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FileText size={16} /> View Tax Invoice
              </button>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                Total: {formatPrice(order.total)}
              </div>
            </div>
          </div>
        ))
      )}

      {selectedReceiptOrder && (
        <OrderReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </>
  );
}
