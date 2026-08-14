import express from "express";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
} from "../controllers/postController.js";

import upload from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL POSTS
router.get("/", getPosts);

// GET MY POST
router.get("/my/posts", protect, getMyPosts);

// GET SINGLE POST
router.get("/:id", getPost);

// CREATE POST (with upload middleware for handling image uploads)
router.post("/", protect, upload.single("image"), createPost);

// UPDATE POST
router.put("/:id", protect, updatePost);

// DELETE POST
router.delete("/:id", protect, deletePost);

// duplicate route removed

export default router;