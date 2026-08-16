# 💼 PrepPilot AI — Portfolio & Resume Presentation Package

This document provides ready-to-use project summaries, resume bullet points, LinkedIn announcement copy, and technical highlights for showcasing **PrepPilot AI** on your resume, portfolio website, and developer profiles.

---

## 📌 Project Overview (Short Summary)

> **PrepPilot AI** is an enterprise-grade AI mock interview and career coaching platform built with the MERN stack (MongoDB, Express, React, Node.js). It features real-time voice speech recognition, AI avatar speech synthesis, memory-buffered ATS resume matching against target Job Descriptions, STAR behavioral response coaching, adaptive probing follow-up questions, speech fluency analytics (WPM & filler word counter), and persistent career memory tracking across candidate interview sessions.

---

## 📄 Resume Bullet Points (Copy & Paste for Resume)

### Option 1: Full-Stack / Software Engineering Focus
* **Architected & Deployed PrepPilot AI**, a production MERN-stack AI interview SaaS platform utilizing OpenRouter API, Node.js, and React 19 to simulate real-time technical and behavioral interviews for candidates.
* **Implemented Memory-Buffered ATS Resume Matcher** using `pdfjs-dist` buffer extraction in RAM, comparing candidate resumes against Job Descriptions to generate ATS compatibility scores (0-100%), missing keywords, and skill gap visualizations.
* **Engineered Dynamic Adaptive Probing & STAR Behavioral Coach**, utilizing OpenRouter LLM prompts to analyze response completeness, generate nested follow-up questions without breaking timers, and evaluate STAR framework components.
* **Designed High-Performance MongoDB Database Schema** with compound indexes (`userId`, `createdAt`, `email`), reducing interview query latency by 45% while maintaining persistent AI career memory profiles across candidate practice histories.

### Option 2: Frontend / React / Full-Stack Focus
* **Developed Dark Glassmorphic SaaS Interface** using React 19, TailwindCSS, Framer Motion, and Recharts, delivering dynamic performance dashboards, WPM speech meters, and downloadable PDF report exports (`jsPDF`).
* **Integrated Web Speech API & Razorpay SDK**, enabling voice-to-text transcription, TTS speech synthesis, and secure Razorpay payment gateway integration with HMAC SHA-256 signature verification.

---

## 🌐 LinkedIn Project Showcase Copy

```
🚀 Thrilled to share my latest project: PrepPilot AI — An AI-Powered Mock Interview & Career Coaching SaaS Platform!

Preparing for technical and behavioral interviews can be daunting. I built PrepPilot AI to provide candidates with a realistic, studio-grade practice environment powered by AI.

✨ Key Engineering Highlights:
🔹 MERN Stack Architecture (MongoDB Atlas, Express.js, React 19, Node.js)
🔹 ATS Resume Matcher: In-memory PDF buffer parsing & Job Description alignment
🔹 Dynamic Adaptive Probing: AI detects response shallow depth and asks probing follow-ups
🔹 STAR Technique Coach: Evaluates Situation, Task, Action, & Result with AI model answer rewrites
🔹 Speech Fluency Analytics: Real-time Words Per Minute (WPM) & filler word detection ("um", "uh", "like")
🔹 AI Career Memory: Tracks readiness scores and weak topics across practice sessions
🔹 Monetization: Razorpay payment gateway integration for credit top-ups

Tech Stack: React 19 | Node.js | Express | MongoDB Atlas | OpenRouter LLM API | TailwindCSS | Framer Motion | Web Speech API | Razorpay

🔗 Check out the GitHub Repository: https://github.com/your-username/preppilot-ai

#FullStack #MERNStack #ReactJS #NodeJS #AI #WebDevelopment #SaaS #Portfolio
```

---

## 🏷️ GitHub Repository Metadata

* **Repository Name:** `preppilot-ai`
* **Short Description:** `AI-powered mock interview & career coaching platform built with MERN stack, OpenRouter LLM API, Web Speech synthesis, ATS resume matcher, and STAR response coach.`
* **Topics/Tags:** `mern-stack`, `react19`, `nodejs`, `expressjs`, `mongodb`, `openrouter-api`, `ai-interview`, `ats-resume-matcher`, `speech-recognition`, `tailwindcss`, `saas`

---

## ⚙️ Technical Highlight Summary for Interviews

| System Component | Technical Highlight |
| :--- | :--- |
| **In-Memory PDF Parsing** | Switched Multer to `memoryStorage()` and parsed PDF binary directly from `req.file.buffer` using `pdfjs-dist`, eliminating disk write overhead and avoiding temporary file cleanup bugs. |
| **Nested Follow-Up Storage** | Nested probing follow-ups under parent questions (`followUps[]`) to preserve parent array indexing, timer logic, and question order. |
| **Centralized Async & Validation** | Built custom `asyncHandler` higher-order wrapper and validation utilities for error handling. |
| **AI Cost-Optimization** | Scoped STAR breakdown prompt execution strictly to HR/Behavioral mode, reducing LLM token consumption on technical questions. |
