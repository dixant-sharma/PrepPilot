import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema({
  question: String,
  answer: String,
  feedback: String,
  score: { type: Number, default: 0 },
});

const questionsSchema = new mongoose.Schema({
  question: String,
  difficulty: String,
  timeLimit: Number,
  answer: String,
  feedback: String,
  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },

  // Nested follow-ups to preserve parent question indexing
  followUps: [followUpSchema],

  // STAR Technique Analysis (Scoped for HR/Behavioral mode)
  starAnalysis: {
    situationScore: { type: Number, default: 0 },
    taskScore: { type: Number, default: 0 },
    actionScore: { type: Number, default: 0 },
    resultScore: { type: Number, default: 0 },
    starScore: { type: Number, default: 0 },
    aiRewrittenAnswer: { type: String, default: "" },
  },

  // Speech Fluency Analytics
  fluencyMetrics: {
    wpm: { type: Number, default: 0 },
    fillerWordCount: { type: Number, default: 0 },
    fillerWordsFound: [{ type: String }],
    fluencyScore: { type: Number, default: 0 },
  },
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ["HR", "Technical"],
    required: true,
  },
  resumeText: {
    type: String,
  },

  // ATS Analysis Persistence
  jobDescription: {
    type: String,
    default: "",
  },
  atsAnalysis: {
    atsScore: { type: Number, default: 0 },
    missingKeywords: [{ type: String }],
    matchedSkills: [{ type: String }],
    improvementSuggestions: [{ type: String }],
  },

  // AI Interview Memory Insights
  aiInsights: {
    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],
    recommendedPracticeAreas: [{ type: String }],
    generatedAt: { type: Date }
  },

  questions: [questionsSchema],

  finalScore: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["Incompleted", "completed"],
    default: "Incompleted",
  },
}, { timestamps: true });

interviewSchema.index({ userId: 1, createdAt: -1 });

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;