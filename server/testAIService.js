import dotenv from 'dotenv';
import { generateEmailWithAI, analyzeJobFit } from './services/aiService.js';

dotenv.config();

console.log('Testing AI Service with OpenAI...\n');

// Test email generation
console.log('1. Testing Email Generation...');
try {
  const emailContext = {
    studentName: "John Doe",
    companyName: "TechCorp",
    status: "Selected for Interview",
    tone: "professional"
  };
  
  const email = await generateEmailWithAI(emailContext);
  console.log('✅ Email generation successful!');
  console.log('Subject:', email.subject);
  console.log('Body:', email.body.substring(0, 100) + '...\n');
} catch (error) {
  console.log('❌ Email generation failed:', error.message, '\n');
}

// Test job fit analysis
console.log('2. Testing Job Fit Analysis...');
try {
  const resumeSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'];
  const jobDescription = 'We are looking for a Full Stack Developer with experience in JavaScript, React, Node.js, and MongoDB. The candidate should also have knowledge of cloud platforms like AWS.';
  
  const analysis = await analyzeJobFit(resumeSkills, jobDescription);
  console.log('✅ Job fit analysis successful!');
  console.log('Match Percentage:', analysis.matchPercentage + '%');
  console.log('Matching Skills:', analysis.matchingSkills.join(', '));
  console.log('Gaps:', analysis.gaps.join(', '));
  console.log('Recommendations:', analysis.recommendations, '\n');
} catch (error) {
  console.log('❌ Job fit analysis failed:', error.message, '\n');
}

console.log('AI Service Testing Complete!');