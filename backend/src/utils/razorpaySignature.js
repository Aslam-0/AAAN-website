import crypto from 'crypto';

/**
 * Verify the signature returned by Razorpay Checkout on the client.
 * Razorpay signs `razorpayOrderId|razorpayPaymentId` with the key secret.
 * Uses timingSafeEqual to avoid timing leaks.
 */
export function verifyOrderSignature({ razorpayOrderId, razorpayPaymentId, signature }, secret) {
  const cleanSecret = secret?.trim()?.replace(/^["']|["']$/g, '');
  if (!razorpayOrderId || !razorpayPaymentId || !signature || !cleanSecret) return false;
  const expected = crypto
    .createHmac('sha256', cleanSecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verify the signature on an incoming Razorpay webhook.
 * Razorpay signs the entire raw request body with the webhook secret.
 */
export function verifyWebhookSignature(rawBody, signature, secret) {
  const cleanSecret = secret?.trim()?.replace(/^["']|["']$/g, '');
  if (!rawBody || !signature || !cleanSecret) return false;
  const expected = crypto.createHmac('sha256', cleanSecret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
