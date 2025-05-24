// server/src/routes/aiDiscussion.routes.js
import express from 'express';
import { getChatHistory, sendMessage, clearChat } from '../controllers/aiDiscussion.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const aiDiscussionRoutes = express.Router();

aiDiscussionRoutes.get('/problem/:problemId', isAuthenticated, getChatHistory);
aiDiscussionRoutes.post('/problem/:problemId', isAuthenticated, sendMessage);
aiDiscussionRoutes.delete('/problem/:problemId', isAuthenticated, clearChat);

export default aiDiscussionRoutes;