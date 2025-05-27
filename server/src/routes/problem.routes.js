import {createProblem, getProblemById, updateProblemById, deleteProblemById, getAllProblems, getAllProblemsSolvedByUser, getUserSolvedProblemsCount, getDifficultyStats, getSkillsData} from '../controllers/problem.controller.js'
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import express from 'express';
const problemRoutes = express.Router();

problemRoutes.post('/createProblem', isAuthenticated, checkAdmin, createProblem);

problemRoutes.get('/getAllProblems', isAuthenticated, getAllProblems);

problemRoutes.get('/getProblem/:id', isAuthenticated, getProblemById);

problemRoutes.put('/updateProblem/:id', isAuthenticated, checkAdmin, updateProblemById);

problemRoutes.delete('/deleteProblem/:id', isAuthenticated, checkAdmin, deleteProblemById);

problemRoutes.get('/getAllProblemsSolvedByUser', isAuthenticated, getAllProblemsSolvedByUser);

problemRoutes.get('/get-user-solved-count', isAuthenticated, getUserSolvedProblemsCount);

problemRoutes.get('/get-difficulty-stats', isAuthenticated, getDifficultyStats);

problemRoutes.get('/get-skills-data', isAuthenticated, getSkillsData);

export default problemRoutes;