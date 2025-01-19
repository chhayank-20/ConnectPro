import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://chhayankpatel209:root@cluster0.pwkxx.mongodb.net/linkedin-3?retryWrites=true&w=majority&appName=Cluster0");
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1);
	}
};
