import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createSheet } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

sheetRoutes.post('/', isAuthenticated, createSheet);

export default sheetRoutes;