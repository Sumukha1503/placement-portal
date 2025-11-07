import transporter from '../config/email.js';
import EmailLog from '../models/EmailLog.js';

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.warn('📧 Email transporter is not configured or not working. Email not sent.');
      // Log failed email
      await EmailLog.create({
        recipientEmail: to,
        subject,
        body: html,
        status: 'failed',
        error: 'Email transporter not configured or not working'
      });
      return { success: false, error: 'Email service not available' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email
    await EmailLog.create({
      recipientEmail: to,
      subject,
      body: html,
      status: 'sent',
      sentAt: new Date()
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email sending failed:', error.message);
    
    // Log failed email
    await EmailLog.create({
      recipientEmail: to,
      subject,
      body: html,
      status: 'failed',
      error: error.message
    });

    // Return success: false instead of throwing to prevent app crashes
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  driveAnnouncement: (studentName, companyName, role, deadline) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Placement Drive Announced!</h1>
        </div>
        <div class="content">
          <p>Dear ${studentName},</p>
          <p>We are excited to announce a new placement opportunity:</p>
          <ul>
            <li><strong>Company:</strong> ${companyName}</li>
            <li><strong>Role:</strong> ${role}</li>
            <li><strong>Application Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</li>
          </ul>
          <p>Log in to your portal to view full details and apply.</p>
          <a href="${process.env.CLIENT_URL}/student/drives" class="button">View Drive Details</a>
        </div>
        <div class="footer">
          <p>© 2025 College Placement Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  applicationConfirmation: (studentName, companyName, role) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Application Submitted Successfully!</h1>
        </div>
        <div class="content">
          <p>Dear ${studentName},</p>
          <p>Your application has been successfully submitted for:</p>
          <ul>
            <li><strong>Company:</strong> ${companyName}</li>
            <li><strong>Role:</strong> ${role}</li>
          </ul>
          <p>Your application is pending HOD approval. You will receive further updates via email.</p>
          <p>Good luck! 🎯</p>
        </div>
        <div class="footer">
          <p>© 2025 College Placement Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  statusUpdate: (studentName, companyName, status, message) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status { padding: 15px; background: #dbeafe; border-left: 4px solid #3B82F6; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${studentName},</p>
          <p>There's an update on your application for <strong>${companyName}</strong>:</p>
          <div class="status">
            <strong>Status:</strong> ${status}<br>
            ${message ? `<strong>Message:</strong> ${message}` : ''}
          </div>
          <p>Check your dashboard for more details.</p>
        </div>
        <div class="footer">
          <p>© 2025 College Placement Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};