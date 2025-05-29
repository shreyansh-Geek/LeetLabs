import express from 'express';
import { register, verifyUser, login, logout, check, forgotPassword, resetPassword, googleAuth, googleCallback, githubAuth, githubCallback } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import passport from 'passport';
const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.get('/verifyUser/:verificationToken', verifyUser);
authRoutes.post('/login', login);
authRoutes.post('/logout', isAuthenticated, logout);
authRoutes.get('/check',isAuthenticated, check);
authRoutes.post('/forgotPassword', forgotPassword);
authRoutes.post('/resetPassword/:resetPasswordToken', resetPassword);
authRoutes.get("/google", googleAuth);
authRoutes.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }), googleCallback);
authRoutes.get("/github", githubAuth);
authRoutes.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

export default authRoutes;