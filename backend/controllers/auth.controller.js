import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail , sendOTPEmail } from "../emails/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();
let updatePasswordOTP =0;

export const signup = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		// const existingUsername = await User.findOne({ username });
		// if (existingUsername) {
		// 	return res.status(400).json({ message: "Username already exists" });
		// }

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			email,
			password: hashedPassword,
		});

		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "simple_secret_token" , { expiresIn: "7d" });

		res.cookie("jwt-connectpro", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

		res.status(201).json({ message: "User registered successfully" });

		const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}
	} catch (error) {
		console.log("Error in signup: ", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// console.log("jwt is ", process.env.JWT_SECRET);
		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "simple_secret_token" , { expiresIn: "7d" });
		await res.cookie("jwt-connectpro", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",	
		});
		// console.log("token sent",token);
		res.json({ message: "Logged in successfully" , user , token});
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	res.clearCookie("jwt-connectpro");
	res.json({ message: "Logged out successfully" });
};

export const forgotPassword = async(req, res)=>{
	const { userEmail } = req.body;
	const otp = Math.floor(1000 + Math.random() * 9000);
	// console.log(otp);
	updatePasswordOTP = otp;
	await sendOTPEmail(userEmail , otp);
	// console.log("otp sent");
}

export const varifyOTP = (req, res ,next)=>{
	const { otp } = req.body;
	if(!otp == updatePasswordOTP){
		return res.status(500).json({message : "otp mismatch"});
	}
	next();
}

export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};





