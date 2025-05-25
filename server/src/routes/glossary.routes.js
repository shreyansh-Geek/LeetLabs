import express from "express";
import {
  getAllTerms,
  getTermById,
  createTerm, 
} from "../controllers/glossary.controller.js";
import { isAuthenticated, checkAdmin } from "../middlewares/auth.middleware.js";

const glossaryRoutes = express.Router();

glossaryRoutes.get("/", isAuthenticated, getAllTerms);
glossaryRoutes.get("/:id", isAuthenticated, getTermById);
glossaryRoutes.post("/", isAuthenticated, isAuthenticated, checkAdmin, createTerm);

export default glossaryRoutes;