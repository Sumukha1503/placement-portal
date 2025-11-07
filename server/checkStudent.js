import dotenv from 'dotenv';
import connectDB from './config/db.js';
import StudentProfile from './models/StudentProfile.js';

dotenv.config();
connectDB();

const checkStudent = async () => {
  try {
    const student = await StudentProfile.findById('690e2cf1430fe0dbc6447e50');
    console.log('Student profile:', student);
    console.log('Student userId:', student.userId);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

checkStudent();