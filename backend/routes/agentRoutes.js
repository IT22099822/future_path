const express = require('express');
const router = express.Router();
const {
  createOrUpdateAgentProfile,
  getLoggedInAgentProfile,
  getAgentProfile,
  deleteAgentProfile,
  getAllAgents,
} = require('../controllers/agentController'); 
const { protect } = require('../middleware/authmiddleware');
const multer = require('multer');

// Multer file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Create or update agent profile with file upload handling
router
  .route('/')
  .post(
    protect, 
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 10 }]), 
    createOrUpdateAgentProfile
  );

// Get logged-in agent profile
router.route('/me').get(protect, getLoggedInAgentProfile);

// Get agent profile by user ID
router.route('/:id').get(getAgentProfile);

// Delete agent profile
router.route('/').delete(protect, deleteAgentProfile);

// Get all agents for public view
router.route('/').get(getAllAgents);  // NEW ROUTE for all agents

module.exports = router;


