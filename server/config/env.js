import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

const validateEnv = () => {
    const requiredVars = [
        { name: "MONGODB_URL", placeholder: "add your mongodb url" },
        { name: "JWT_SECRET", placeholder: "" },
        { name: "OPENROUTER_API_KEY", placeholder: "add your openrouter key" },
        { name: "RAZORPAY_KEY_ID", placeholder: "add your razorpay key id" },
        { name: "RAZORPAY_KEY_SECRET", placeholder: "add your razorpay key secret" },
    ];

    const missing = [];
    const placeholders = [];

    for (const v of requiredVars) {
        const val = process.env[v.name];
        if (!val || val.trim() === "") {
            missing.push(v.name);
        } else if (v.placeholder && val.trim().toLowerCase().includes(v.placeholder.toLowerCase())) {
            placeholders.push(v.name);
        }
    }

    if (missing.length > 0) {
        logger.warn(`Missing environment variables: ${missing.join(", ")}`);
    }

    if (placeholders.length > 0) {
        logger.warn(`Environment variables with dummy placeholder text detected: ${placeholders.join(", ")}.`);
    }

    if (missing.length === 0 && placeholders.length === 0) {
        logger.info("All required environment variables validated successfully.");
    }
};

export default validateEnv;
