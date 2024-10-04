const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const {protect} = require('../middleware/authmiddleware');

// Route to create a new job (protected route, requires authentication)
router.post('/', protect, jobController.createJob);

// Route to get all jobs (public route)
router.get('/', jobController.getAllJobs);

// Route to get a specific job by ID (public route)
router.get('/:id', jobController.getJobById);

// Route to update a job by ID (protected route, requires authentication)
router.put('/:id', protect, jobController.updateJob);

// Route to delete a job by ID (protected route, requires authentication)
router.delete('/:id', protect, jobController.deleteJob);

// Route to get jobs added by the logged-in user (protected route, requires authentication)
router.get('/my-jobs', protect, jobController.getUserJobs);

module.exports = router;
