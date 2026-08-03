/**
 * AAAN Enterprises — Shopping Challenges & Gamification Engine
 * Spend Thresholds -> Unlock Coupons, AAAN Reward Coins, Badges & Free Gifts!
 */

export const SHOPPING_CHALLENGES = [
  {
    id: 'ch-1',
    targetSpend: 1500,
    title: 'Bronze Shopper Challenge',
    badge: '🥉 Bronze Shopper',
    badgeIcon: '🥉',
    rewards: {
      coins: 100,
      couponCode: 'BRONZE100',
      couponDesc: '₹100 OFF on next order',
      gift: 'AAAN Brand Keychain'
    }
  },
  {
    id: 'ch-2',
    targetSpend: 3000,
    title: 'Gold Explorer Challenge',
    badge: '🥇 Gold Shopper',
    badgeIcon: '🥇',
    rewards: {
      coins: 250,
      couponCode: 'GOLD15',
      couponDesc: '15% Extra OFF Coupon',
      gift: 'Luxury Travel Pouch'
    }
  },
  {
    id: 'ch-3',
    targetSpend: 5000,
    title: 'Diamond VIP Master Challenge',
    badge: '💎 Diamond VIP Master',
    badgeIcon: '💎',
    rewards: {
      coins: 500,
      couponCode: 'VIP500',
      couponDesc: 'Flat ₹500 Voucher',
      gift: 'Free Premium Mystery Gift Box 🎁'
    }
  }
];

export function getUserChallengeProgress(currentTotalSpend = 3200) {
  const spend = Math.max(0, currentTotalSpend);
  const nextTarget = SHOPPING_CHALLENGES.find(c => spend < c.targetSpend) || SHOPPING_CHALLENGES[SHOPPING_CHALLENGES.length - 1];

  const currentLevel = SHOPPING_CHALLENGES.filter(c => spend >= c.targetSpend).length;
  const progressPct = Math.min(100, Math.round((spend / 5000) * 100));

  const unlockedChallenges = SHOPPING_CHALLENGES.map(c => ({
    ...c,
    unlocked: spend >= c.targetSpend,
    remainingSpend: Math.max(0, c.targetSpend - spend)
  }));

  return {
    totalSpend: spend,
    level: currentLevel,
    progressPct,
    nextTarget,
    challenges: unlockedChallenges
  };
}
