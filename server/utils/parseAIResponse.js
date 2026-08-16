/**
 * parseAIResponse - Safely parses AI/LLM responses that may contain
 * markdown fences, extra text, or malformed JSON.
 *
 * Handles these common LLM output issues:
 * 1. Response wrapped in ```json ... ``` markdown fences
 * 2. Extra text before/after the JSON object
 * 3. Completely malformed/non-JSON responses
 *
 * @param {string} rawResponse - The raw string from the AI model
 * @param {object} fallback - Default object to return if parsing fails entirely
 * @returns {object} Parsed JSON object or fallback
 */
export const parseAIResponse = (rawResponse, fallback = {}) => {
  if (!rawResponse || typeof rawResponse !== "string") {
    console.warn("parseAIResponse: Received empty or non-string AI response");
    return fallback;
  }

  let cleaned = rawResponse.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/;
  const fenceMatch = cleaned.match(fenceRegex);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Attempt direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Continue to fallback extraction
  }

  // Try to extract the first JSON object from the text
  const objectRegex = /\{[\s\S]*\}/;
  const objectMatch = cleaned.match(objectRegex);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch (_) {
      // Continue to fallback
    }
  }

  // Try to extract a JSON array
  const arrayRegex = /\[[\s\S]*\]/;
  const arrayMatch = cleaned.match(arrayRegex);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (_) {
      // Continue to fallback
    }
  }

  console.error("parseAIResponse: Failed to parse AI response:", rawResponse.substring(0, 200));
  return fallback;
};
