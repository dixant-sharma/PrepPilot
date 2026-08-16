import dotenv from "dotenv"
dotenv.config()
import Razorpay from "razorpay"

const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

console.log("[Razorpay Service] Initializing with:");
console.log("  key_id:", keyId);
console.log("  key_id length:", keyId.length);
console.log("  key_secret length:", keySecret.length);
console.log("  key_secret first 4 chars:", keySecret.substring(0, 4));

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export default razorpay