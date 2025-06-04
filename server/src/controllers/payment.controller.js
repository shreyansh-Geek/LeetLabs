import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../utils/db.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const handlePayment = async (req, res) => {
  const { planName, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  const userId = req.user.id;

  try {
    // Create Order
    if (!razorpayPaymentId) {
      if (!['Pro', 'Premium'].includes(planName) || !amount) {
        return res.status(400).json({ message: 'Invalid plan or amount' });
      }

      const validAmounts = { Pro: 199900, Premium: 499900 }; // In paise
      if (validAmounts[planName] !== amount) {
        return res.status(400).json({ message: 'Invalid amount for plan' });
      }

      // Generate a short receipt (max 40 chars)
      const shortUserId = userId.slice(0, 8); // First 8 chars of UUID
      const shortTimestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const receipt = `rcpt_${shortUserId}_${shortTimestamp}`; // e.g., rcpt_12345678_123456

      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt,
      });

      return res.json({
        orderId: order.id,
        amount,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Verify Payment
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    await razorpay.payments.capture(razorpayPaymentId, amount, 'INR');

    await db.user.update({
      where: { id: userId },
      data: { plan: planName },
    });

    return res.json({ message: 'Payment successful', plan: planName });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};