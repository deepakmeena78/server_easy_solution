import mongoose from "mongoose";

const connectDB = async () => {
    try {
         await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected....");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
        