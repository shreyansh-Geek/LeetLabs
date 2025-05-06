import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createSheet, getSheet, updateSheet } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

sheetRoutes.post('/', isAuthenticated, createSheet);
sheetRoutes.get('/:id', isAuthenticated, getSheet);
sheetRoutes.put('/:id', isAuthenticated, updateSheet);

export default sheetRoutes;