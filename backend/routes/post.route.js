import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	createPost,
	getFeedPosts,
	deletePost,
	getPostById,
	createComment,
	likePost,
	userPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("get/:id", protectRoute, getPostById);
router.post("post/:id/comment", protectRoute, createComment);
router.post("post/:id/like", protectRoute, likePost);
router.get("/user-posts", protectRoute, userPosts);

export default router;
