import crypto from 'crypto';

// Generate random token
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calculate eligibility
export const checkEligibility = (student, drive) => {
  const eligibility = drive.eligibility;
  
  if (student.cgpa < eligibility.minCGPA) {
    return { eligible: false, reason: 'CGPA below minimum requirement' };
  }
  
  if (student.backlogs > eligibility.maxBacklogs) {
    return { eligible: false, reason: 'Too many backlogs' };
  }
  
  if (eligibility.allowedBranches.length > 0 && 
      !eligibility.allowedBranches.includes(student.userId.department)) {
    return { eligible: false, reason: 'Branch not allowed' };
  }
  
  if (eligibility.allowedBatches.length > 0 && 
      !eligibility.allowedBatches.includes(student.batch)) {
    return { eligible: false, reason: 'Batch not allowed' };
  }
  
  return { eligible: true };
};

// Format package details
export const formatPackage = (packageData) => {
  return `₹${(packageData.ctc / 100000).toFixed(2)} LPA`;
};
