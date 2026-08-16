import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        logger.info("MongoDB database connected successfully");
    } catch (error) {
        logger.error(`MongoDB connection failure: ${error.message || error}`);
    }
};

export default connectDb;