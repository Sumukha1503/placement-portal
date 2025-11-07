import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

console.log('Testing OpenAI API Key...\n');

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  console.log('❌ OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

console.log('OpenAI API Key found in environment variables');
console.log('Key length:', process.env.OPENAI_API_KEY.length);
console.log('Key format appears valid:', process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Yes' : 'No');
console.log('');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test the API key by listing models
try {
  console.log('Testing OpenAI API connection...');
  const models = await openai.models.list();
  console.log('✅ OpenAI API connection successful!');
  console.log(`Found ${models.data.length} models available`);
  
  // Show a few model names as examples
  console.log('\nSample models:');
  models.data.slice(0, 5).forEach(model => {
    console.log(`- ${model.id}`);
  });
  
  console.log('\n🎉 OpenAI is properly configured and working!');
} catch (error) {
  console.log('❌ OpenAI API test failed:', error.message);
  
  if (error.message.includes('401')) {
    console.log('\nThis usually means your API key is invalid or has expired.');
    console.log('Please check your OPENAI_API_KEY in the .env file.');
  } else if (error.message.includes('403')) {
    console.log('\nThis usually means your API key does not have permission to access this resource.');
  } else if (error.message.includes('429')) {
    console.log('\nThis usually means you have exceeded your API quota.');
  } else {
    console.log('\nPlease check your network connection and OpenAI API status.');
  }
}

console.log('\nTest completed!');