import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Example: Generate a professional placement email using OpenAI
export const generateEmailWithOpenAI = async (context) => {
  try {
    const prompt = `Generate a professional placement email with the following details:
    - Student Name: ${context.studentName}
    - Company: ${context.companyName}
    - Status: ${context.status}
    - Tone: ${context.tone || 'professional'}
    
    Provide both subject and body in JSON format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates professional placement emails in JSON format with 'subject' and 'body' fields."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    // Parse the response
    const content = response.choices[0].message.content;
    
    // Try to parse as JSON, fallback to template if parsing fails
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn('Failed to parse OpenAI response as JSON, using template');
      return {
        subject: `Update: ${context.companyName} - ${context.status}`,
        body: `Dear ${context.studentName},

This is to inform you about your application status for ${context.companyName}.

Status: ${context.status}

Best regards,
Placement Cell`
      };
    }
  } catch (error) {
    console.error('OpenAI Email Generation Error:', error.message);
    return {
      subject: `Update: ${context.companyName}`,
      body: `Dear ${context.studentName},

Your application status has been updated.

Best regards,
Placement Cell`
    };
  }
};

// Test the function
const testEmailGeneration = async () => {
  console.log('Testing OpenAI Email Generation...\n');
  
  const testContext = {
    studentName: "John Doe",
    companyName: "TechCorp",
    status: "Selected for Interview",
    tone: "professional"
  };
  
  const email = await generateEmailWithOpenAI(testContext);
  
  console.log('Generated Email:');
  console.log('Subject:', email.subject);
  console.log('Body:', email.body);
  console.log('\n✅ OpenAI email generation successful!');
};

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailGeneration().catch(console.error);
}

// Always run the test when the file is imported
testEmailGeneration().catch(console.error);