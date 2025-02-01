import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

// export const getSuggestedConnections (older) = async (req, res) => {
// 	try {
// 		const currentUser = await User.findById(req.user._id).select("connections");

// 		// find users who are not already connected, and also do not recommend our own profile!! right?
// 		const suggestedUser = await User.find({
// 			_id: {
// 				$ne: req.user._id,
// 				$nin: currentUser.connections,
// 			},
// 		})
// 			.select("name username profilePicture headline")
// 			.limit(3);

// 		res.json(suggestedUser);
// 	} catch (error) {
// 		console.error("Error in getSuggestedConnections controller:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };


export const getSuggestedConnections = async (req, res) => {
	try {
	  const currentUser = await User.findById(req.user._id).select("connections interest");
  
	  // Check if the user has interests
	  const userInterests = currentUser.interest;
  
	  // If the user has interests, suggest people with similar interests
	  let suggestedUsers;
  
	  if (userInterests.length > 0) {
		// Find users who share any of the user's interests and are not already connected
		suggestedUsers = await User.find({
		  _id: { $ne: req.user._id, $nin: currentUser.connections },
		  interest: { $in: userInterests }, // Matching users with at least one common interest
		})
		  .select("name username profilePicture headline")
		  .limit(3);
	  }
  
	  // If no users with similar interests, or not enough users, fall back to random suggestions
	  if (!suggestedUsers || suggestedUsers.length < 3) {
		// Find random users who are not already connected and exclude the current user
		const randomSuggestions = await User.aggregate([
		  {
			$match: {
			  _id: { $ne: req.user._id, $nin: currentUser.connections },
			},
		  },
		  {
			$sample: { size: 3 }, // Get random 3 users
		  },
		  {
			$project: {
			  name: 1,
			  username: 1,
			  profilePicture: 1,
			  headline: 1,
			},
		  },
		]);
  
		// If no users with interests are found, return random suggestions
		suggestedUsers = randomSuggestions;
	  }
  
	  res.json(suggestedUsers);
	} catch (error) {
	  console.error("Error in getSuggestedConnections controller:", error);
	  res.status(500).json({ message: "Server error" });
	}
};
  

export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"interest",
			"experience",
			"education",
		];
		// console.log(req.body);
		const updatedData = {};
		// console.log(req.body);
		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updatePassword = async (req, res) => {
	const { email , password } = req.body;
	console.log(email , password);
	try{
	if (password.length < 6) {
		return res.status(400).json({ message: "Password must be at least 6 characters" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = await User.findOne({email});
	// console.log(user);
	const userId = user._id;
	// console.log(userId);

	const updatedUser = await User.findByIdAndUpdate(
		userId, 
		{ password: hashedPassword }, // Set the new password
		{ new: true } // To return the updated user document
	  );
  
	if (!updatedUser) {
		return res.status(400).json({ message: "couldnt update password." });
	}
	
	console.log("password updated");

	return res.status(200).json({ message: "Password updated." });

	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserByName = async (req, res) => {
  const { name } = req.body; 
  try {
    const user = await User.findOne({ name });
	if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
	return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};
