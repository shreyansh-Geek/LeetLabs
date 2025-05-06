import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createSheet, getSheet, updateSheet, deleteSheet, getUserSheets } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

sheetRoutes.post('/', isAuthenticated, createSheet);
sheetRoutes.get('/:id', isAuthenticated, getSheet);
sheetRoutes.put('/:id', isAuthenticated, updateSheet);
sheetRoutes.delete('/:id', isAuthenticated, deleteSheet);
sheetRoutes.get('/', isAuthenticated, getUserSheets);

export default sheetRoutes;