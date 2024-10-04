const Payment = require('../models/Payment');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Payment creation endpoint
exports.createPayment = async (req, res) => {
  const { paymentAmount, paymentDate, paymentDescription, bankInstitution, studentNotes } = req.body;
  const { agentId } = req.params;

  try {
    const payment = new Payment({
      student: req.user._id,
      agent: agentId,
      paymentAmount,
      paymentDate,
      paymentDescription,
      bankInstitution,
      studentNotes,
      paymentSlip: req.file ? req.file.path : null, // Save the file path
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

// Agent views all payments made to them with optional search
exports.getPaymentsForAgent = async (req, res) => {
  const { search } = req.query; // Get search term from query parameters
  const searchCriteria = { agent: req.user._id };

  // If a search term is provided, add to the criteria
  if (search) {
    const regex = new RegExp(search, 'i'); // Case-insensitive search
    searchCriteria.$or = [
      { paymentDescription: regex },
      { bankInstitution: regex },
      { studentNotes: regex },
    ];
  }

  try {
    const payments = await Payment.find(searchCriteria).populate('student');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Student views all their payments
exports.getPaymentsForStudent = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id }).populate('agent');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Agent approves or rejects a payment
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    // Find the payment by ID and update the paymentStatus only
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },  // Only update the paymentStatus
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
};

// Student deletes a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};
