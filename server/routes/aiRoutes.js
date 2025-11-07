import express from 'express';
import {
  parseResume,
  generateEmail,
  jobFitAnalysis,
  summarizeInsights
} from '../controllers/aiController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(protect); // All AI routes require authentication

router.post('/parse-resume', upload.single('resume'), parseResume);
router.post('/generate-email', generateEmail);
router.post('/job-fit-analysis', jobFitAnalysis);
router.post('/summarize-insights', summarizeInsights);

export default router;
