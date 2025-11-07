import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import StudentProfile from './models/StudentProfile.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const createDemoUsers = async () => {
  try {
    // Clear existing demo users (optional)
    await User.deleteMany({ email: { $regex: '.*@gmail.com' } });
    console.log('Cleared existing demo users');
    
    // Create demo users
    const demoUsers = [
      {
        name: 'Demo Student',
        email: 'student@gmail.com',
        password: 'student123',
        role: 'student',
        department: 'Computer Science'
      },
      {
        name: 'Demo TPO',
        email: 'tpo@gmail.com',
        password: 'tpo123',
        role: 'tpo',
        department: null
      },
      {
        name: 'Demo HOD',
        email: 'hod@gmail.com',
        password: 'hod123',
        role: 'hod',
        department: 'Computer Science'
      },
      {
        name: 'Demo Company',
        email: 'company@gmail.com',
        password: 'company123',
        role: 'company',
        companyName: 'TechCorp'
      }
    ];

    for (const userData of demoUsers) {
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
          rollNumber: `DEMO${Math.floor(1000 + Math.random() * 9000)}`,
          batch: 2024,
          cgpa: 8.5,
          phone: '9876543210',
          backlogs: 0
        });
        console.log(`Created student profile for: ${user.email}`);
      }
    }
    
    console.log('\nDemo users created successfully!');
    console.log('\n=== DEMO CREDENTIALS ===');
    console.log('1. Student:');
    console.log('   Email: student@gmail.com');
    console.log('   Password: student123');
    console.log('   Role: student');
    console.log('   Department: Computer Science');
    console.log('');
    console.log('2. TPO:');
    console.log('   Email: tpo@gmail.com');
    console.log('   Password: tpo123');
    console.log('   Role: tpo');
    console.log('');
    console.log('3. HOD:');
    console.log('   Email: hod@gmail.com');
    console.log('   Password: hod123');
    console.log('   Role: hod');
    console.log('   Department: Computer Science');
    console.log('');
    console.log('4. Company:');
    console.log('   Email: company@gmail.com');
    console.log('   Password: company123');
    console.log('   Role: company');
    console.log('   Company Name: TechCorp');
    console.log('\n========================');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
};

createDemoUsers();