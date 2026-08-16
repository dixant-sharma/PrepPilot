import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

// Server-side plan definitions — single source of truth for pricing
const PLANS = {
  basic: { name: "Starter Pack", amount: 100, credits: 150 },
  pro:   { name: "Pro Pack",     amount: 500, credits: 650 },
};

export const createOrder = asyncHandler(async (req, res) => {
    const { planId } = req.body;

    console.log("=== [RAZORPAY DEBUG] CREATE ORDER INITIATED ===");
    console.log("process.env.RAZORPAY_KEY_ID exists?:", !!process.env.RAZORPAY_KEY_ID);
    console.log("process.env.RAZORPAY_KEY_ID value:", process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 10)}...` : "NOT_SET");
    console.log("process.env.RAZORPAY_KEY_SECRET exists?:", !!process.env.RAZORPAY_KEY_SECRET);
    console.log("Requested planId:", planId);

    const plan = PLANS[planId];
    if (!plan) {
      console.error("[RAZORPAY DEBUG] Invalid planId selected:", planId);
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const options = {
      amount: plan.amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("[RAZORPAY DEBUG] Creating order with options:", options);

    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log("[RAZORPAY DEBUG] Razorpay order creation response:", JSON.stringify(order, null, 2));
    } catch (razorpayErr) {
      console.error("[RAZORPAY DEBUG] Razorpay API error message:", razorpayErr?.error?.description || razorpayErr?.message || razorpayErr);
      console.error("[RAZORPAY DEBUG] Razorpay API full error:", JSON.stringify(razorpayErr, null, 2));
      return res.status(500).json({
        message: "Failed to create Razorpay order",
        error: razorpayErr?.error?.description || razorpayErr?.message || "Razorpay API error"
      });
    }

    await Payment.create({
      userId: req.userId,
      planId,
      amount: plan.amount,
      credits: plan.credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    console.log("[RAZORPAY DEBUG] Payment record created in MongoDB for order:", order.id);

    return res.json(order);
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("=== [RAZORPAY DEBUG] VERIFY PAYMENT INITIATED ===");
    console.log("Received razorpay_order_id:", razorpay_order_id);
    console.log("Received razorpay_payment_id:", razorpay_payment_id);
    console.log("Received razorpay_signature:", razorpay_signature);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Calculated expectedSignature:", expectedSignature);
    console.log("Signature match?:", expectedSignature === razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("[RAZORPAY DEBUG] Payment signature mismatch!");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      console.error("[RAZORPAY DEBUG] Payment record not found for order:", razorpay_order_id);
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      console.log("[RAZORPAY DEBUG] Payment already processed:", razorpay_order_id);
      return res.json({ message: "Already processed" });
    }

    // Update payment record
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // Add credits to user
    const updatedUser = await User.findByIdAndUpdate(payment.userId, {
      $inc: { credits: payment.credits }
    }, { new: true });

    console.log("[RAZORPAY DEBUG] Payment verified successfully. User credits updated to:", updatedUser?.credits);

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });
});