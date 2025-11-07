import dotenv from 'dotenv';
import connectDB from './config/db.js';
import PlacementDrive from './models/PlacementDrive.js';
import StudentProfile from './models/StudentProfile.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const checkDrives = async () => {
  try {
    const drives = await PlacementDrive.find({});
    console.log('Existing drives:', drives);
    
    const students = await StudentProfile.find({});
    console.log('Existing students:', students);
    
    const users = await User.find({role: 'student'});
    console.log('Student users:', users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

checkDrives();