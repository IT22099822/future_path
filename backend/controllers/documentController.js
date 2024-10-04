const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const Appointment = require('../models/Appointment');

// @desc Upload documents for an approved appointment
// @route POST /api/documents/:appointmentId
// @access Private (student)
const uploadDocument = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { appointmentId } = req.params;

  // Find the appointment and check if it belongs to the logged-in student and is approved
  const appointment = await Appointment.findOne({ _id: appointmentId, student: studentId, status: 'Approved' });

  if (!appointment) {
    res.status(400);
    throw new Error('Appointment not found or not approved.');
  }

  // Proceed to upload the document
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { description } = req.body;

  const document = new Document({
    appointment: appointmentId,
    student: studentId,
    description,
    filePath: req.file.path,
  });

  await document.save();
  res.status(201).json(document);
});

// @desc    Get documents for an appointment with optional search
// @route   GET /api/documents/:appointmentId?search=description
// @access  Private (agent)
const getDocumentsForAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { search } = req.query; // Get search term from query parameters

  // Construct search criteria
  const searchCriteria = {
    appointment: appointmentId,
  };

  // If a search term is provided, add to the criteria
  if (search) {
    searchCriteria.description = new RegExp(search, 'i'); // Case-insensitive search
  }

  const documents = await Document.find(searchCriteria)
    .populate('student', 'name');

  res.status(200).json(documents);
});

// @desc    Edit a document
// @route   PUT /api/documents/:id
// @access  Private (student)
const editDocument = asyncHandler(async (req, res) => {
  const { description } = req.body;

  const document = await Document.findById(req.params.id);

  if (!document || document.student.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Document not found or not authorized');
  }

  document.description = description || document.description;

  await document.save();
  res.status(200).json(document);
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private (student only)
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  // Check if the logged-in user is the one who uploaded the document
  if (document.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this document');
  }

  // Normalize file path for cross-platform compatibility
  const filePath = path.join(__dirname, '..', document.filePath.replace(/\\/g, '/'));

  // Check if the file exists before attempting to delete it
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath); // Delete the file from the uploads folder
      console.log(`File ${document.filePath} deleted successfully.`);
    } catch (error) {
      res.status(500);
      throw new Error('Error occurred while deleting the file');
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }

  // Delete the document from the database using `deleteOne`
  await document.deleteOne(); // Replaced `remove` with `deleteOne`

  res.status(200).json({ message: 'Document deleted successfully' });
});

module.exports = {
  uploadDocument,
  getDocumentsForAppointment,
  editDocument,
  deleteDocument,
};
