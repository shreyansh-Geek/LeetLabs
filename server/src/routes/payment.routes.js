import express from 'express';
import { handlePayment, getPaymentHistory } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create or verify payment order
router.post('/order', isAuthenticated, handlePayment);

// Get payment history for a user
router.get('/user/:userId', isAuthenticated, getPaymentHistory);

export default router;