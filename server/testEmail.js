import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('Testing Email Configuration...\n');

// Log configuration details (without sensitive info)
console.log('Email Configuration:');
console.log('- Host:', process.env.EMAIL_HOST);
console.log('- Port:', process.env.EMAIL_PORT);
console.log('- User:', process.env.EMAIL_USER);
console.log('- Pass format:', process.env.EMAIL_PASS ? 
  (process.env.EMAIL_PASS.includes(' ') ? 'Contains spaces (may be invalid)' : 'No spaces') : 
  'Not set');
console.log('- Pass length:', process.env.EMAIL_PASS?.length || 0);
console.log('- From:', process.env.EMAIL_FROM);
console.log('');

// Clean up the password (remove spaces if any)
const cleanPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: cleanPassword
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: false, // Set to true for detailed logs
  debug: false   // Set to true for detailed logs
});

console.log('Verifying email configuration...');
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration failed:', error.message);
    
    // Provide specific troubleshooting steps
    if (error.message.includes('535-5.7.8')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Make sure you are using an App Password, not your regular Gmail password');
      console.log('2. Visit https://myaccount.google.com/apppasswords to generate an app password');
      console.log('3. Enable 2-Factor Authentication on your Google account if not already enabled');
      console.log('4. Use the 16-character app password in the EMAIL_PASS field');
      console.log('5. Make sure there are no extra spaces in your app password');
      console.log('6. The app password should be exactly 16 characters');
      console.log('7. Try generating a new app password');
    }
  } else {
    console.log('✅ Email configuration is working');
    console.log('Server is ready to send messages');
  }
  
  console.log('\nTest completed!');
});