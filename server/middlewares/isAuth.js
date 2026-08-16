import jwt from "jsonwebtoken"


const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Authentication required: No token provided" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!verifyToken || !verifyToken.userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired, please log in again" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid authentication token" });
        }
        return res.status(500).json({ message: `Authentication error: ${error.message}` });
    }
}

export default isAuth