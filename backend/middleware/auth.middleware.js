import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";	
dotenv.config();

export const protectRoute = async (req, res, next) => {
	try {
		// console.log("auth middleware is called");
		
		const token = req.cookies["jwt-connectpro"];

		if (!token) {
			// console.log("no token");
			// console.log("No token provided1");
			return res.status(401).json({ message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			// console.log("no decoded");
			// console.log("No token decoded");
			return res.status(401).json({ message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			// console.log("no user");
			// console.log("No user found");
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log('error: ', error);
		console.log("Error in protectRoute middleware:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};


// export const protectRoute = (req,res,next)=>{
// 	next();
// }

