import { Router } from "express";
import { getUser, updateMe } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.put("/me", protect, updateMe);
router.get("/:id", getUser);

export default router;
