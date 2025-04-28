import {createProblem, getProblemById, updateProblemById, deleteProblemById, getAllProblems, getAllProblemsSolvedByUser} from '../controllers/problem.controller.js'
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import express from 'express';
const problemRoutes = express.Router();

problemRoutes.post('/createProblem', isAuthenticated, checkAdmin, createProblem);

problemRoutes.get('/getAllProblems', isAuthenticated, getAllProblems);

problemRoutes.get('/getProblem/:id', isAuthenticated, getProblemById);

problemRoutes.put('/updateProblem/:id', isAuthenticated, checkAdmin, updateProblemById);

problemRoutes.delete('/deleteProblem/:id', isAuthenticated, checkAdmin, deleteProblemById);

problemRoutes.get('/getAllProblemsSolvedByUser', isAuthenticated, getAllProblemsSolvedByUser);

export default problemRoutes;