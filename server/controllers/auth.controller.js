import genToken from "../config/token.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const googleAuth = asyncHandler(async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || "PrepPilot User",
      email,
    });
  }

  console.log("User found/created:", user);

  const token = await genToken(user._id);

  if (!token) {
    throw new Error("Failed to generate authentication token.");
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(user);
});

export const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});