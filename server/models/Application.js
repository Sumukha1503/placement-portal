import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
    required: true
  },
  status: {
    type: String,
    enum: [
      'applied',
      'hod-pending',
      'hod-approved',
      'hod-rejected',
      'shortlisted',
      'round1',
      'round2',
      'round3',
      'selected',
      'rejected'
    ],
    default: 'hod-pending'
  },
  currentRound: {
    type: Number,
    default: 0
  },
  roundResults: [{
    round: Number,
    status: String,
    feedback: String,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  offerLetterUrl: {
    type: String,
    default: null
  },
  offerStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
