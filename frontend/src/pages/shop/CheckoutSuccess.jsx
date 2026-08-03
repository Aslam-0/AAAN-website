import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Download, Printer } from 'lucide-react';
import { fetchOrder, formatPrice } from '../../api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import OrderReceiptModal from '../../components/shop/OrderReceiptModal';
import { toastSuccess, toastError } from '../../utils/toast.js';
import './Checkout.css';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    toastSuccess('Payment successful! 🎉', 'Your order has been confirmed.');
    if (orderId) {
      fetchOrder(orderId)
        .then(setOrder)
        .catch(() => toastError('Could not load order', 'Your payment went through — check Order History.'));
    }
  }, [orderId]);

  return (
    <>
      <Navbar />
      <div className="success-page">
        <div className="success-card success-stack">
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={36} />
            </div>
            <div>
              <h1>Payment Successful!</h1>
              <p>Thank you for your purchase from AAAN Enterprises. Your order is confirmed.</p>
            </div>
          </div>

          {order && (
            <div className="success-meta-grid">
              <div className="success-meta-box">
                <strong>Order ID</strong>
                <span>{order.orderNumber}</span>
              </div>
              <div className="success-meta-box">
                <strong>Total Amount</strong>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="success-meta-box">
                <strong>Status</strong>
                <span>{order.status}</span>
              </div>
            </div>
          )}

          <div
            style={{
              background: '#EEF2FF',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid #C7D2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '16px'
            }}
          >
            <div>
              <strong style={{ color: '#4F46E5', fontSize: '0.95rem' }}>📄 Official Tax Invoice Available</strong>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: '2px 0 0' }}>
                Download or print your official AAAN purchase receipt for your records.
              </p>
            </div>
            <button
              onClick={() => setShowReceipt(true)}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Download size={16} /> Download Receipt
            </button>
          </div>

          <p style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', color: '#64748B' }}>
            <Mail size={16} /> Order confirmation &amp; receipt saved in account records.
          </p>

          <div className="success-actions">
            <Link to="/account" className="btn btn-sky">View Order History</Link>
            <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>

      {showReceipt && (
        <OrderReceiptModal
          order={order || {
            orderNumber: orderId || 'ORD-98412',
            total: 2499,
            createdAt: new Date().toISOString(),
            status: 'Confirmed',
            items: []
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}

      <Footer />
    </>
  );
}
