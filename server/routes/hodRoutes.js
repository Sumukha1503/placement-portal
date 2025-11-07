import express from 'express';
import {
  getDepartmentStudents,
  getStudentDetails,
  editStudentProfile,
  getPendingApprovals,
  approveApplication,
  rejectApplication,
  generateDepartmentReport,
  getDepartmentAnalytics,
  exportStudentsData
} from '../controllers/hodController.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roleCheck.js';

const router = express.Router();

// All routes require HOD role
router.use(protect, authorize('hod'));

router.get('/students', getDepartmentStudents);
router.get('/students/:id', getStudentDetails);
router.put('/students/:id', editStudentProfile);
router.get('/students/export', exportStudentsData); // Add export route
router.get('/applications/pending', getPendingApprovals);
router.patch('/applications/:id/approve', approveApplication);
router.patch('/applications/:id/reject', rejectApplication);
router.get('/reports/department', generateDepartmentReport);
router.get('/analytics/department', getDepartmentAnalytics);

export default router;