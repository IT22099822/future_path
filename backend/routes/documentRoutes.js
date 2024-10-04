const express = require('express');
const { uploadDocument, getDocumentsForAppointment, editDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authmiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer to store the file with its original name and extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Use the original file name and add a timestamp to make it unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get the file extension
    const name = file.originalname.split(ext)[0]; // Get the file name without the extension
    cb(null, name + '-' + uniqueSuffix + ext); // Save as 'originalName-uniqueSuffix.ext'
  }
});

// Initialize Multer with the updated storage configuration
const upload = multer({ storage: storage });

const router = express.Router();

// POST /api/documents/:appointmentId (upload documents for a specific approved appointment)
router.post('/:appointmentId', protect, upload.single('file'), uploadDocument);
router.get('/:appointmentId', protect, getDocumentsForAppointment); // Get documents for an appointment
router.put('/:id', protect, editDocument); // Edit a document
router.delete('/:id', protect, deleteDocument); // Delete a document

module.exports = router;
