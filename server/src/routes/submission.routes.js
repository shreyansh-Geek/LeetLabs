import express from "express"
import {isAuthenticated} from "../middlewares/auth.middleware.js"
import { getUserSubmissionsForProblem, getTotalSubmissionsForProblem, getAllUserSubmissions, getStreakData, getPerformanceMetrics,} from "../controllers/submission.controller.js"

const submissionRoutes = express.Router();

submissionRoutes.get('/get-user-submissions-for-problem/:problemId', isAuthenticated, getUserSubmissionsForProblem);
submissionRoutes.get('/get-total-submissions-for-problem/:problemId', isAuthenticated, getTotalSubmissionsForProblem);
submissionRoutes.get('/get-all-user-submissions', isAuthenticated, getAllUserSubmissions);
submissionRoutes.get('/get-streak-data', isAuthenticated, getStreakData);
submissionRoutes.get('/get-performance-metrics', isAuthenticated, getPerformanceMetrics);

export default submissionRoutes