# Email Service Setup Guide

## Current Status
The nodemailer and dotenv packages are already installed in your project. The email configuration is set up in the `.env` file, but it's currently failing authentication.

## Issue
The error "535-5.7.8 Username and Password not accepted" indicates that you're likely using a regular Gmail password instead of an App Password.

## Solution: Configure Gmail with App Password

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the steps to enable it

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. If prompted, enter your password
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other" and name it "Placement Portal"
5. Click "Generate"
6. Copy the 16-character password (without spaces)

### Step 3: Update .env File
Replace the EMAIL_PASS value in your `.env` file with the generated App Password:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password-here
EMAIL_FROM=no-reply@placement-portal.com
```

## Alternative: Use SendGrid (Recommended)

If you continue to have issues with Gmail, consider using SendGrid:

1. Sign up at https://sendgrid.com/ (Free tier available)
2. Go to Settings > API Keys
3. Create a new API key with "Mail Send" permissions
4. Update your `.env` file:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key-here
EMAIL_FROM=no-reply@placement-portal.com
```

## Testing Your Configuration

After updating your configuration:

1. Save the `.env` file
2. Restart your server
3. Run the test command:
   ```bash
   npm run test-email-config
   ```

## Troubleshooting

If you're still having issues:

1. Double-check that there are no extra spaces in your App Password
2. Ensure your App Password is exactly 16 characters
3. Try generating a new App Password
4. Check that 2-Factor Authentication is enabled
5. Verify that your Gmail account is not suspended or locked

## Need Help?

If you're still having trouble, please:
1. Check the detailed EMAIL_CONFIGURATION.md file
2. Review server logs for more detailed error messages
3. Contact your system administrator or email service provider