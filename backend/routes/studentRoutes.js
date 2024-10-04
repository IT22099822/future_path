const express = require('express');
const router = express.Router();
const {
  createOrUpdateStudentProfile,
  getLoggedInStudentProfile,
  getStudentProfile,
  deleteStudentProfile,
  getAllStudents, 
  upload, // Import the multer upload configuration
} = require('../controllers/studentController');
const { protect } = require('../middleware/authmiddleware');

// Create or update student profile with file upload handling
router
  .route('/')
  .post(protect, upload.single('profileImage'), createOrUpdateStudentProfile);

// Get logged-in student profile
router.route('/me').get(protect, getLoggedInStudentProfile);

// Get student profile by user ID
router.route('/:id').get(getStudentProfile);

// Delete student profile
router.route('/').delete(protect, deleteStudentProfile);

// Get all public student profiles
router.route('/').get(getAllStudents); 

module.exports = router;
