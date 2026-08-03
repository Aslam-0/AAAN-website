import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, CheckCircle, Lock, Gift, Copy, Check, Sparkles, X, ArrowRight, Coins } from 'lucide-react';
import { getUserChallengeProgress, SHOPPING_CHALLENGES } from '../../utils/shoppingChallenges';
import { toastSuccess } from '../../utils/toast.js';
import './ShoppingChallengesModal.css';

export function ShoppingChallengePill({ onClick }) {
  const progress = getUserChallengeProgress(3200);

  return (
    <button className="shopping-challenge-pill-trigger" onClick={onClick}>
      <div className="pill-icon-wrap">
        <Award size={16} color="#FFE600" />
      </div>
      <div className="pill-text-wrap">
        <strong>Spend ₹5,000 → Unlock Free Gift</strong>
        <span>Progress: ₹{progress.totalSpend.toLocaleString()} ({progress.progressPct}%)</span>
      </div>
    </button>
  );
}

export function ShoppingChallengesModal({ isOpen, onClose }) {
  const [userSpend, setUserSpend] = useState(3200);
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const progress = getUserChallengeProgress(userSpend);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toastSuccess('Reward Claimed! 🎁', `Coupon ${code} copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const modalContent = (
    <div className="challenge-modal-backdrop" onClick={onClose}>
      <div className="challenge-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="challenge-close-btn" onClick={onClose}>✕</button>

        <div className="challenge-hero-head">
          <div className="c-badge">🏆 AAAN SHOPPING CHALLENGES</div>
          <h2>Spend ₹5,000 &amp; Unlock Rewards!</h2>
          <p>Complete shopping spend milestones to unlock discount coupons, reward coins, VIP badges &amp; a free mystery gift box!</p>

          {/* Progress Bar Meter */}
          <div className="meter-card">
            <div className="meter-info">
              <span>Your Total Shopping Spend: <strong>₹{userSpend.toLocaleString()}</strong></span>
              <span>Target: <strong>₹5,000</strong></span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${progress.progressPct}%` }} />
            </div>
            <div className="meter-pct">{progress.progressPct}% Completed to Ultimate VIP Gift</div>
          </div>
        </div>

        {/* Challenge Tiers Cards */}
        <div className="challenge-tiers-list">
          {progress.challenges.map((ch) => (
            <div key={ch.id} className={`tier-card-item ${ch.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="tier-head">
                <span className="tier-badge-icon">{ch.badgeIcon}</span>
                <div>
                  <strong>{ch.title}</strong>
                  <span>Target Spend: ₹{ch.targetSpend.toLocaleString()}</span>
                </div>

                <div className="tier-status">
                  {ch.unlocked ? (
                    <span className="status-unlocked"><CheckCircle size={14} /> UNLOCKED</span>
                  ) : (
                    <span className="status-locked"><Lock size={14} /> Spend ₹{ch.remainingSpend} More</span>
                  )}
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="tier-rewards-flex">
                <div className="reward-pill">
                  <Coins size={14} color="#F59E0B" />
                  <span>+{ch.rewards.coins} AAAN Coins</span>
                </div>

                <div className="reward-pill">
                  <Award size={14} color="#6366F1" />
                  <span>{ch.badge}</span>
                </div>

                <div className="reward-pill">
                  <Gift size={14} color="#EC4899" />
                  <span>{ch.rewards.gift}</span>
                </div>
              </div>

              {ch.unlocked && (
                <div className="claim-action-row">
                  <span className="claim-desc">Coupon: <strong>{ch.rewards.couponCode}</strong> ({ch.rewards.couponDesc})</span>
                  <button onClick={() => handleCopy(ch.rewards.couponCode)} className="btn-claim-coupon">
                    {copiedCode === ch.rewards.couponCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode === ch.rewards.couponCode ? 'Claimed' : 'Claim Reward'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
