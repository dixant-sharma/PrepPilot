import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDb from "./config/connectDb.js";
import validateEnv from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "./utils/logger.js";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

dotenv.config();
validateEnv();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Lightweight Production Health Check Endpoint
app.get("/api/health", (req, res) => {
    return res.status(200).json({
        status: "healthy",
        service: "PrepPilot AI",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    logger.error("Unhandled Server Error", { error: err.stack || err.message || err });
    return res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    connectDb();
});

// Graceful Server Shutdown Handler (SIGTERM & SIGINT)
const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Initiating graceful server shutdown...`);

    server.close(async () => {
        logger.info("HTTP server closed.");
        try {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed cleanly.");
            process.exit(0);
        } catch (err) {
            logger.error("Error closing MongoDB connection", { error: err.message });
            process.exit(1);
        }
    });

    // Force close after 10 seconds if shutdown hangs
    setTimeout(() => {
        logger.error("Graceful shutdown timeout exceeded. Forcing process exit.");
        process.exit(1);
    }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
