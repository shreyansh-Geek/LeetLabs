import express from "express";
import { saveNote, getNote } from "../controllers/note.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const noteRoutes = express.Router();
noteRoutes.post("/save/:problemId", isAuthenticated, saveNote);
noteRoutes.get("/:problemId", isAuthenticated, getNote);
export default noteRoutes;