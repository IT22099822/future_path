// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true } // 'student' or 'agent'
});

module.exports = mongoose.model('User', UserSchema);
