import mongoose from "mongoose";
import User from "./user.model.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect( "mongodb+srv://saloni:1234@cluster0.lqmo8.mongodb.net/ConnectProdb?retryWrites=true&w=majority&appName=Cluster0" );
        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Using await with updateMany
        const result = await User.updateMany({}, { $set: { interest: [] } });
        console.log('Updated documents:', result);

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
