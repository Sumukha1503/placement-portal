import dotenv from 'dotenv';
import connectDB from './config/db.js';
import PlacementDrive from './models/PlacementDrive.js';
import StudentProfile from './models/StudentProfile.js';
import Application from './models/Application.js';
import User from './models/User.js';
import { checkEligibility } from './utils/helpers.js';

dotenv.config();
connectDB();

const testApply = async () => {
  try {
    // Get the first student and drive
    const student = await StudentProfile.findOne({}).populate('userId');
    const drive = await PlacementDrive.findOne({});
    
    console.log('Student:', student);
    console.log('Drive:', drive);
    
    // Check eligibility
    const eligibility = checkEligibility(student, drive);
    console.log('Eligibility check:', eligibility);
    
    if (eligibility.eligible) {
      // Try to create an application
      const application = await Application.create({
        studentId: student._id,
        driveId: drive._id,
        status: 'hod-pending'
      });
      console.log('Application created:', application);
    } else {
      console.log('Not eligible:', eligibility.reason);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

testApply();