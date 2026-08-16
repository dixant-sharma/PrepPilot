import { askAi } from "./openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import { parseAIResponse } from "../utils/parseAIResponse.js";
import logger from "../utils/logger.js";

export const processCompletedInterview = async (interviewId, userId) => {
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview || interview.status !== "completed") {
      logger.info("CareerMemoryService: Skipped non-completed interview", { interviewId });
      return null;
    }

    const user = await User.findById(userId);
    if (!user) return null;

    const questionSummaries = interview.questions.map((q, i) => `
Q${i + 1}: ${q.question}
Answer: ${q.answer || "No answer"}
Score: ${q.score}/10
Feedback: ${q.feedback}
`).join("\n");

    const promptText = `
Role: ${interview.role}
Experience: ${interview.experience}
Mode: ${interview.mode}
Overall Final Score: ${interview.finalScore}/10

Interview Details:
${questionSummaries}
`;

    const messages = [
      {
        role: "system",
        content: `
You are an expert AI Career Coach evaluating a completed interview performance.

Analyze the candidate's responses and return strictly valid JSON in this format:

{
  "weakTopics": ["topic1", "topic2"],
  "strongTopics": ["topic1", "topic2"],
  "recommendedPracticeAreas": ["recommendation1", "recommendation2"],
  "readinessScore": number (0 to 100 based on performance and role difficulty)
}
`
      },
      {
        role: "user",
        content: promptText
      }
    ];

    const aiResponse = await askAi(messages);
    const parsed = parseAIResponse(aiResponse, {
      weakTopics: [], strongTopics: [], recommendedPracticeAreas: [],
      readinessScore: Math.min(100, Math.round(interview.finalScore * 10))
    });

    const weakTopics = parsed.weakTopics || [];
    const strongTopics = parsed.strongTopics || [];
    const recommendedPracticeAreas = parsed.recommendedPracticeAreas || [];
    const readinessScore = parsed.readinessScore || Math.min(100, Math.round(interview.finalScore * 10));

    // Save insights on Interview document
    interview.aiInsights = {
      weakTopics,
      strongTopics,
      recommendedPracticeAreas,
      generatedAt: new Date()
    };
    await interview.save();

    // Update User Career Profile & Career History
    if (!user.careerProfile) {
      user.careerProfile = {
        targetRoles: [],
        skillStrengths: [],
        skillWeaknesses: [],
        improvementAreas: [],
        readinessScore: 0,
        lastAnalyzedAt: new Date()
      };
    }

    if (!user.careerProfile.targetRoles.includes(interview.role)) {
      user.careerProfile.targetRoles.push(interview.role);
    }

    user.careerProfile.skillStrengths = Array.from(new Set([...(user.careerProfile.skillStrengths || []), ...strongTopics]));
    user.careerProfile.skillWeaknesses = Array.from(new Set([...(user.careerProfile.skillWeaknesses || []), ...weakTopics]));
    user.careerProfile.improvementAreas = Array.from(new Set([...(user.careerProfile.improvementAreas || []), ...recommendedPracticeAreas]));
    user.careerProfile.readinessScore = readinessScore;
    user.careerProfile.lastAnalyzedAt = new Date();

    user.careerHistory.push({
      interviewId: interview._id,
      readinessScore,
      weakTopics,
      strongTopics,
      recommendedPracticeAreas,
      createdAt: new Date()
    });

    await user.save();
    return { aiInsights: interview.aiInsights, careerProfile: user.careerProfile };
  } catch (error) {
    logger.error("CareerMemoryService Error", { error: error.message || error });
    return null;
  }
};
