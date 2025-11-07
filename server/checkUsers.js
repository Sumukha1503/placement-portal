import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await connectDB();
    
    const users = await User.find({}, 'name email role');
    
    console.log('Existing Users in Database:');
    console.log('============================');
    
    if (users.length === 0) {
      console.log('No users found in the database');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log('------------------------');
    });
    
    // Check for specific test users
    const testUsers = [
      'student@example.com',
      'tpo@example.com',
      'hod@example.com',
      'company@example.com'
    ];
    
    console.log('\nTest Users Status (@example.com):');
    console.log('=================================');
    
    for (const email of testUsers) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ ${email} - EXISTS`);
      } else {
        console.log(`❌ ${email} - NOT FOUND`);
      }
    }
    
    // Check for specific demo users
    const demoUsers = [
      'student@gmail.com',
      'tpo@gmail.com',
      'hod@gmail.com',
      'company@gmail.com'
    ];
    
    console.log('\nDemo Users Status (@gmail.com):');
    console.log('===============================');
    
    for (const email of demoUsers) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ ${email} - EXISTS`);
      } else {
        console.log(`❌ ${email} - NOT FOUND`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error.message);
    process.exit(1);
  }
};

checkUsers();