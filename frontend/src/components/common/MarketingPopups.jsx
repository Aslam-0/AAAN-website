import { useState, useEffect } from 'react';
import { Zap, X, Gift, Copy, Check, Users, Award, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { toastSuccess } from '../../utils/toast.js';
import './MarketingPopups.css';

export function FlashSaleCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 18, seconds: 42 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n) => String(n).padStart(2, '0');

  return (
    <div className="flash-sale-countdown-bar">
      <div className="container countdown-inner">
        <div className="flash-title">
          <Zap size={18} color="#FFE600" />
          <strong>MIDNIGHT FLASH SALE — UP TO 70% OFF</strong>
        </div>

        <div className="timer-box">
          <span>ENDS IN:</span>
          <div className="timer-unit">{format2(timeLeft.hours)}h</div> :
          <div className="timer-unit">{format2(timeLeft.minutes)}m</div> :
          <div className="timer-unit">{format2(timeLeft.seconds)}s</div>
        </div>

        <div className="flash-code-chip">
          Use Code: <strong>AAAN50</strong>
        </div>
      </div>
    </div>
  );
}

export function PromotionalExitPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 8 seconds if not dismissed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('aaan_popup_dismissed');
      if (!dismissed) setShowPopup(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPopup(false);
    localStorage.setItem('aaan_popup_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    toastSuccess('Code Copied!', 'Use WELCOME10 at checkout for 10% OFF.');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showPopup) return null;

  return (
    <div className="promo-popup-backdrop" onClick={handleDismiss}>
      <div className="promo-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={handleDismiss}>✕</button>

        <div className="popup-badge">🎁 SPECIAL GIFT FOR YOU</div>
        <h2>Get Extra 10% OFF Your Order!</h2>
        <p>Subscribe or copy your exclusive welcome code below for instant savings at checkout.</p>

        <div className="popup-code-box">
          <code>WELCOME10</code>
          <button onClick={handleCopyCode} className="btn-copy-popup">
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        <button onClick={handleDismiss} className="btn-shop-popup">
          Shop Catalog Deals Now <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function ReferralModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const refLink = 'https://aaanenterprises.com/ref/USER102';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toastSuccess('Referral Link Copied!', 'Share with friends to get ₹250 wallet credit.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="promo-popup-backdrop" onClick={onClose}>
      <div className="promo-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>✕</button>

        <div className="popup-badge" style={{ background: '#EEF2FF', color: '#4F46E5' }}>👥 REFERRAL &amp; REWARDS</div>
        <h2>Invite Friends &amp; Earn ₹250</h2>
        <p>Give your friends 10% OFF on their first purchase, and you earn ₹250 wallet credit when they order!</p>

        <div className="popup-code-box">
          <input type="text" readOnly value={refLink} style={{ background: 'none', border: 'none', fontSize: '0.85rem', width: '100%' }} />
          <button onClick={handleCopy} className="btn-copy-popup">
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '14px 0 0', textAlign: 'center' }}>
          ✨ Wallet credits applied automatically on your next checkout.
        </div>
      </div>
    </div>
  );
}
