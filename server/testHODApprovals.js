import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import StudentProfile from './models/StudentProfile.js';
import Application from './models/Application.js';
import PlacementDrive from './models/PlacementDrive.js';

dotenv.config();

const testHODApprovals = async () => {
  try {
    await connectDB();
    
    // Find the HOD user
    const hod = await User.findOne({ email: 'hod@gmail.com', role: 'hod' });
    if (!hod) {
      console.log('HOD user not found');
      process.exit(1);
    }
    
    console.log('HOD User:', hod.name, hod.email, hod.department);
    
    // Find all applications with hod-pending status
    const allPendingApplications = await Application.find({ status: 'hod-pending' });
    console.log('Total pending applications:', allPendingApplications.length);
    
    // Find students in the same department
    const studentsInDepartment = await StudentProfile.find()
      .populate('userId')
      .exec();
    
    // Filter to get only students that are in the HOD's department
    const validStudents = studentsInDepartment.filter(student => 
      student.userId && student.userId.department === hod.department
    );
    
    console.log('Students in department:', validStudents.length);
    
    if (validStudents.length > 0) {
      const studentIds = validStudents.map(student => student._id);
      console.log('Student IDs:', studentIds);
      
      // Find applications for these students with hod-pending status
      const applications = await Application.find({
        status: 'hod-pending',
        studentId: { $in: studentIds }
      }).populate({
        path: 'studentId',
        populate: {
          path: 'userId'
        }
      }).populate('driveId');
      
      console.log('Filtered pending applications:', applications.length);
      applications.forEach(app => {
        console.log(`- Student: ${app.studentId?.userId?.name || 'Unknown'}`);
        console.log(`  Roll Number: ${app.studentId?.rollNumber || 'Unknown'}`);
        console.log(`  Drive: ${app.driveId?.companyName || 'Unknown'}`);
        console.log(`  Status: ${app.status}`);
        console.log('---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testHODApprovals();