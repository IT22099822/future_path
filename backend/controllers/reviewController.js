const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc Add a review
// @route POST /api/reviews
// @access Private
const addReview = asyncHandler(async (req, res) => {
  const { agent, rating, reviewText } = req.body;

  if (!agent || !rating || !reviewText) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const review = new Review({
    agent,
    reviewer: req.user._id, // Assuming `req.user` contains the authenticated user's info
    rating,
    reviewText,
  });

  await review.save();
  res.status(201).json(review);
});

// @desc Get reviews for an agent
// @route GET /api/reviews/agent/:agentId
// @access Public
const getReviewsForAgent = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ agent: req.params.agentId })
    .populate('reviewer', 'name') // Populate reviewer with only the name field
    .exec();

  if (!reviews || reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found for this agent' });
  }

  res.status(200).json(reviews);
});

// @desc Get all reviews for a student
// @route GET /api/reviews/my-reviews
// @access Private
const getStudentReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewer: req.user._id });

  if (!reviews || reviews.length === 0) {
    res.status(404);
    throw new Error('No reviews found');
  }

  res.status(200).json(reviews);
});

// @desc Update a review
// @route PUT /api/reviews/:id
// @access Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.reviewer.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  review.rating = rating || review.rating;
  review.reviewText = reviewText || review.reviewText;

  await review.save();
  res.status(200).json(review);
});

// @desc Delete a review
// @route DELETE /api/reviews/:id
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.reviewer.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  await review.remove();
  res.status(204).send();
});

// @desc Search reviews by keyword
// @route GET /api/reviews/search
// @access Private
const searchReviews = asyncHandler(async (req, res) => {
  const { query } = req.query; // Get the query parameter from the request
  const regex = new RegExp(query, 'i'); // Create a case-insensitive regex for searching

  const reviews = await Review.find({
    $or: [
      { reviewText: { $regex: regex } },
      { rating: { $regex: regex } }
    ]
  });

  if (!reviews || reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found matching the search criteria' });
  }

  res.status(200).json(reviews);
});

module.exports = {
  addReview,
  getReviewsForAgent,
  getStudentReviews,
  updateReview,
  deleteReview,
  searchReviews,
};
