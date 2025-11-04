import { Router } from "express";
import { authenticateMiddleware } from "../middleware/auth.middleware";
import { deleteBlogs, generateBlog, getBlogs, updateBlogs } from "../controllers/blog.controller";

const router = Router();

router.post(
  "/generate",
  authenticateMiddleware,
  generateBlog
);

router.get('/' , authenticateMiddleware , getBlogs)

router.delete('/:id' , authenticateMiddleware , deleteBlogs)

router.put('/:id' , authenticateMiddleware , updateBlogs)

export default router;
