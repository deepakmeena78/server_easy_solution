import mongoose from "mongoose";

const connectDB = async () => {
    try {
         await mongoose.connect("mongodb://localhost:27017/Easy_Solution");
        console.log("Database connected....");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
        