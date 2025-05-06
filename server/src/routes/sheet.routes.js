import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createSheet, getSheet } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

sheetRoutes.post('/', isAuthenticated, createSheet);
sheetRoutes.get('/:id', isAuthenticated, getSheet);

export default sheetRoutes;