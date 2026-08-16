import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const directUrl = "mongodb://sdakshu2727_db_user:e3W041UfrYBmgE4m@ac-is5wrj8-shard-00-00.dxjvfv6.mongodb.net:27017,ac-is5wrj8-shard-00-01.dxjvfv6.mongodb.net:27017,ac-is5wrj8-shard-00-02.dxjvfv6.mongodb.net:27017/?ssl=true&replicaSet=atlas-5rq3dr-shard-0&authSource=admin&retryWrites=true&w=majority&appName=PrepPilot";

console.log("Testing direct (non-SRV) connection with correct replica set...");

try {
  await mongoose.connect(directUrl, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  console.log("✅ MongoDB connected successfully!");
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error("❌ Connection FAILED:", err.message);
  process.exit(1);
}
