// backend/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateTime: { type: Date, required: true },
  topic: { type: String, enum: ['Job', 'University Admission', 'Scholarship Opportunity', 'Other'], required: true },
  details: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  message: { type: String }, // Message from agent (like meeting link)
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
