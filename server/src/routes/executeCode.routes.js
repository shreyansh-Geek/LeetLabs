import express from 'express';
import { runCode, submitCode } from '../controllers/executeCode.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const executeCodeRoutes = express.Router();

executeCodeRoutes.post('/run', isAuthenticated, runCode);
executeCodeRoutes.post('/submit', isAuthenticated, submitCode);

export default executeCodeRoutes;