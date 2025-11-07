import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  batch: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  backlogs: {
    type: Number,
    default: 0,
    min: 0
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  resumeUrl: {
    type: String,
    default: null
  },
  resumeParsedData: {
    skills: [String],
    experience: [{
      company: String,
      role: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      cgpa: Number
    }],
    certifications: [String],
    atsScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  placementStatus: {
    type: String,
    enum: ['unplaced', 'placed', 'opted-out'],
    default: 'unplaced'
  }
}, {
  timestamps: true
});

// Calculate profile completeness
studentProfileSchema.methods.calculateCompleteness = function() {
  let score = 0;
  if (this.rollNumber) score += 10;
  if (this.batch) score += 10;
  if (this.cgpa) score += 10;
  if (this.phone) score += 10;
  if (this.resumeUrl) score += 30;
  if (this.resumeParsedData.skills?.length > 0) score += 15;
  if (this.resumeParsedData.experience?.length > 0) score += 15;
  
  this.profileCompleteness = score;
  return score;
};

export default mongoose.model('StudentProfile', studentProfileSchema);
