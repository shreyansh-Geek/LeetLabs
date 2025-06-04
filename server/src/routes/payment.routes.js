import express from 'express';
import { handlePayment } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.post('/order', isAuthenticated, handlePayment);

export default router;