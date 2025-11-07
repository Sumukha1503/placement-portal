import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetDemoPasswords = async () => {
  try {
    await connectDB();
    
    const demoUsers = [
      { email: 'student@gmail.com', password: 'student123' },
      { email: 'tpo@gmail.com', password: 'tpo123' },
      { email: 'hod@gmail.com', password: 'hod123' },
      { email: 'company@gmail.com', password: 'company123' }
    ];
    
    console.log('Resetting demo user passwords...');
    
    for (const user of demoUsers) {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Update the user's password
        await User.updateOne(
          { email: user.email },
          { password: hashedPassword }
        );
        
        console.log(`✅ Password reset for ${user.email}`);
      } else {
        console.log(`❌ User ${user.email} not found`);
      }
    }
    
    console.log('Demo password reset completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error.message);
    process.exit(1);
  }
};

resetDemoPasswords();