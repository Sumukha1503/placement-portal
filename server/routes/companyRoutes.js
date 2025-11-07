import express from 'express';
import {
  getCompanies,
  getCompanyDetails,
  getCompanyStats
} from '../controllers/companyController.js';
import {
  createDrive,
  getDrives,
  getDriveDetails,
  updateDrive,
  deleteDrive,
  getApplicationsForDrive,
  updateApplicationStatus,
  sendEmails,
  generateEmailTemplate,
  getOverallAnalytics,
  generateReports
} from '../controllers/tpoController.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roleCheck.js';

const router = express.Router();

// Public routes
router.get('/', getCompanies);
router.get('/:name', getCompanyDetails);
router.get('/:name/stats', getCompanyStats);

// Protected routes for company users
router.use(protect, authorize('company'));

// Drive Management (company can only manage their own drives)
router.post('/drives', createDrive);
router.get('/drives', getDrives);
router.get('/drives/:id', getDriveDetails);
router.put('/drives/:id', updateDrive);
router.delete('/drives/:id', deleteDrive);
router.get('/drives/:id/applications', getApplicationsForDrive);

// Application Management
router.patch('/applications/:id/status', updateApplicationStatus);

// Email System
router.post('/emails/send', sendEmails);
router.post('/emails/generate', generateEmailTemplate);

// Analytics & Reports
router.get('/analytics/overall', getOverallAnalytics);
router.get('/reports/:type', generateReports);

export default router;