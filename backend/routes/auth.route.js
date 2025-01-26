import express from "express";
import { login, logout, signup, getCurrentUser ,forgotPassword ,varifyOTP } from "../controllers/auth.controller.js";
import {updatePassword} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", varifyOTP , updatePassword);

router.get("/me", protectRoute, getCurrentUser);

export default router;
