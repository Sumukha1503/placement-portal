# Placement Portal Server

This is the backend server for the Placement Portal application built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   For email configuration, see [SETUP_EMAIL.md](SETUP_EMAIL.md) for detailed instructions.

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon for development
- `npm run test-email-config` - Test email configuration
- `npm run send-test-email` - Send a test email
- `npm run create-test-users` - Create test users
- `npm run reset-test-passwords` - Reset test user passwords

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- dotenv: Environment variables
- nodemailer: Email sending
- cors: Cross-origin resource sharing
- multer: File uploads
- cloudinary: Cloud image storage
- pdfkit: PDF generation
- exceljs: Excel file generation

## Environment Variables

See [.env](.env) for all configuration options.

For email configuration, refer to:
- [SETUP_EMAIL.md](SETUP_EMAIL.md) - Quick setup guide
- [EMAIL_CONFIGURATION.md](EMAIL_CONFIGURATION.md) - Detailed configuration guide