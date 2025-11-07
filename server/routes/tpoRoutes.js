import express from 'express';
import {
  createDrive,
  getDrives,
  getDriveDetails,
  updateDrive,
  deleteDrive,
  getApplicationsForDrive,
  bulkUpdateApplications,
  updateApplicationStatus,
  uploadOffers,
  sendEmails,
  generateEmailTemplate,
  filterResumes,
  getOverallAnalytics,
  generateReports,
  exportFilteredResumes
} from '../controllers/tpoController.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roleCheck.js';

const router = express.Router();

// All routes require TPO role
router.use(protect, authorize('tpo'));

// Drive Management
router.post('/drives', createDrive);
router.get('/drives', getDrives);
router.get('/drives/:id', getDriveDetails);
router.put('/drives/:id', updateDrive);
router.delete('/drives/:id', deleteDrive);
router.get('/drives/:id/applications', getApplicationsForDrive);

// Application Management
router.patch('/applications/bulk-update', bulkUpdateApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// Offer Management
router.post('/offers/upload', uploadOffers);

// Email System
router.post('/emails/send', sendEmails);
router.post('/emails/generate', generateEmailTemplate);

// Resume Filtering
router.get('/resumes/filter', filterResumes);
router.get('/resumes/export', exportFilteredResumes); // Add export route

// Analytics & Reports
router.get('/analytics/overall', getOverallAnalytics);
router.get('/reports/:type', generateReports);

export default router;