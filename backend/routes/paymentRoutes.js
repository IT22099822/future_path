const express = require('express');
const { protect } = require('../middleware/authmiddleware');
const {
  createPayment,
  getPaymentsForAgent,
  getPaymentsForStudent,
  updatePaymentStatus,
  deletePayment,
} = require('../controllers/paymentController');
const multer = require('multer');
const path = require('path');

// Create a storage engine with original file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Retain the original filename
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage });

const router = express.Router();

// POST /api/payments/:agentId (Student creates a payment for a specific agent)
router.post('/:agentId', protect, upload.single('paymentSlip'), createPayment);

// GET /api/payments/agent (Agent can view all payments made to them)
router.get('/agent', protect, getPaymentsForAgent);

// GET /api/payments/student (Student can view all their payment transactions)
router.get('/student', protect, getPaymentsForStudent);

// PUT /api/payments/:id (Agent can approve or reject the payment)
router.put('/:id', protect, updatePaymentStatus);

// DELETE /api/payments/:id (Student can delete their payment)
router.delete('/:id', protect, deletePayment);

module.exports = router;
