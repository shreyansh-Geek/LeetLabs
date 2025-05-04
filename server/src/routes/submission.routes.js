import express from "express"
import {isAuthenticated} from "../middlewares/auth.middleware.js"
import {getUserSubmissions, getUserSubmissionsForProblem, getTotalSubmissionsForProblem} from "../controllers/submission.controller.js"

const submissionRoutes = express.Router();

submissionRoutes.get('/get-user-submissions', isAuthenticated, getUserSubmissions);
submissionRoutes.get('/get-user-submissions-for-problem/:problemId', isAuthenticated, getUserSubmissionsForProblem);
submissionRoutes.get('/get-total-submissions-for-problem/:problemId', isAuthenticated, getTotalSubmissionsForProblem);

export default submissionRoutes