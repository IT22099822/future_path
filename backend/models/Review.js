// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',  // Reference to the User who is being reviewed
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',  // Reference to the User who wrote the review
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
