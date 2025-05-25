// server/src/routes/contribute.routes.js
import express from "express";
import { createContribution } from "../controllers/contribute.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const contributeRoutes = express.Router();

// Protected route: Only authenticated users can submit
contributeRoutes.post("/", isAuthenticated, createContribution);

export default contributeRoutes;