import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser, getCareerInsights } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);
userRouter.get("/career-insights", isAuth, getCareerInsights);

export default userRouter;