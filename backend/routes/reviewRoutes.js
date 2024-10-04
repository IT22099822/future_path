const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsForAgent,
  updateReview,
  deleteReview,
  getStudentReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authmiddleware');

// Route to add a review
router.post('/', protect, addReview);

// Route to get all reviews for a specific agent
router.get('/agent/:agentId', getReviewsForAgent);

// Route to update and delete a review by ID
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

//fetch the student's own reviews
router.get('/my-reviews', protect, getStudentReviews); 

module.exports = router;
