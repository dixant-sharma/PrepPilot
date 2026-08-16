import axios from "axios";
import logger from "../utils/logger.js";

const AI_TIMEOUT_MS = 30000; // 30-second timeout
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;

/**
 * askAi — Calls OpenRouter LLM API with timeout, retry, and structured error handling.
 *
 * @param {Array} messages - OpenRouter-compatible messages array
 * @returns {string} The AI response content
 * @throws {Error} Descriptive error for timeout, rate limit, or API failure
 */
export const askAi = async (messages) => {
    if(!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error("Messages array is empty.");
    }

    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
                {
                    model: process.env.AI_MODEL || "openai/gpt-4o-mini",
                    messages: messages
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: AI_TIMEOUT_MS,
                }
            );

            const content = response?.data?.choices?.[0]?.message?.content;

            if (!content || !content.trim()) {
                throw new Error("AI returned empty response.");
            }

            return content;
        } catch (error) {
            lastError = error;

            // Timeout — retry if attempts remain
            if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
                logger.warn(`OpenRouter timeout (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue;
                }
                throw new Error("AI service timed out. Please try again.");
            }

            // Rate limited by OpenRouter
            if (error.response?.status === 429) {
                logger.warn("OpenRouter rate limited");
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * 2));
                    continue;
                }
                throw new Error("AI service is temporarily busy. Please try again in a moment.");
            }

            // Server errors (500, 502, 503) — retry
            if (error.response?.status >= 500) {
                logger.warn(`OpenRouter server error ${error.response.status} (attempt ${attempt + 1})`);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue;
                }
                throw new Error("AI service is temporarily unavailable. Please try again later.");
            }

            // Client errors (400, 401, 403) — do not retry
            if (error.response?.status >= 400 && error.response?.status < 500) {
                logger.error("OpenRouter client error", { error: error.response?.data });
                throw new Error("AI service configuration error. Please contact support.");
            }

            // Network errors — retry
            if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
                logger.warn(`OpenRouter network error (attempt ${attempt + 1})`);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue;
                }
                throw new Error("Unable to reach AI service. Please check your connection.");
            }

            // Unknown errors
            logger.error("OpenRouter Error", { error: error.response?.data || error.message });
            throw new Error("AI service error. Please try again.");
        }
    }

    // Fallback
    logger.error("OpenRouter: All retries exhausted", { error: lastError?.message });
    throw new Error("AI service unavailable after retries. Please try again later.");
};