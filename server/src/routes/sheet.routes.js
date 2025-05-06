import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createSheet, getSheet, updateSheet, deleteSheet, getUserSheets, getPublicSheets, cloneSheet } from '../controllers/sheet.controller.js';

const sheetRoutes = express.Router();

sheetRoutes.post('/create', isAuthenticated, createSheet);
sheetRoutes.get('/public', isAuthenticated, getPublicSheets); 
sheetRoutes.get('/user', isAuthenticated, getUserSheets);

sheetRoutes.get('/:id', isAuthenticated, getSheet);
sheetRoutes.put('/:id/update', isAuthenticated, updateSheet);
sheetRoutes.delete('/:id/delete', isAuthenticated, deleteSheet);
sheetRoutes.post('/:id/clone', isAuthenticated, cloneSheet);

export default sheetRoutes;