import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetTestPasswords = async () => {
  try {
    await connectDB();
    
    const testUsers = [
      { email: 'student@example.com', password: 'student123' },
      { email: 'tpo@example.com', password: 'tpo123' },
      { email: 'hod@example.com', password: 'hod123' },
      { email: 'company@example.com', password: 'company123' }
    ];
    
    console.log('Resetting test user passwords...');
    
    for (const user of testUsers) {
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
    
    console.log('Password reset completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error.message);
    process.exit(1);
  }
};

resetTestPasswords();