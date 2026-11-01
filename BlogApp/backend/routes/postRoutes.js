import { Router } from "express";
import {
  getPosts,
  getTags,
  getMyPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getPosts);
router.get("/tags", getTags);
router.get("/mine", protect, getMyPosts);
router.get("/:id", optionalAuth, getPost);

router.post("/", protect, upload.single("image"), createPost);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;
