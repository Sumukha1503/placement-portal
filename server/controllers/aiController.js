import { parseResumeWithAI, generateEmailWithAI, analyzeJobFit } from '../services/aiService.js';

// POST /api/ai/parse-resume
export const parseResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const parsedData = await parseResumeWithAI(req.file.buffer);
  res.json({ success: true, parsedData });
};

// POST /api/ai/generate-email
export const generateEmail = async (req, res) => {
  const template = await generateEmailWithAI(req.body);
  res.json({ success: true, email: template });
};

// POST /api/ai/job-fit-analysis
export const jobFitAnalysis = async (req, res) => {
  const result = await analyzeJobFit(req.body.resumeSkills, req.body.jdText);
  res.json({ success: true, analysis: result });
};

// POST /api/ai/summarize-insights
export const summarizeInsights = async (req, res) => {
  // Example: Use AI to summarize placement data (needs model/api)
  res.json({ success: true, summary: "Insights summary generated." });
};
