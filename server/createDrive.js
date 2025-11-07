import dotenv from 'dotenv';
import connectDB from './config/db.js';
import PlacementDrive from './models/PlacementDrive.js';

dotenv.config();
connectDB();

const createDrive = async () => {
  try {
    const drive = await PlacementDrive.create({
      companyName: 'Microsoft',
      role: 'Software Engineer',
      jobDescription: 'Develop and maintain software applications',
      package: {
        ctc: 1500000,
        fixed: 1200000,
        variable: 300000
      },
      eligibility: {
        minCGPA: 7.0,
        allowedBranches: ['Computer Science', 'Electronics'],
        maxBacklogs: 1
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      rounds: [{
        roundNumber: 1,
        roundName: 'Online Assessment',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        venue: 'Online'
      }],
      status: 'active',
      createdBy: '690e2cf2430fe0dbc6447e52' // TPO user ID
    });
    
    console.log('New drive created:', drive);
  } catch (error) {
    console.error('Error creating drive:', error);
  } finally {
    process.exit(0);
  }
};

createDrive();