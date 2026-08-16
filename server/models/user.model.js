import mongoose from "mongoose";

const careerHistorySchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview"
  },
  readinessScore: Number,
  weakTopics: [{ type: String }],
  strongTopics: [{ type: String }],
  recommendedPracticeAreas: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  credits: {
    type: Number,
    default: 100
  },
  careerProfile: {
    targetRoles: [{ type: String }],
    skillStrengths: [{ type: String }],
    skillWeaknesses: [{ type: String }],
    improvementAreas: [{ type: String }],
    readinessScore: { type: Number, default: 0 },
    lastAnalyzedAt: { type: Date }
  },
  careerHistory: [careerHistorySchema]
}, { timestamps: true });

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;