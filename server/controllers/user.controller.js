import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
});

export const getCareerInsights = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate({
    path: "careerHistory.interviewId",
    select: "role experience mode finalScore createdAt"
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const careerProfile = user.careerProfile || {
    targetRoles: [],
    skillStrengths: [],
    skillWeaknesses: [],
    improvementAreas: [],
    readinessScore: 0
  };

  const historyTimeline = (user.careerHistory || []).map((item) => ({
    interviewId: item.interviewId?._id || item.interviewId,
    role: item.interviewId?.role || "Mock Interview",
    readinessScore: item.readinessScore || 0,
    weakTopics: item.weakTopics || [],
    strongTopics: item.strongTopics || [],
    recommendedPracticeAreas: item.recommendedPracticeAreas || [],
    createdAt: item.createdAt
  }));

  // Personalized Coaching Advice Generator
  let coachingAdvice = "Complete your first AI mock interview to generate personalized career memory coaching insights.";
  if (historyTimeline.length > 0) {
    const latest = historyTimeline[historyTimeline.length - 1];
    const weakStr = latest.weakTopics.slice(0, 2).join(" & ");
    const recStr = latest.recommendedPracticeAreas[0] || "Focus on structured explanation clarity";
    coachingAdvice = `Your interview history shows great momentum! Practice focus: refine ${weakStr || "technical depth"}. Recommended next step: ${recStr}.`;
  }

  return res.status(200).json({
    readinessScore: careerProfile.readinessScore || 70,
    targetRoles: careerProfile.targetRoles || [],
    weakAreas: careerProfile.skillWeaknesses || [],
    strongAreas: careerProfile.skillStrengths || [],
    recommendedPractice: careerProfile.improvementAreas || [],
    coachingAdvice,
    careerHistory: historyTimeline
  });
});