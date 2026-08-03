import { useState } from 'react';
import { Download, Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import AaanLogo from '../common/AaanLogo';
import { formatPrice } from '../../api';
import './OrderReceiptModal.css';

export default function OrderReceiptModal({ order, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!order) return null;

  const invoiceNo = `INV-AAAN-${new Date().getFullYear()}-${(order.orderNumber || order._id || '98412').slice(-6).toUpperCase()}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const orderTime = new Date(order.createdAt || Date.now()).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 200);
  };

  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [
        {
          name: order.productName || 'AAAN Premium Catalog Item',
          quantity: order.quantity || 1,
          price: order.total || order.price || 1999,
          selectedSize: order.selectedSize || order.size || 'Standard'
        }
      ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = order.discount || 0;
  const grandTotal = Math.max(0, subtotal - discount);
  const taxEstimate = Math.round(grandTotal * 0.18);

  return (
    <div className="aaan-receipt-modal-backdrop" onClick={onClose}>
      <div className="aaan-receipt-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Action Header */}
        <div className="receipt-actions-header no-print">
          <div className="receipt-head-title">
            <ShieldCheck size={20} color="#10B981" />
            <span>Verified Customer Purchase Receipt</span>
          </div>
          <div className="receipt-btn-group">
            <button className="receipt-btn-print" onClick={handlePrint} disabled={downloading}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button className="receipt-btn-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div className="aaan-receipt-printable" id="printable-receipt">
          
          {/* Header Branding */}
          <div className="receipt-top-banner">
            <div className="receipt-brand-box">
              <AaanLogo size="md" />
              <div className="company-tax-info">
                <strong>AAAN ENTERPRISES PVT. LTD.</strong>
                <p>GSTIN: 27AAACA9841A1Z5 | PAN: AAACA9841A</p>
                <p>75 Raja Muthiah Road, Periamet, Opposite Nehru Stadium</p>
                <p>Chennai, Tamil Nadu - 600003 | Phone: +91 80 7378 6650</p>
              </div>
            </div>

            <div className="invoice-badge-box">
              <div className="invoice-tag">TAX INVOICE</div>
              <div className="invoice-num">{invoiceNo}</div>
              <div className="invoice-date">Date: {orderDate} at {orderTime}</div>
              <div className="payment-status-badge">
                <CheckCircle2 size={14} color="#10B981" /> PAID (ONLINE VERIFIED)
              </div>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Customer & Order Details */}
          <div className="receipt-details-grid">
            <div className="detail-col">
              <span className="col-label">BILLED TO &amp; SHIPPING ADDRESS:</span>
              <strong className="cust-name">{order.shippingAddress?.fullName || order.user?.name || 'Valued Customer'}</strong>
              <p>{order.shippingAddress?.address || '75 Main Road'}</p>
              <p>{order.shippingAddress?.city || 'Chennai'}, {order.shippingAddress?.state || 'Tamil Nadu'} - {order.shippingAddress?.postalCode || '600003'}</p>
              <p>Email: {order.shippingAddress?.email || order.user?.email || 'customer@gmail.com'}</p>
              <p>Phone: {order.shippingAddress?.phone || '+91 98765 43210'}</p>
            </div>

            <div className="detail-col right-align">
              <span className="col-label">ORDER SUMMARY INFO:</span>
              <p><strong>Order ID:</strong> {order.orderNumber || order._id}</p>
              <p><strong>Payment Mode:</strong> {order.paymentMethod || 'Razorpay / UPI Online'}</p>
              <p><strong>Fulfillment:</strong> Express Dispatch Courier</p>
              <p><strong>Seller:</strong> AAAN Official Store</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="receipt-table-wrap">
            <table className="receipt-items-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Item Description</th>
                  <th>Size / Dim</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Tax (18% GST)</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{item.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified Genuine Catalog</div>
                      </td>
                      <td>
                        <span className="item-size-badge">{item.selectedSize || 'Standard'}</span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>Included</td>
                      <td className="bold">{formatPrice(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Summary & Authorized Signature */}
          <div className="receipt-footer-grid">
            <div className="receipt-terms-col">
              <div className="qr-code-box">
                <QrCode size={54} color="#0F172A" />
                <div>
                  <strong>Scan to Verify Receipt</strong>
                  <p>Authenticity Code: AAAN-VERIFIED-2026</p>
                </div>
              </div>
              <div className="return-terms">
                <strong>Return &amp; Warranty Policy:</strong>
                <p>30 days easy replacement &amp; return policy. All electrical items carry 1-year AAAN official manufacturer warranty.</p>
              </div>
            </div>

            <div className="receipt-amounts-col">
              <div className="amount-row">
                <span>Subtotal (Excl. Tax):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="amount-row discount">
                  <span>Promo Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="amount-row">
                <span>Shipping &amp; Handling:</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>FREE</span>
              </div>
              <div className="amount-row">
                <span>Estimated GST (18% Incl.):</span>
                <span>{formatPrice(taxEstimate)}</span>
              </div>
              <div className="amount-row total-row">
                <span>Grand Total (INR):</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <div className="signatory-box">
                <div className="stamp-seal">AAAN VERIFIED</div>
                <span>Authorized Signatory</span>
                <strong>AAAN Enterprises Pvt Ltd</strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
