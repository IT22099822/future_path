const asyncHandler = require('express-async-handler');
const multer = require('multer');
const Agent = require('../models/Agent');

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

// @desc Create or update agent profile
// @route POST /api/agents
// @access Private
const createOrUpdateAgentProfile = asyncHandler(async (req, res) => {
  const { name, bio, contactEmail, phone, website } = req.body;

  // Handle image upload
  const profileImage = req.files?.profileImage ? req.files.profileImage[0].path : undefined;
  const additionalImages = req.files?.additionalImages ? req.files.additionalImages.map(file => file.path) : [];

  let agentProfile = await Agent.findOne({ user: req.user._id });

  if (agentProfile) {
    // Update profile
    agentProfile.name = name || agentProfile.name;
    agentProfile.bio = bio || agentProfile.bio;
    agentProfile.contactEmail = contactEmail || agentProfile.contactEmail;
    agentProfile.phone = phone || agentProfile.phone;
    agentProfile.website = website || agentProfile.website;

    if (profileImage) agentProfile.profileImage = profileImage;  // Update profile image
    if (additionalImages.length > 0) agentProfile.additionalImages.push(...additionalImages);  // Append additional images

    await agentProfile.save();
    return res.status(200).json(agentProfile);
  } else {
    // Create profile
    agentProfile = new Agent({
      user: req.user._id,
      name,
      bio,
      contactEmail,
      phone,
      website,
      profileImage,
      additionalImages
    });

    await agentProfile.save();
    return res.status(201).json(agentProfile);
  }
});

// @desc Get logged-in agent profile
// @route GET /api/agents/me
// @access Private
const getLoggedInAgentProfile = asyncHandler(async (req, res) => {
  const agentProfile = await Agent.findOne({ user: req.user._id });

  if (!agentProfile) {
    res.status(404);
    throw new Error('Agent profile not found');
  }

  res.status(200).json(agentProfile);
});

// @desc Get agent profile by user ID
// @route GET /api/agents/:id
// @access Public
const getAgentProfile = asyncHandler(async (req, res) => {
  const agentProfile = await Agent.findOne({ user: req.params.id });

  if (!agentProfile) {
    res.status(404);
    throw new Error('Agent profile not found');
  }

  res.status(200).json(agentProfile);
});

// @desc Delete agent profile
// @route DELETE /api/agents
// @access Private
const deleteAgentProfile = asyncHandler(async (req, res) => {
  const agentProfile = await Agent.findOne({ user: req.user._id });

  if (!agentProfile) {
    res.status(404);
    throw new Error('Agent profile not found');
  }

  await Agent.deleteOne({ _id: agentProfile._id });

  res.status(200).json({ message: 'Agent profile deleted successfully' });
});


// @desc Get all agent profiles (public view)
// @route GET /api/agents
// @access Public
const getAllAgents = asyncHandler(async (req, res) => {
  // Fetch agents and populate the 'user' field to get user._id and possibly other details
  const agents = await Agent.find()
    .select('name bio profileImage')
    .populate('user', '_id'); // Populate 'user' and only return '_id'

  if (!agents || agents.length === 0) {
    res.status(404);
    throw new Error('No agent profiles found');
  }

  res.status(200).json(agents);
});


module.exports = {
  upload,
  createOrUpdateAgentProfile,
  getLoggedInAgentProfile,
  getAgentProfile,
  deleteAgentProfile,
  getAllAgents,
};
