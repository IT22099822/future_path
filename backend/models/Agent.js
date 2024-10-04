const mongoose = require('mongoose');

const agentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: 'No bio available',
      maxlength: 500,
    },
    contactEmail: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
      default: 'Not provided',
    },
    profileImage: {
      type: String, // URL to the profile image
      default: 'default-profile.jpg',  // Optional default image
    },
    additionalImages: [
      {
        type: String, // Array of image URLs
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Agent', agentSchema);
