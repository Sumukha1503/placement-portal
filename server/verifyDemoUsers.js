import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const verifyDemoUsers = async () => {
  try {
    await connectDB();
    
    // Check for specific demo users
    const demoUsers = [
      { email: 'student@gmail.com', password: 'student123' },
      { email: 'tpo@gmail.com', password: 'tpo123' },
      { email: 'hod@gmail.com', password: 'hod123' },
      { email: 'company@gmail.com', password: 'company123' }
    ];
    
    console.log('Verifying Demo Users:');
    console.log('====================');
    
    for (const userData of demoUsers) {
      const user = await User.findOne({ email: userData.email }).select('+password');
      if (user) {
        console.log(`Email: ${userData.email}`);
        console.log(`Expected password: ${userData.password}`);
        console.log(`Stored password hash: ${user.password}`);
        
        // Test with bcrypt directly
        const bcryptMatch = await bcrypt.compare(userData.password, user.password);
        console.log(`Bcrypt comparison: ${bcryptMatch}`);
        
        // Test with model method
        const modelMatch = await user.comparePassword(userData.password);
        console.log(`Model comparison: ${modelMatch}`);
        
        console.log(`Status: ${bcryptMatch ? '✅ VALID' : '❌ INVALID'}`);
        console.log(`Role: ${user.role}`);
        console.log('------------------------');
      } else {
        console.log(`Email: ${userData.email}`);
        console.log(`Status: ❌ USER NOT FOUND`);
        console.log('------------------------');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error verifying users:', error.message);
    process.exit(1);
  }
};

verifyDemoUsers();