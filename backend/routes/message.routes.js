import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

// Route to send a message
router.post("/send", sendMessage);

// Route to get all messages of a conversation
router.post("/get-conversation-messages", getMessages);

export default router;

