import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Application from './models/Application.js';

dotenv.config();

const testHODApproval = async () => {
  try {
    await connectDB();
    
    // Find a pending application
    const application = await Application.findOne({ status: 'hod-pending' });
    
    if (!application) {
      console.log('No pending applications found');
      process.exit(1);
    }
    
    console.log('Found pending application:');
    console.log('- Application ID:', application._id);
    console.log('- Student ID:', application.studentId);
    console.log('- Drive ID:', application.driveId);
    console.log('- Current Status:', application.status);
    
    // Approve the application
    const updatedApplication = await Application.findByIdAndUpdate(
      application._id, 
      { status: 'hod-approved' }, 
      { new: true }
    );
    
    console.log('Application approved:');
    console.log('- New Status:', updatedApplication.status);
    
    // Verify the update
    const verifiedApplication = await Application.findById(application._id);
    console.log('Verification:');
    console.log('- Status in DB:', verifiedApplication.status);
    
    // Check how many pending applications are left
    const pendingCount = await Application.countDocuments({ status: 'hod-pending' });
    console.log('Remaining pending applications:', pendingCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testHODApproval();