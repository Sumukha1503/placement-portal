import dotenv from 'dotenv';
import transporter from './config/email.js';

dotenv.config();

console.log('Sending test email...\n');

const sendTestEmail = async () => {
  try {
    // Check if transporter exists
    if (!transporter) {
      console.log('❌ Email transporter is not configured');
      return;
    }
    
    console.log('Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully!');
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Placement Portal Test Email',
      text: 'This is a test email from the Placement Portal application.',
      html: '<h1>Placement Portal Test Email</h1><p>This is a test email from the Placement Portal application.</p>'
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.log('❌ Failed to send email:', error.message);
    
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
  }
};

sendTestEmail();