/**
 * AAAN Enterprises — AI Email Campaign & Template Generator Engine
 * Templates: Welcome Email, Abandoned Cart, Order Confirmation, Delivery Updates, Promotional Campaigns, Festival Greetings
 */

export const EMAIL_TYPES = {
  WELCOME: 'welcome',
  ABANDONED_CART: 'abandoned_cart',
  ORDER_CONFIRMATION: 'order_confirmation',
  DELIVERY_UPDATE: 'delivery_update',
  PROMOTIONAL: 'promotional',
  FESTIVAL: 'festival'
};

export function generateEmailTemplate({
  type = EMAIL_TYPES.WELCOME,
  customerName = 'Valued Customer',
  productName = '',
  orderId = '',
  discountCode = '',
  festivalName = ''
}) {
  const name = customerName || 'Valued Customer';
  const brand = 'AAAN Enterprises';

  switch (type) {
    case EMAIL_TYPES.WELCOME:
      return {
        subject: `🎉 Welcome to AAAN Enterprises, ${name}! Enjoy 10% OFF your first order`,
        preheader: 'Discover luxury sarees, tech, home living & premium fashion with fast express delivery.',
        plainText: `Hi ${name},\n\nWelcome to AAAN Enterprises! We are thrilled to have you join our exclusive shopper community.\n\nUse promo code WELCOME10 at checkout to get 10% OFF your first catalog purchase.\n\nShop Now: https://aaanenterprises.com\n\nWarm regards,\nThe AAAN Team`,
        html: createHtmlWrapper({
          headerTitle: 'Welcome to AAAN Enterprises!',
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">We are thrilled to welcome you to <strong>AAAN Enterprises</strong> — your premier destination for luxury fashion, home living, tech gadgets & wellness catalog products.</p>
            
            <div style="background: #EEF2FF; border: 2px dashed #6366F1; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 14px; color: #4F46E5; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your Exclusive Welcome Gift</span>
              <h2 style="font-size: 28px; color: #0F172A; margin: 8px 0; font-family: monospace;">WELCOME10</h2>
              <p style="font-size: 14px; color: #64748B; margin: 0;">Use this code at checkout for <strong>10% Extra Discount</strong> on your first order!</p>
            </div>
            
            <p style="font-size: 15px; color: #475569;">Enjoy free express delivery, 30-day easy returns, and 100% genuine guaranteed products.</p>
          `,
          ctaText: '✨ Explore AAAN Catalog & Shop Now',
          ctaUrl: 'https://aaanenterprises.com/shop'
        })
      };

    case EMAIL_TYPES.ABANDONED_CART:
      return {
        subject: `🛒 ${name}, your cart is waiting! Complete your purchase before stock runs out`,
        preheader: `Items in your cart including ${productName || 'selected items'} are reserved for a limited time.`,
        plainText: `Hi ${name},\n\nYou left something special behind in your cart! ${productName ? `Item: ${productName}` : ''}\n\nComplete your checkout today and enjoy fast express shipping:\nhttps://aaanenterprises.com/cart`,
        html: createHtmlWrapper({
          headerTitle: 'You Left Something Special Behind!',
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">We noticed you left great catalog items in your shopping cart. High-demand items sell out fast, but we've reserved them for you for the next 24 hours!</p>
            
            ${productName ? `
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; margin: 20px 0; display: flex; align-items: center; gap: 16px;">
              <div style="font-weight: bold; font-size: 16px; color: #0F172A;">📦 Saved Item: ${productName}</div>
            </div>` : ''}

            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 14px; border-radius: 12px; margin: 20px 0; text-align: center; color: #065F46; font-weight: bold;">
              ⚡ Free Express Dispatch Available for Your Order
            </div>
          `,
          ctaText: '🛒 Complete My Checkout Now',
          ctaUrl: 'https://aaanenterprises.com/checkout'
        })
      };

    case EMAIL_TYPES.ORDER_CONFIRMATION:
      return {
        subject: `📦 Order Confirmed: #${orderId || 'ORD-AAAN-98421'} — Thank you for your purchase!`,
        preheader: `We've received your order #${orderId || 'ORD-AAAN-98421'}. Your tax invoice & receipt is ready.`,
        plainText: `Hi ${name},\n\nThank you for your order! Your order #${orderId || 'ORD-AAAN-98421'} has been confirmed and is being packed for express shipping.\n\nView Tax Invoice: https://aaanenterprises.com/account/orders`,
        html: createHtmlWrapper({
          headerTitle: 'Order Confirmation & Receipt',
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for shopping with <strong>AAAN Enterprises</strong>! Your order <strong>#${orderId || 'ORD-AAAN-98421'}</strong> has been received and confirmed.</p>
            
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px; font-size: 16px; color: #0F172A;">Order Summary</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Order ID:</strong> #${orderId || 'ORD-AAAN-98421'}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Status:</strong> Confirmed &amp; Preparing for Packing</p>
              <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Estimated Delivery:</strong> 2 - 3 Business Days</p>
            </div>
          `,
          ctaText: '📄 Download Tax Invoice & Track Order',
          ctaUrl: 'https://aaanenterprises.com/account/orders'
        })
      };

    case EMAIL_TYPES.DELIVERY_UPDATE:
      return {
        subject: `🚚 Shipping Update: Order #${orderId || 'ORD-AAAN-98421'} has been Dispatched!`,
        preheader: `Your package is on its way via Express Air Courier. Track live location inside.`,
        plainText: `Hi ${name},\n\nGreat news! Order #${orderId || 'ORD-AAAN-98421'} has been dispatched via BlueDart Express Air Courier.\n\nTrack Package: https://aaanenterprises.com/account/orders`,
        html: createHtmlWrapper({
          headerTitle: 'Your Package is On Its Way!',
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Great news! Your order <strong>#${orderId || 'ORD-AAAN-98421'}</strong> has been packed and handed over to our express courier partner.</p>
            
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 16px; padding: 20px; margin: 20px 0; text-align: center;">
              <span style="font-size: 13px; color: #1D4ED8; font-weight: bold; text-transform: uppercase;">Express Air Dispatch</span>
              <h3 style="font-size: 20px; color: #1E40AF; margin: 6px 0;">Dispatched via BlueDart Express</h3>
              <p style="font-size: 14px; color: #3B82F6; margin: 0;">Expected Delivery: Tomorrow by 6:00 PM IST</p>
            </div>
          `,
          ctaText: '📍 Track Live Delivery Status',
          ctaUrl: 'https://aaanenterprises.com/account/orders'
        })
      };

    case EMAIL_TYPES.PROMOTIONAL:
      return {
        subject: `⚡ Mega Flash Sale: Up to 50% OFF on Luxury Catalogs at AAAN!`,
        preheader: `Use code ${discountCode || 'AAAN50'} for huge savings on fashion, home living & gadgets.`,
        plainText: `Hi ${name},\n\nOur biggest sale of the season is live! Enjoy up to 50% OFF across top categories.\n\nUse Code: ${discountCode || 'AAAN50'}\n\nShop Sale: https://aaanenterprises.com`,
        html: createHtmlWrapper({
          headerTitle: '🔥 Mega Flash Sale is LIVE!',
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Get ready to upgrade your lifestyle! For a limited time, <strong>AAAN Enterprises</strong> is offering up to <strong>50% OFF</strong> across our premium apparel, tech &amp; home collections.</p>
            
            <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); border-radius: 20px; padding: 24px; text-align: center; color: white; margin: 24px 0;">
              <span style="font-size: 13px; letter-spacing: 1px; font-weight: bold; opacity: 0.9;">PROMO CODE</span>
              <h1 style="font-size: 36px; margin: 8px 0; font-family: monospace; color: #FFE600;">${discountCode || 'AAAN50'}</h1>
              <p style="margin: 0; font-size: 15px; opacity: 0.9;">Flat 50% OFF on orders above ₹499</p>
            </div>
          `,
          ctaText: '🛍️ Shop Flash Sale Deals Now',
          ctaUrl: 'https://aaanenterprises.com/shop'
        })
      };

    case EMAIL_TYPES.FESTIVAL:
    default:
      return {
        subject: `✨ Happy ${festivalName || 'Diwali'} from AAAN Enterprises! Special Festive Coupon Inside 🎁`,
        preheader: `Wishing you & your family prosperity and joy! Enjoy special festive savings today.`,
        plainText: `Hi ${name},\n\nWishing you a joyful ${festivalName || 'Festive Season'}! Celebrate with AAAN Enterprises and claim your special festive gift code FESTIVE20 for 20% OFF.\n\nShop Festive Collection: https://aaanenterprises.com`,
        html: createHtmlWrapper({
          headerTitle: `🎉 Happy ${festivalName || 'Diwali & Festive Season'}!`,
          bodyContent: `
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Warm greetings <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">On behalf of the entire team at <strong>AAAN Enterprises</strong>, we wish you and your family a joyful, healthy, and prosperous <strong>${festivalName || 'Festive Season'}</strong>!</p>
            
            <div style="background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 20px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 13px; color: #D97706; font-weight: bold; text-transform: uppercase;">Festive Gift Voucher</span>
              <h2 style="font-size: 32px; color: #B45309; margin: 8px 0; font-family: monospace;">FESTIVE20</h2>
              <p style="font-size: 14px; color: #92400E; margin: 0;">Enjoy <strong>20% Extra Discount</strong> on festive outfits, home decor &amp; gifts!</p>
            </div>
          `,
          ctaText: '🎁 Shop Festive Special Collection',
          ctaUrl: 'https://aaanenterprises.com/shop'
        })
      };
  }
}

function createHtmlWrapper({ headerTitle, bodyContent, ctaText, ctaUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${headerTitle}</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F6F9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F4F6F9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4F46E5 100%); padding: 32px; text-align: center; color: #FFFFFF;">
              <div style="font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">AAAN ENTERPRISES</div>
              <div style="font-size: 12px; letter-spacing: 3px; opacity: 0.8; margin-top: 4px; text-transform: uppercase;">Supplier Portal &amp; E-Commerce Store</div>
              <h1 style="font-size: 24px; margin: 18px 0 0; font-weight: 800; color: #FFFFFF;">${headerTitle}</h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              ${bodyContent}

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: #FFFFFF; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 6px 20px rgba(79,70,229,0.35);">
                  ${ctaText}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #F1F5F9; text-align: center; color: #94A3B8; font-size: 12px;">
              <p style="margin: 0 0 8px;"><strong>AAAN Enterprises</strong> · Registered Tax GSTIN: 27AAACA9841A1Z5</p>
              <p style="margin: 0;">Need support? Email <a href="mailto:contact@aaanenterprises.com" style="color: #6366F1; text-decoration: none;">contact@aaanenterprises.com</a> or call +91 80 7378 6650</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
