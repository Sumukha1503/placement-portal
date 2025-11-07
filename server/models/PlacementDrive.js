import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  companyLogo: {
    type: String,
    default: null
  },
  role: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  package: {
    ctc: {
      type: Number,
      required: true
    },
    fixed: Number,
    variable: Number,
    joiningBonus: Number
  },
  eligibility: {
    minCGPA: {
      type: Number,
      default: 0
    },
    allowedBranches: [String],
    maxBacklogs: {
      type: Number,
      default: 0
    },
    allowedBatches: [Number]
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  rounds: [{
    roundNumber: Number,
    roundName: String,
    date: Date,
    venue: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'completed'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
placementDriveSchema.index({ status: 1, applicationDeadline: 1 });

export default mongoose.model('PlacementDrive', placementDriveSchema);
