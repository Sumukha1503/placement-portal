# Email Configuration Guide

This guide will help you properly configure email settings for the Placement Portal application.

## Gmail Configuration (Recommended)

### Prerequisites
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password

### Steps to Configure Gmail

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the steps to enable it

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password (without spaces)

3. **Update Environment Variables**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password (without spaces)
   EMAIL_FROM=no-reply@yourdomain.com
   ```

### Common Issues and Solutions

1. **Authentication Failed (535-5.7.8)**
   - Ensure you're using an App Password, not your regular Gmail password
   - Make sure 2-Factor Authentication is enabled
   - Remove any spaces from the App Password
   - Generate a new App Password

2. **Less Secure Apps**
   - Gmail no longer supports "Less Secure Apps" setting
   - You must use App Passwords with 2FA

## Alternative Email Providers

If Gmail continues to cause issues, consider these alternatives:

### SendGrid (Recommended Alternative)
1. Sign up at https://sendgrid.com/
2. Get your API key
3. Update environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   EMAIL_FROM=no-reply@yourdomain.com
   ```

### Mailgun
1. Sign up at https://www.mailgun.com/
2. Get your SMTP credentials
3. Update environment variables:
   ```
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=your-mailgun-username
   EMAIL_PASS=your-mailgun-password
   EMAIL_FROM=no-reply@yourdomain.com
   ```

### Amazon SES
1. Set up Amazon SES in AWS
2. Get your SMTP credentials
3. Update environment variables:
   ```
   EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_USER=your-ses-access-key
   EMAIL_PASS=your-ses-secret-key
   EMAIL_FROM=no-reply@yourdomain.com
   ```

## Testing Email Configuration

Run the following command to test your email configuration:
```bash
npm run test-email
```

Or to send a test email:
```bash
npm run send-test-email
```

## Troubleshooting

1. **Check Firewall/Network**
   - Ensure port 587 is not blocked
   - Some corporate networks block SMTP ports

2. **Verify Credentials**
   - Double-check EMAIL_USER and EMAIL_PASS
   - Ensure there are no extra spaces or characters

3. **Check Environment Variables**
   - Make sure all variables are correctly set in `.env` file
   - Restart the server after making changes

4. **Debug Information**
   - Enable debug mode in `config/email.js` by setting `debug: true`
   - Check server logs for detailed error messages