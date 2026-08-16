import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js"
import { aiLimiter, answerLimiter } from "../middlewares/rateLimiter.js"

const interviewRouter = express.Router()

interviewRouter.post("/resume", isAuth, aiLimiter, upload.single("resume"), analyzeResume)
interviewRouter.post("/generate-questions", isAuth, aiLimiter, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, answerLimiter, submitAnswer)
interviewRouter.post("/finish", isAuth, finishInterview)

interviewRouter.get("/get-interview", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)

export default interviewRouter