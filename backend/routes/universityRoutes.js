const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const {protect} = require('../middleware/authmiddleware');

router.post('/universities', protect, universityController.createUniversity);
router.get('/universities', universityController.getAllUniversities);
router.get('/universities/:id', universityController.getUniversityById);
router.put('/universities/:id', protect, universityController.updateUniversity);
router.delete('/universities/:id', protect, universityController.deleteUniversity);

module.exports = router;
