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

      const shortUserId = userId.slice(0, 8);
      const shortTimestamp = Date.now().toString().slice(-6);
      const receipt = `rcpt_${shortUserId}_${shortTimestamp}`;

      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt,
      });

      // Store order details in Payment model
      await db.payment.create({
        data: {
          userId,
          razorpayOrderId: order.id,
          planName,
          amount,
          status: 'created',
        },
      });

      return res.json({
        orderId: order.id,
        amount,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Verify Payment Signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await db.payment.update({
        where: { razorpayOrderId },
        data: { status: 'failed' },
      });
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Check if payment already exists
    const existingPayment = await db.payment.findUnique({
      where: { razorpayPaymentId },
    });

    if (existingPayment && existingPayment.status === 'captured') {
      // Payment already processed, ensure user plan is updated
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user.plan !== planName) {
        await db.user.update({
          where: { id: userId },
          data: {
            plan: planName,
            planActivatedAt: new Date(),
            planExpiresAt: null, // Lifetime access
          },
        });
      }
      return res.json({ message: 'Payment already processed', plan: planName });
    }

    // Fetch payment status from Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.status === 'captured') {
      // Payment already captured (e.g., via webhook)
      await db.payment.update({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          status: 'captured',
          capturedAt: new Date(),
          paymentMethod: payment.method || null, // Optional fields
          cardLast4: payment.card?.last4 || null,
          cardNetwork: payment.card?.network || null,
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          plan: planName,
          planActivatedAt: new Date(),
          planExpiresAt: null,
        },
      });

      return res.json({ message: 'Payment already processed', plan: planName });
    }

    // Capture Payment
    await razorpay.payments.capture(razorpayPaymentId, amount, 'INR');

    // Update Payment record
    await db.payment.update({
      where: { razorpayOrderId },
      data: {
        razorpayPaymentId,
        status: 'captured',
        capturedAt: new Date(),
        paymentMethod: payment.method || null, // Optional fields
        cardLast4: payment.card?.last4 || null,
        cardNetwork: payment.card?.network || null,
      },
    });

    // Update User Plan
    await db.user.update({
      where: { id: userId },
      data: {
        plan: planName,
        planActivatedAt: new Date(),
        planExpiresAt: null, // Lifetime access
      },
    });

    return res.json({ message: 'Payment successful', plan: planName });
  } catch (error) {
    console.error('Payment error:', {
      error: error.message,
      stack: error.stack,
      userId,
      razorpayOrderId,
      razorpayPaymentId,
    });
    const errorMessage = error.error?.description || error.message || 'Server error';
    if (razorpayOrderId) {
      await db.payment.updateMany({
        where: { razorpayOrderId, status: 'created' },
        data: { status: 'failed' },
      });
    }
    return res.status(error.statusCode || 500).json({ message: errorMessage });
  }
};

// New function for payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the user is authorized
    if (req.user.id !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Fetch payments
    const payments = await db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        planName: true,
        amount: true,
        status: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
        paymentMethod: true, // Optional, will be null if not in schema
        cardLast4: true,
        cardNetwork: true,
        createdAt: true,
        capturedAt: true,
      },
    });

    res.json({ data: payments });
  } catch (error) {
    console.error('Error fetching payment history:', {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });
    res.status(500).json({ message: 'Server error' });
  }
};