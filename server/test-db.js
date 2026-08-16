import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("MONGODB_URL:", process.env.MONGODB_URL ? process.env.MONGODB_URL.substring(0, 30) + "..." : "UNDEFINED");

try {
  await mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  console.log("✅ MongoDB connected successfully!");
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error("❌ MongoDB connection FAILED:", err.message);
  process.exit(1);
}
