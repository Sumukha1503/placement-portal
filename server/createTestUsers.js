import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import StudentProfile from './models/StudentProfile.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const createTestUsers = async () => {
  try {
    // Clear existing test users (optional)
    // await User.deleteMany({ email: { $regex: 'test.*@example.com' } });
    
    // Create test users
    const testUsers = [
      {
        name: 'Test Student',
        email: 'student@example.com',
        password: 'student123',
        role: 'student',
        department: 'Computer Science'
      },
      {
        name: 'Test TPO',
        email: 'tpo@example.com',
        password: 'tpo123',
        role: 'tpo',
        department: null
      },
      {
        name: 'Test HOD',
        email: 'hod@example.com',
        password: 'hod123',
        role: 'hod',
        department: 'Computer Science'
      },
      {
        name: 'Test Company',
        email: 'company@example.com',
        password: 'company123',
        role: 'company',
        companyName: 'TechCorp'
      }
    ];

    for (const userData of testUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        department: userData.department,
        companyName: userData.companyName
      });
      
      console.log(`Created ${userData.role} user: ${user.email}`);
      
      // Create student profile if needed
      if (userData.role === 'student') {
        const studentProfile = await StudentProfile.create({
          userId: user._id,
          rollNumber: `ROLL${Math.floor(1000 + Math.random() * 9000)}`,
          batch: 2024,
          cgpa: 8.5,
          phone: '9876543210',
          backlogs: 0
        });
        console.log(`Created student profile for: ${user.email}`);
      }
    }
    
    console.log('Test users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();