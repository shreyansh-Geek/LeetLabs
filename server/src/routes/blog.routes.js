import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
} from "../controllers/blog.controller.js";
import { isAuthenticated, checkAdmin } from "../middlewares/auth.middleware.js";

const blogRoutes = express.Router();

// Public routes
blogRoutes.get("/", getAllBlogs);
blogRoutes.get("/:id", getBlogById); 
blogRoutes.post("/", isAuthenticated, isAuthenticated, checkAdmin, createBlog); 

export default blogRoutes;