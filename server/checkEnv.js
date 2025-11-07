import dotenv from 'dotenv';

dotenv.config();

console.log('Email Environment Variables:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length || 0);
console.log('EMAIL_PASS format:', process.env.EMAIL_PASS ? 
  (process.env.EMAIL_PASS.includes(' ') ? 'Contains spaces' : 'No spaces') : 'Not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);