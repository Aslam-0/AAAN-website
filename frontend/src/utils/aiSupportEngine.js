/**
 * AAAN Enterprises — 24/7 AI Customer Support Engine
 * Domain Intent Classifier: Orders, Shipping, Returns, Refunds, Warranty, Payments, Coupons, Product Questions
 * Confidence Scoring & Human Support Escalation
 */

export const SUPPORT_DOMAINS = {
  ORDERS: 'orders',
  SHIPPING: 'shipping',
  RETURNS: 'returns',
  REFUNDS: 'refunds',
  WARRANTY: 'warranty',
  PAYMENTS: 'payments',
  COUPONS: 'coupons',
  PRODUCT: 'product',
  HUMAN_ESCALATION: 'human_escalation'
};

const KNOWLEDGE_BASE = [
  {
    domain: SUPPORT_DOMAINS.ORDERS,
    keywords: ['order', 'track', 'status', 'where is my order', 'cancel', 'modify', 'order number', 'placed'],
    confidence: 0.95,
    response: `📦 **Order Status & Tracking**:
You can track your order status in real time under **My Account → Order History**. Every AAAN order is assigned a unique tracking number (e.g. \`ORD-AAAN-84920\`).

- **Processing**: Order confirmed and prepared for packing.
- **Shipped**: Dispatched via express courier.
- **Cancellations**: Orders can be cancelled within 2 hours of placement via Order History.`
  },
  {
    domain: SUPPORT_DOMAINS.SHIPPING,
    keywords: ['shipping', 'delivery', 'courier', 'dispatch', 'how long', 'charges', 'express', 'address'],
    confidence: 0.95,
    response: `🚚 **Shipping & Express Delivery Info**:
- **Free Express Shipping**: Available on all catalog orders above ₹499.
- **Dispatch Time**: Orders are packed and dispatched within **24 hours**.
- **Delivery Timeline**: Metros (2-3 business days), Other Cities (3-5 business days).
- **Couriers**: Dispatched via BlueDart, Delhivery & Express Air Courier.`
  },
  {
    domain: SUPPORT_DOMAINS.RETURNS,
    keywords: ['return', 'exchange', 'replace', 'broken', 'damaged', 'wrong size', 'return policy', 'pickup'],
    confidence: 0.92,
    response: `🔄 **30-Day Easy Returns & Exchange Policy**:
- **Hassle-Free Returns**: You have **30 days** from delivery to request a return or exchange.
- **Free Home Pick-Up**: Our doorstep courier will pick up the item free of charge.
- **Condition**: Items must be unused in original packaging with tags intact.`
  },
  {
    domain: SUPPORT_DOMAINS.REFUNDS,
    keywords: ['refund', 'money back', 'credited', 'bank', 'upi refund', 'card refund', 'payment back', 'when refund'],
    confidence: 0.94,
    response: `💸 **Refund Timelines & Process**:
- **UPI / Online Payments**: Refund credited within **24-48 hours** after return verification.
- **Credit / Debit Cards**: Refund processed within **3-5 bank working days**.
- **Cash on Delivery (COD)**: Refund credited to your verified bank account or UPI ID.`
  },
  {
    domain: SUPPORT_DOMAINS.WARRANTY,
    keywords: ['warranty', 'guarantee', 'repair', 'broken item', 'manufacturer warranty', 'claim warranty'],
    confidence: 0.95,
    response: `🛡️ **AAAN Official Warranty Coverage**:
- **Warranty Period**: All electronic items & appliances carry **1 Year AAAN Official Warranty**.
- **Coverage**: Covers manufacturing defects, motor/circuit repairs & component replacement.
- **How to Claim**: Submit a claim via My Account or email support with your Tax Invoice.`
  },
  {
    domain: SUPPORT_DOMAINS.PAYMENTS,
    keywords: ['payment', 'pay', 'upi', 'cod', 'cash on delivery', 'credit card', 'razorpay', 'netbanking'],
    confidence: 0.95,
    response: `💳 **Supported Payment Methods**:
We support 100% secure payment gateways:
- **UPI**: Google Pay, PhonePe, Paytm, BHIM.
- **Cards**: Visa, Mastercard, RuPay & American Express.
- **Cash on Delivery (COD)**: Available for orders up to ₹5,000 across India.
- **NetBanking**: All major Indian banks supported.`
  },
  {
    domain: SUPPORT_DOMAINS.COUPONS,
    keywords: ['coupon', 'code', 'discount', 'offer', 'promo', 'aaan50', 'welcome10', 'flat500', 'promo code'],
    confidence: 0.96,
    response: `🎟️ **Active Promo Codes & Savings**:
Apply these active codes at checkout:
- \`AAAN50\`: **50% OFF** on orders above ₹499.
- \`WELCOME10\`: **10% Extra OFF** for first-time shoppers.
- \`FLAT500\`: **Flat ₹500 OFF** on orders above ₹1,999.`
  },
  {
    domain: SUPPORT_DOMAINS.PRODUCT,
    keywords: ['size', 'dimension', 'clothes', 'xl', 'xxl', 'cm', 'furniture', 'specifications', 'material', 'quality'],
    confidence: 0.90,
    response: `🛍️ **Product Sizes & Specifications**:
- **Clothes & Fashion**: Available in **S, M, L, XL, XXL, XXXL**. Refer to the **Size Guide** link on any product page.
- **Furniture & Tech**: Sizes are listed in **centimeters (cm)** (e.g. 50 × 40 cm, 100 × 60 cm).
- **Authenticity**: 100% genuine products directly sourced from brand distributors.`
  }
];

export async function processAiSupportQuery(queryText, conversationHistory = []) {
  const q = queryText.toLowerCase().trim();

  // Check for explicit request to speak with a human agent
  if (
    q.includes('human') ||
    q.includes('agent') ||
    q.includes('talk to person') ||
    q.includes('customer care') ||
    q.includes('support team') ||
    q.includes('call me')
  ) {
    return {
      domain: SUPPORT_DOMAINS.HUMAN_ESCALATION,
      confidence: 1.0,
      escalate: true,
      response: `🙋 **Human Support Escalation Requested**:
I am connecting you to an AAAN Senior Support Executive.

📞 **Direct Helpline**: +91 80 7378 6650
✉️ **Email Support**: contact@aaanenterprises.com
🕒 **Human Agent Hours**: Mon - Sat (9:00 AM - 8:00 PM IST)

Would you like me to submit an urgent support ticket to our team for you?`
    };
  }

  // Score knowledge base entries based on keyword matches
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        score += kw.length > 4 ? 2 : 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  // Evaluate Confidence Score
  const calculatedConfidence = highestScore > 0 ? Math.min(0.98, 0.65 + highestScore * 0.1) : 0.40;

  if (bestMatch && calculatedConfidence >= 0.65) {
    return {
      domain: bestMatch.domain,
      confidence: calculatedConfidence,
      escalate: false,
      response: bestMatch.response
    };
  }

  // Low Confidence (< 65%) -> Automatic Human Support Escalation
  return {
    domain: SUPPORT_DOMAINS.HUMAN_ESCALATION,
    confidence: calculatedConfidence,
    escalate: true,
    response: `🤔 I want to ensure you get the exact answer you need. Since your query is specific, I am escalating this to an **AAAN Human Support Representative**.

📞 **Phone Support**: +91 80 7378 6650
✉️ **Email**: contact@aaanenterprises.com

Our support team handles inquiries within **15 minutes**. You can also reply below to leave a message for our agent!`
  };
}
