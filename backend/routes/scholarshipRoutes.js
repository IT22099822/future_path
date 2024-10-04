const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authmiddleware');

// Routes for scholarship functionality
router.post('/scholarships', protect, scholarshipController.createScholarship);
router.get('/scholarships', scholarshipController.getAllScholarships);
router.get('/scholarships/:id', scholarshipController.getScholarshipById);
router.put('/scholarships/:id', protect, scholarshipController.updateScholarship);
router.delete('/scholarships/:id', protect, scholarshipController.deleteScholarship);

module.exports = router;
