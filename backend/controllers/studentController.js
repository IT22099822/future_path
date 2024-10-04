const asyncHandler = require('express-async-handler');
const multer = require('multer');
const Student = require('../models/Student');

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// @desc Create or update student profile
// @route POST /api/students
// @access Private
const createOrUpdateStudentProfile = asyncHandler(async (req, res) => {
  const { name, bio, contactEmail, phone, major, birthDate } = req.body;

  // Handle image upload
  const profileImage = req.file ? req.file.path : undefined;

  // Find the student profile based on logged-in user's ID
  let studentProfile = await Student.findOne({ user: req.user._id });

  if (studentProfile) {
    // Update existing profile
    studentProfile.name = name || studentProfile.name;
    studentProfile.bio = bio || studentProfile.bio;
    studentProfile.contactEmail = contactEmail || studentProfile.contactEmail;
    studentProfile.phone = phone || studentProfile.phone;
    studentProfile.major = major || studentProfile.major;
    studentProfile.birthDate = birthDate || studentProfile.birthDate;
    if (profileImage) studentProfile.profileImage = profileImage;

    await studentProfile.save();
    res.status(200).json(studentProfile);
  } else {
    // Create a new student profile
    studentProfile = new Student({
      user: req.user._id,  // Set the user ID from the logged-in user
      name,
      bio,
      contactEmail,
      phone,
      major,
      birthDate,
      profileImage,
    });

    await studentProfile.save();
    res.status(201).json(studentProfile);
  }
});

// @desc Get logged-in student profile
// @route GET /api/students/me
// @access Private
const getLoggedInStudentProfile = asyncHandler(async (req, res) => {
  const studentProfile = await Student.findOne({ user: req.user._id });

  if (!studentProfile) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  res.status(200).json(studentProfile);
});

// @desc Get student profile by user ID (public)
// @route GET /api/students/:id
// @access Public
const getStudentProfile = asyncHandler(async (req, res) => {
  const studentProfile = await Student.findOne({ user: req.params.id });

  if (!studentProfile) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  res.status(200).json(studentProfile);
});

// @desc Delete student profile
// @route DELETE /api/students
// @access Private
const deleteStudentProfile = asyncHandler(async (req, res) => {
  const studentProfile = await Student.findOne({ user: req.user._id });

  if (!studentProfile) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  await Student.deleteOne({ user: req.user._id });
  res.status(200).json({ message: 'Student profile removed' });
});


// @desc Get all student profiles (public view)
// @route GET /api/students
// @access Public
const getAllStudents = asyncHandler(async (req, res) => {
  // Fetch students and populate the 'user' field to get user._id and possibly other details
  const students = await Student.find()
    .select('name bio profileImage') // Select fields to return
    .populate('user', '_id'); // Populate 'user' and only return '_id'

  if (!students || students.length === 0) {
    res.status(404);
    throw new Error('No student profiles found');
  }

  res.status(200).json(students);
});

module.exports = {
  createOrUpdateStudentProfile,
  getLoggedInStudentProfile,
  getStudentProfile,
  deleteStudentProfile,
  getAllStudents, 
  upload,  // Export upload function for handling profile image uploads
};
