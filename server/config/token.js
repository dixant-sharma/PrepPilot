import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
};

export default genToken;