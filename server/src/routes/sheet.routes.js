import express from 'express';
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import { createSheet, getSheet, updateSheet, deleteSheet, getUserSheets, getPublicSheets, cloneSheet, pinSheet, unpinSheet, getFeaturedSheets, getSheetProblems } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

// Specific routes
sheetRoutes.get('/public',isAuthenticated , getPublicSheets); 
sheetRoutes.get('/featured', isAuthenticated, getFeaturedSheets);
sheetRoutes.get('/user', isAuthenticated, getUserSheets);
sheetRoutes.post('/create', isAuthenticated, createSheet);
sheetRoutes.post('/sheet/:id/clone', isAuthenticated, cloneSheet);
sheetRoutes.post('/sheet/:id/pin', isAuthenticated, pinSheet);
sheetRoutes.delete('/sheet/:id/unpin', isAuthenticated, unpinSheet);

// Dynamic routes
sheetRoutes.get('/:id', isAuthenticated, getSheet);
sheetRoutes.get('/:id/problems', isAuthenticated, getSheetProblems);
sheetRoutes.put('/:id/update', isAuthenticated, updateSheet);
sheetRoutes.delete('/:id/delete', isAuthenticated, deleteSheet);

export default sheetRoutes;