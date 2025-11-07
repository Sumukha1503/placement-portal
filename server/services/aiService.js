import dotenv from 'dotenv';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Parse resume using AI
export const parseResumeWithAI = async (pdfBuffer) => {
  try {
    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;

    // Use OpenAI to extract structured data
    const prompt = `Extract the following information from this resume text:
    1. Skills (as a comma-separated list)
    2. Email address
    3. Phone number
    4. Experience details (company, role, duration)
    5. Education details (degree, institution, year)
    6. Certifications
    
    Resume text:
    ${resumeText}
    
    Provide the response in JSON format with keys: skills, email, phone, experience, education, certifications`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts structured data from resumes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    // Parse the response
    const content = response.choices[0].message.content;
    let parsedData;
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw parseError;
    }
    
    // Calculate ATS score
    const atsScore = calculateATSScore(resumeText, parsedData);

    return {
      ...parsedData,
      atsScore
    };
  } catch (error) {
    console.error('AI Resume Parsing Error:', error.message);
    // Fallback to regex-based parsing
    return fallbackResumeParsing(pdfBuffer);
  }
};

// Extract skills using keywords (fallback method)
const extractSkills = (text) => {
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB',
    'Express', 'SQL', 'HTML', 'CSS', 'Git', 'Docker', 'AWS', 'Machine Learning',
    'Data Structures', 'Algorithms', 'REST API', 'GraphQL', 'TypeScript'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills;
};

// Extract experience (fallback method)
const extractExperience = (text) => {
  const experiences = [];
  const experienceSection = text.match(/experience[\s\S]*?(?=education|skills|projects|$)/i);
  
  if (experienceSection) {
    // Simple extraction - can be enhanced with NLP
    const lines = experienceSection[0].split('\n').filter(line => line.trim());
    experiences.push({
      company: 'Extracted from resume',
      role: 'Requires manual verification',
      duration: 'N/A',
      description: lines.join(' ')
    });
  }
  
  return experiences;
};

// Extract education (fallback method)
const extractEducation = (text) => {
  const education = [];
  const degreeKeywords = ['B.Tech', 'B.E', 'M.Tech', 'MBA', 'BCA', 'MCA', 'BSc', 'MSc'];
  
  degreeKeywords.forEach(degree => {
    if (text.includes(degree)) {
      education.push({
        degree,
        institution: 'Requires verification',
        year: 'N/A',
        cgpa: null
      });
    }
  });
  
  return education;
};

// Extract certifications (fallback method)
const extractCertifications = (text) => {
  const certifications = [];
  const certSection = text.match(/certifications?[\s\S]*?(?=experience|education|skills|$)/i);
  
  if (certSection) {
    const lines = certSection[0].split('\n').filter(line => line.trim() && line.length > 5);
    certifications.push(...lines.slice(1, 6)); // Get up to 5 certifications
  }
  
  return certifications;
};

// Calculate ATS score
const calculateATSScore = (text, parsedData) => {
  let score = 0;
  
  // Check for contact info (20 points)
  if (parsedData.email) score += 10;
  if (parsedData.phone) score += 10;
  
  // Check for skills (30 points)
  if (parsedData.skills && parsedData.skills.length >= 5) score += 30;
  else if (parsedData.skills && parsedData.skills.length >= 3) score += 20;
  else if (parsedData.skills && parsedData.skills.length > 0) score += 10;
  
  // Check for experience (25 points)
  if (parsedData.experience && parsedData.experience.length > 0) score += 25;
  
  // Check for education (15 points)
  if (parsedData.education && parsedData.education.length > 0) score += 15;
  
  // Check for standard sections (10 points)
  const hasStandardSections = /experience|education|skills|projects/gi.test(text);
  if (hasStandardSections) score += 10;
  
  return Math.min(score, 100);
};

// Fallback parsing without AI
const fallbackResumeParsing = async (pdfBuffer) => {
  const pdfData = await pdf(pdfBuffer);
  const text = pdfData.text;
  
  return {
    skills: extractSkills(text),
    email: text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '',
    phone: text.match(/\b\d{10}\b/)?.[0] || '',
    experience: extractExperience(text),
    education: extractEducation(text),
    certifications: extractCertifications(text),
    atsScore: 50 // Default score for fallback
  };
};

// Generate email using AI
export const generateEmailWithAI = async (context) => {
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
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return JSON.parse(content);
      }
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
    console.error('AI Email Generation Error:', error.message);
    return {
      subject: `Update: ${context.companyName}`,
      body: `Dear ${context.studentName},

Your application status has been updated.

Best regards,
Placement Cell`
    };
  }
};

// Job-fit analysis
export const analyzeJobFit = async (resumeSkills, jobDescription) => {
  try {
    const prompt = `Analyze the job fit between the following resume skills and job description:
    
    Resume Skills: ${resumeSkills.join(', ')}
    
    Job Description: ${jobDescription}
    
    Provide a match percentage, list of matching skills, list of skill gaps, and recommendations in JSON format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes job fit. Always respond with valid JSON containing matchPercentage, matchingSkills, gaps, and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    // Parse the response
    const content = response.choices[0].message.content;
    
    // Try to parse as JSON
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return JSON.parse(content);
      }
    } catch (parseError) {
      console.warn('Failed to parse OpenAI response as JSON, calculating manually');
      // Fallback to manual calculation
      const jdSkills = extractSkills(jobDescription);
      const matchingSkills = resumeSkills.filter(skill => 
        jdSkills.some(jdSkill => jdSkill.toLowerCase() === skill.toLowerCase())
      );
      
      const matchPercentage = jdSkills.length > 0 
        ? Math.round((matchingSkills.length / jdSkills.length) * 100)
        : 0;
      
      const gaps = jdSkills.filter(skill => 
        !resumeSkills.some(rSkill => rSkill.toLowerCase() === skill.toLowerCase())
      );
      
      return {
        matchPercentage,
        matchingSkills,
        gaps,
        recommendations: gaps.length > 0 
          ? `Consider learning: ${gaps.join(', ')}`
          : 'Your skills match well with the job requirements!'
      };
    }
  } catch (error) {
    console.error('Job Fit Analysis Error:', error.message);
    // Fallback to manual calculation
    const jdSkills = extractSkills(jobDescription);
    const matchingSkills = resumeSkills.filter(skill => 
      jdSkills.some(jdSkill => jdSkill.toLowerCase() === skill.toLowerCase())
    );
    
    const matchPercentage = jdSkills.length > 0 
      ? Math.round((matchingSkills.length / jdSkills.length) * 100)
      : 0;
    
    const gaps = jdSkills.filter(skill => 
      !resumeSkills.some(rSkill => rSkill.toLowerCase() === skill.toLowerCase())
    );
    
    return {
      matchPercentage,
      matchingSkills,
      gaps,
      recommendations: gaps.length > 0 
        ? `Consider learning: ${gaps.join(', ')}`
        : 'Your skills match well with the job requirements!'
    };
  }
};