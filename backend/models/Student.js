const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',  // Reference to the User who owns this student profile
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    phone: {
      type: String,
    },
    major: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    profileImage: {
      type: String, // URL to the profile image
      default: 'default-profile.jpg', // Default image
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
