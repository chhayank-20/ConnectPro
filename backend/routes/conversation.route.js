import express from "express";
import { getConversations } from "../controllers/conversation.controller.js";

const router = express.Router();

// Route to get all conversations of a user
router.get("/:userId", getConversations);

export default router;
