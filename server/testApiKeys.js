import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

dotenv.config();

console.log('Testing API Keys...\n');

// Test Email Configuration
console.log('1. Testing Email Configuration...');
try {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  await transporter.verify();
  console.log('✅ Email configuration is working\n');
} catch (error) {
  console.log('❌ Email configuration failed:', error.message, '\n');
}

// Test Cloudinary Configuration
console.log('2. Testing Cloudinary Configuration...');
try {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Test with a simple API call
  const result = await cloudinary.api.ping();
  console.log('✅ Cloudinary configuration is working\n');
} catch (error) {
  console.log('❌ Cloudinary configuration failed:', error.message, '\n');
}

// Test OpenAI API
console.log('3. Testing OpenAI API...');
try {
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  // Test API key validity with a simple request
  const response = await openai.models.list();
  
  if (response && response.data) {
    console.log('✅ OpenAI API key is valid\n');
  } else {
    console.log('❌ OpenAI API key validation failed: Unexpected response\n');
  }
} catch (error) {
  // If we get 401, the key is invalid
  if (error.message.includes('401')) {
    console.log('❌ OpenAI API key is invalid\n');
  } else {
    console.log('❌ OpenAI API test failed:', error.message, '\n');
  }
}

console.log('API Key Testing Complete!');