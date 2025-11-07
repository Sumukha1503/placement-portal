import StudentProfile from '../models/StudentProfile.js';
import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Notification from '../models/Notification.js';
import { checkEligibility } from '../utils/helpers.js';
import { parseResumeWithAI } from '../services/aiService.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/students/profile
export const getProfile = async (req, res) => {
  const student = await StudentProfile.findOne({ userId: req.user._id });
  res.json({ success: true, profile: student });
};

// PUT /api/students/profile
export const updateProfile = async (req, res) => {
  const data = req.body;
  const profile = await StudentProfile.findOneAndUpdate(
    { userId: req.user._id },
    data,
    { new: true }
  );
  res.json({ success: true, profile });
};

// POST /api/students/upload-resume
export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  // Upload to Cloudinary
  const uploadRes = await cloudinary.uploader.upload_stream(
    { resource_type: "auto", folder: "resumes" },
    (error, result) => result
  );
  // AI Resume Parsing
  const parsedData = await parseResumeWithAI(req.file.buffer);

  // Update profile
  await StudentProfile.findOneAndUpdate(
    { userId: req.user._id },
    { resumeUrl: uploadRes.secure_url, resumeParsedData: parsedData }
  );
  res.json({ success: true, parsedData });
};

// GET /api/students/drives
export const getEligibleDrives = async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id });
  const drives = await PlacementDrive.find({ status: 'active' });

  // Filter drives by eligibility
  const eligibleDrives = drives.filter(drive => checkEligibility(profile, drive).eligible);

  res.json({ success: true, drives: eligibleDrives });
};

// POST /api/students/apply/:driveId
export const applyToDrive = async (req, res) => {
  try {
    const driveId = req.params.driveId;
    const student = await StudentProfile.findOne({ userId: req.user._id }).populate('userId');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Check eligibility before applying
    const drive = await PlacementDrive.findById(driveId);
    
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }
    
    const eligible = checkEligibility(student, drive);
    if (!eligible.eligible)
      return res.status(400).json({ success: false, message: eligible.reason });

    // Check if student has already applied to this drive
    const existingApplication = await Application.findOne({
      studentId: student._id,
      driveId
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied to this placement drive' 
      });
    }

    const application = await Application.create({
      studentId: student._id,
      driveId,
      status: 'hod-pending'
    });
    res.json({ success: true, application });
  } catch (error) {
    console.error('Error applying to drive:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied to this placement drive' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error while applying to drive' });
  }
};

// GET /api/students/applications
export const getApplications = async (req, res) => {
  const student = await StudentProfile.findOne({ userId: req.user._id });
  const apps = await Application.find({ studentId: student._id }).populate('driveId');
  res.json({ success: true, applications: apps });
};

// GET /api/students/notifications
export const getNotifications = async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, notifications: notes });
};

// PATCH /api/students/notifications/:id/read
export const readNotification = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
};

// GET /api/students/offer-letter/:applicationId
export const getOfferLetter = async (req, res) => {
  const app = await Application.findById(req.params.applicationId);
  res.json({ success: true, offerLetter: app.offerLetterUrl });
};
