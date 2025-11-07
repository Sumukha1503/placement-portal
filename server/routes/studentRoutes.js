import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  getEligibleDrives,
  applyToDrive,
  getApplications,
  getNotifications,
  readNotification,
  getOfferLetter
} from '../controllers/studentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/profile', protect, authorize('student'), getProfile);
router.put('/profile', protect, authorize('student'), updateProfile);
router.post('/upload-resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/drives', protect, authorize('student'), getEligibleDrives);
router.post('/apply/:driveId', protect, authorize('student'), applyToDrive);
router.get('/applications', protect, authorize('student'), getApplications);
router.get('/notifications', protect, authorize('student'), getNotifications);
router.patch('/notifications/:id/read', protect, authorize('student'), readNotification);
router.get('/offer-letter/:applicationId', protect, authorize('student'), getOfferLetter);

export default router;
