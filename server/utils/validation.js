export const validateRequiredFields = (fields, reqBody) => {
  const missing = [];
  for (const field of fields) {
    if (reqBody[field] === undefined || reqBody[field] === null || (typeof reqBody[field] === "string" && !reqBody[field].trim())) {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    return `Missing required parameters: ${missing.join(", ")}`;
  }
  return null;
};
