import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing email configuration environment variables:', missingEnvVars);
  console.warn('📧 Email functionality may not work properly');
}

// Clean up the password (remove spaces if any)
const cleanPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

// Create a mock transporter if email config is invalid
let transporter;

try {
  // Attempt to create transporter
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify configuration on startup (in development only)
  if (process.env.NODE_ENV === 'development') {
    transporter.verify((error, success) => {
      if (error) {
        console.warn('⚠️  Email configuration verification failed:', error.message);
        console.warn('📧 Email service will be disabled until configuration is fixed');
        // Set transporter to null to indicate it's not working
        transporter = null;
      } else {
        console.log('📧 Email transporter configured successfully');
      }
    });
  }
} catch (error) {
  console.warn('⚠️  Failed to create email transporter:', error.message);
  console.warn('📧 Email service will be disabled');
  transporter = null;
}

export default transporter;