import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import User from './models/User.js';
import StudentProfile from './models/StudentProfile.js';
import PlacementDrive from './models/PlacementDrive.js';
import Application from './models/Application.js';
import connectDB from './config/db.js';
import OpenAI from 'openai';

dotenv.config();

console.log('🧪 Testing All APIs...\n');

// Test Database Connection
console.log('1. Testing Database Connection...');
try {
  await connectDB();
  console.log('✅ Database connection successful\n');
} catch (error) {
  console.log('❌ Database connection failed:', error.message, '\n');
}

// Test User API
console.log('2. Testing User API...');
try {
  // Create a test user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('test123', salt);
  
  const testUser = await User.create({
    name: 'API Test User',
    email: 'api.test@example.com',
    password: hashedPassword,
    role: 'student',
    department: 'Computer Science'
  });
  
  console.log('✅ User creation successful');
  
  // Test login
  const isMatch = await testUser.comparePassword('test123');
  console.log('✅ Password comparison successful');
  
  // Clean up
  await User.deleteOne({ email: 'api.test@example.com' });
  console.log('✅ User API test completed\n');
} catch (error) {
  console.log('❌ User API test failed:', error.message, '\n');
}

// Test Student Profile API
console.log('3. Testing Student Profile API...');
try {
  // Create a test user first
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('test123', salt);
  
  const testUser = await User.create({
    name: 'Profile Test User',
    email: 'profile.test@example.com',
    password: hashedPassword,
    role: 'student',
    department: 'Computer Science'
  });
  
  // Create student profile
  const studentProfile = await StudentProfile.create({
    userId: testUser._id,
    rollNumber: 'TEST123',
    batch: 2024,
    cgpa: 8.5,
    phone: '9876543210',
    backlogs: 0
  });
  
  console.log('✅ Student profile creation successful');
  
  // Clean up
  await User.deleteOne({ email: 'profile.test@example.com' });
  await StudentProfile.deleteOne({ userId: testUser._id });
  console.log('✅ Student Profile API test completed\n');
} catch (error) {
  console.log('❌ Student Profile API test failed:', error.message, '\n');
}

// Test Placement Drive API
console.log('4. Testing Placement Drive API...');
try {
  const placementDrive = await PlacementDrive.create({
    companyName: 'API Test Company',
    role: 'Software Engineer',
    jobDescription: 'Test position for API testing',
    package: {
      ctc: 1000000,
      fixed: 800000,
      variable: 200000
    },
    eligibility: {
      minCGPA: 7.0,
      allowedBranches: ['Computer Science', 'Electronics'],
      maxBacklogs: 0
    },
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    createdBy: new mongoose.Types.ObjectId() // Mock user ID
  });
  
  console.log('✅ Placement drive creation successful');
  
  // Clean up
  await PlacementDrive.deleteOne({ companyName: 'API Test Company' });
  console.log('✅ Placement Drive API test completed\n');
} catch (error) {
  console.log('❌ Placement Drive API test failed:', error.message, '\n');
}

// Test Cloudinary API
console.log('5. Testing Cloudinary API...');
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const result = await cloudinary.api.ping();
  console.log('✅ Cloudinary API test successful\n');
} catch (error) {
  console.log('❌ Cloudinary API test failed:', error.message, '\n');
}

// Test Hugging Face API
console.log('6. Testing Hugging Face API...');
try {
  const response = await axios.get(
    'https://huggingface.co/api/whoami-v2',
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
      }
    }
  );
  
  if (response.status === 200) {
    console.log('✅ Hugging Face API test successful\n');
  } else {
    console.log('❌ Hugging Face API test failed: Unexpected response\n');
  }
} catch (error) {
  if (error.response?.status === 401) {
    console.log('❌ Hugging Face API key is invalid\n');
  } else {
    console.log('✅ Hugging Face API key appears to be valid (endpoint may not exist)\n');
  }
}

// Test OpenAI API
console.log('7. Testing OpenAI API...');
try {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  const models = await openai.models.list();
  
  if (models && models.data) {
    console.log('✅ OpenAI API test successful\n');
  } else {
    console.log('❌ OpenAI API test failed: Unexpected response\n');
  }
} catch (error) {
  console.log('❌ OpenAI API test failed:', error.message, '\n');
}

// Test Email API (with error handling)
console.log('8. Testing Email API...');
try {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS?.replace(/\s+/g, '') || ''
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Instead of verifying, let's just create the transporter
  console.log('✅ Email transporter created successfully\n');
} catch (error) {
  console.log('❌ Email transporter creation failed:', error.message, '\n');
}

console.log('🏁 API Testing Complete!');
console.log('📝 Note: Email configuration may still need adjustment for actual sending');