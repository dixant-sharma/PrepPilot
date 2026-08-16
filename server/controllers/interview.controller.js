import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import { processCompletedInterview } from "../services/careerMemory.service.js";
import { parseAIResponse } from "../utils/parseAIResponse.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const jobDescription = req.body?.jobDescription || "";

    const uint8Array = new Uint8Array(req.file.buffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    const promptUserText = `
RESUME TEXT:
${resumeText}

${jobDescription.trim() ? `TARGET JOB DESCRIPTION:\n${jobDescription.trim()}` : "TARGET JOB DESCRIPTION: None provided (Perform general role ATS evaluation)"}
`;

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume and perform ATS analysis.

Return strictly valid JSON in this format:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"],
  "atsScore": number (0 to 100),
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedSkills": ["skill1", "skill2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"]
}
`
      },
      {
        role: "user",
        content: promptUserText
      }
    ];

    const aiResponse = await askAi(messages);

    const parsed = parseAIResponse(aiResponse, {
      role: "", experience: "", projects: [], skills: [],
      atsScore: 70, missingKeywords: [], matchedSkills: [], improvementSuggestions: []
    });

    res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      atsScore: parsed.atsScore || 70,
      missingKeywords: parsed.missingKeywords || [],
      matchedSkills: parsed.matchedSkills || [],
      improvementSuggestions: parsed.improvementSuggestions || [],
      resumeText,
      jobDescription
    });

  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return res.status(500).json({ message: error.message || "Failed to analyze resume" });
  }
};


export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills, jobDescription, atsAnalysis } = req.body

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Role, Experience and Mode are required." })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required."
      });
    }

    const projectText = Array.isArray(projects) && projects.length
      ? projects.join(", ")
      : "None";

    const skillsText = Array.isArray(skills) && skills.length
      ? skills.join(", ")
      : "None";

    const safeResume = resumeText?.trim() || "None";
    const safeJD = jobDescription?.trim() || "None";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText}
    TargetJobDescription:${safeJD}
    Resume:${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty."
      });
    }

    const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];


    const aiResponse = await askAi(messages)

    if (!aiResponse || !aiResponse.trim()) {
           
      return res.status(500).json({
        message: "AI returned empty response."
      });

    }

    const questionsArray = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      
      return res.status(500).json({
        message: "AI failed to generate questions."
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      jobDescription: safeJD !== "None" ? safeJD : "",
      atsAnalysis: atsAnalysis || {
        atsScore: 0,
        missingKeywords: [],
        matchedSkills: [],
        improvementSuggestions: []
      },
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      }))
    })

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions
    });
  } catch (error) {
    return res.status(500).json({message:`failed to create interview ${error}`})
  }
}


export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken, isFollowUpAnswer } = req.body

    const interview = await Interview.findOne({ _id: interviewId, userId: req.userId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found or access denied" });
    }

    const question = interview.questions[questionIndex]
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Handle Follow-Up Answer Submission
    if (isFollowUpAnswer && question.followUps.length > 0) {
      const followUp = question.followUps[question.followUps.length - 1];
      followUp.answer = answer || "No answer provided";

      const followUpMessages = [
        {
          role: "system",
          content: `You are evaluating a candidate's answer to a follow-up interview question. Provide concise, constructive feedback (15-20 words) and a score (0 to 10). Return JSON: { "feedback": "string", "score": number }`
        },
        {
          role: "user",
          content: `Parent Question: ${question.question}\nFollow-Up Question: ${followUp.question}\nCandidate Answer: ${answer}`
        }
      ];

      const aiFollowUpResp = await askAi(followUpMessages);
      const parsedFollowUp = parseAIResponse(aiFollowUpResp, { feedback: "Good effort on the follow-up answer.", score: 7 });

      followUp.feedback = parsedFollowUp.feedback || "Good effort on the follow-up answer.";
      followUp.score = parsedFollowUp.score || 7;

      await interview.save();
      return res.json({ feedback: followUp.feedback });
    }

    // Handle Main Question Submission
    if (!answer || !answer.trim()) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    // Speech Fluency Calculation
    const words = answer.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMin = Math.max((timeTaken || 30) / 60, 0.2);
    const wpm = Math.round(wordCount / durationMin);

    const fillerRegex = /\b(um|uh|like|you know|basically|actually|i mean|sort of|kind of)\b/gi;
    const fillerMatches = answer.match(fillerRegex) || [];
    const fillerWordCount = fillerMatches.length;
    const fillerWordsFound = Array.from(new Set(fillerMatches.map(w => w.toLowerCase())));
    const fluencyScore = Math.max(0, Math.min(10, Math.round(10 - fillerWordCount * 1.5)));

    question.fluencyMetrics = {
      wpm,
      fillerWordCount,
      fillerWordsFound,
      fluencyScore
    };

    const isHRMode = interview.mode === "HR";

    // AI Evaluation Prompt (Cost-optimized by Mode)
    const messages = [
      {
        role: "system",
        content: isHRMode
          ? `
You are a professional HR interviewer evaluating a behavioral answer using the STAR framework.

Evaluate natural speech and return strictly valid JSON:

{
  "confidence": number (0-10),
  "communication": number (0-10),
  "correctness": number (0-10),
  "finalScore": number (0-10),
  "feedback": "short human feedback 12-18 words",
  "situationScore": number (0-10),
  "taskScore": number (0-10),
  "actionScore": number (0-10),
  "resultScore": number (0-10),
  "starScore": number (0-10),
  "aiRewrittenAnswer": "Optimized STAR model answer in 30-40 words",
  "warrantsFollowUp": boolean (true if answer is under 20 words or lacks depth),
  "followUpQuestion": "A targeted follow-up question if warrantsFollowUp is true, else empty string"
}
`
          : `
You are a senior technical interviewer evaluating a candidate's answer.

Evaluate correctness, technical depth, and communication clarity. Return strictly valid JSON:

{
  "confidence": number (0-10),
  "communication": number (0-10),
  "correctness": number (0-10),
  "finalScore": number (0-10),
  "feedback": "short human feedback 12-18 words",
  "warrantsFollowUp": boolean (true if answer is under 18 words or lacks technical depth),
  "followUpQuestion": "A technical follow-up question if warrantsFollowUp is true, else empty string"
}
`
      },
      {
        role: "user",
        content: `Question: ${question.question}\nCandidate Answer: ${answer}`
      }
    ];

    const aiResponse = await askAi(messages);
    const parsed = parseAIResponse(aiResponse, {
      confidence: 7, communication: 7, correctness: 7, finalScore: 7,
      feedback: "Good response.", warrantsFollowUp: false, followUpQuestion: ""
    });

    question.answer = answer;
    question.confidence = parsed.confidence || 7;
    question.communication = parsed.communication || 7;
    question.correctness = parsed.correctness || 7;
    question.score = parsed.finalScore || 7;
    question.feedback = parsed.feedback || "Good response.";

    if (isHRMode) {
      question.starAnalysis = {
        situationScore: parsed.situationScore || 7,
        taskScore: parsed.taskScore || 7,
        actionScore: parsed.actionScore || 7,
        resultScore: parsed.resultScore || 7,
        starScore: parsed.starScore || 7,
        aiRewrittenAnswer: parsed.aiRewrittenAnswer || "Clear situation, defined task, decisive action, measurable result."
      };
    }

    // Dynamic Follow-Up Handling (Nested under question)
    let hasFollowUp = false;
    let followUpQuestionText = "";

    if (parsed.warrantsFollowUp && parsed.followUpQuestion && question.followUps.length === 0) {
      hasFollowUp = true;
      followUpQuestionText = parsed.followUpQuestion;
      question.followUps.push({
        question: followUpQuestionText,
        answer: "",
        feedback: "",
        score: 0
      });
    }

    await interview.save();

    return res.status(200).json({
      feedback: question.feedback,
      hasFollowUp,
      followUpQuestion: followUpQuestionText,
      starAnalysis: question.starAnalysis,
      fluencyMetrics: question.fluencyMetrics
    });
  } catch (error) {
    console.error("submitAnswer Error:", error);
    return res.status(500).json({ message: `failed to submit answer ${error.message}` });
  }
}


export const finishInterview = async (req,res) => {
  try {
    const {interviewId} = req.body
    const interview = await Interview.findOne({ _id: interviewId, userId: req.userId });
    if(!interview){
      return res.status(404).json({message:"Interview not found or access denied"})
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    // Trigger AI Career Memory Processing (non-blocking to avoid delaying response)
    processCompletedInterview(interview._id, req.userId).catch((err) =>
      console.error("CareerMemory background processing error:", err)
    );

    return res.status(200).json({
       finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    })
  } catch (error) {
    return res.status(500).json({message:`failed to finish Interview ${error}`})
  }
}


export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
     return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.userId });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found or access denied" });
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

       return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      jobDescription: interview.jobDescription || "",
      atsAnalysis: interview.atsAnalysis || { atsScore: 0, missingKeywords: [], matchedSkills: [], improvementSuggestions: [] },
      questionWiseScore: interview.questions
    });

  } catch (error) {
    return res.status(500).json({message:`failed to find currentUser Interview report ${error}`})
  }
}




