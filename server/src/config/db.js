import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "gamingify-arena"
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.log("MongoDB connection failed!", error);
        process.exit(1);
    }
}

export default connectDB;