import express from 'express';
import { register, verifyUser, login, logout, check } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.get('/verifyUser/:verificationToken', verifyUser);
authRoutes.post('/login', login);
authRoutes.post('/logout', isAuthenticated, logout);
authRoutes.get('/check',isAuthenticated, check);
export default authRoutes;