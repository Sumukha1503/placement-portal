import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true
  },
  sentAt: {
    type: Date
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('EmailLog', emailLogSchema);