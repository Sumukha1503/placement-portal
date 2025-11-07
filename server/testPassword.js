import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const testPassword = async () => {
  try {
    await connectDB();
    
    // Create a test user directly
    const plainPassword = 'student123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);
    
    // Test comparison
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Direct comparison result:', isMatch);
    
    // Create user
    await User.deleteOne({ email: 'test@gmail.com' });
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@gmail.com',
      password: plainPassword, // Let the pre-save hook handle hashing
      role: 'student',
      department: 'Computer Science'
    });
    
    console.log('User created with email:', user.email);
    console.log('User password (hashed):', user.password);
    
    // Test comparison with user model method
    const modelMatch = await user.comparePassword(plainPassword);
    console.log('Model comparison result:', modelMatch);
    
    await User.deleteOne({ email: 'test@gmail.com' });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testPassword();