import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"
import { paymentLimiter } from "../middlewares/rateLimiter.js"

const paymentRouter = express.Router()

paymentRouter.post("/order", isAuth, paymentLimiter, createOrder)
paymentRouter.post("/verify", isAuth, verifyPayment)

export default paymentRouter