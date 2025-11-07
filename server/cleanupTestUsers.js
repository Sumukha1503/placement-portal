import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const cleanupTestUsers = async () => {
  try {
    await connectDB();
    
    const result = await User.deleteMany({
      email: { 
        $in: [
          'test.user@example.com', 
          'test.user2@example.com', 
          'company@example.com',
          'api.test@example.com',
          'profile.test@example.com',
          'student@example.com',
          'tpo@example.com',
          'hod@example.com'
        ] 
      }
    });
    
    console.log(`✅ Cleaned up ${result.deletedCount} test users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up test users:', error.message);
    process.exit(1);
  }
};

cleanupTestUsers();