const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentDescription: {
    type: String,
    required: true,
  },
  bankInstitution: {
    type: String,
    required: true,
  },
  studentNotes: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  paymentSlip: {
    type: String, // Path to the uploaded payment slip
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
