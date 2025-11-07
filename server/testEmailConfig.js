import dotenv from 'dotenv';
import transporter from './config/email.js';

dotenv.config();

console.log('Testing Email Configuration...\n');

// Display current configuration (without revealing the actual password)
console.log('Email Configuration:');
console.log('- Host:', process.env.EMAIL_HOST);
console.log('- Port:', process.env.EMAIL_PORT);
console.log('- User:', process.env.EMAIL_USER);
console.log('- Pass format:', process.env.EMAIL_PASS ? 'No spaces' : 'Not set');
console.log('- Pass length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '').length : 0);
console.log('- From:', process.env.EMAIL_FROM);
console.log('');

// Check if all required environment variables are set
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log('❌ Missing required environment variables:', missingEnvVars);
  console.log('Please check your .env file');
  process.exit(1);
}

// Clean up the password (remove spaces if any)
const cleanPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

console.log('Verifying email configuration...');
console.log('This may take a few seconds...\n');

// Test the transporter configuration
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration failed:', error.message);
      
      // Provide troubleshooting steps based on common issues
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Make sure you are using an App Password, not your regular Gmail password');
      console.log('2. Visit https://myaccount.google.com/apppasswords to generate an app password');
      console.log('3. Enable 2-Factor Authentication on your Google account if not already enabled');
      console.log('4. Use the 16-character app password in the EMAIL_PASS field');
      console.log('5. Make sure there are no extra spaces in your app password');
      console.log('6. The app password should be exactly 16 characters');
      console.log('7. Try generating a new app password');
    } else {
      console.log('✅ Email configuration verified successfully!');
      console.log('You can now send emails through the application');
    }
    
    console.log('\nTest completed!');
  });
} else {
  console.log('❌ Email transporter could not be created');
  console.log('Check your email configuration in the .env file');
}