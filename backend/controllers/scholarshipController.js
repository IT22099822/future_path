const Scholarship = require('../models/Scholarship');
const User = require('../models/User');

// Create a new scholarship
exports.createScholarship = async (req, res) => {
    const { scholarshipTitle, organization, applicationDeadline, eligibilityCriteria, applicationLink, description, scholarshipType, fieldOfStudy, country, applicationRequirements } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user` contains the logged-in user's info

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const scholarship = new Scholarship({
            scholarshipTitle,
            organization,
            applicationDeadline,
            eligibilityCriteria,
            applicationLink,
            description,
            scholarshipType,
            fieldOfStudy,
            country,
            applicationRequirements,
            addedBy: userId // Adding the user who added the scholarship
        });

        await scholarship.save();
        res.status(201).json({ message: 'Scholarship added successfully', scholarship });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all scholarships with search functionality
exports.getAllScholarships = async (req, res) => {
    const { search } = req.query; // Get search query from request
    try {
        const query = search 
            ? { $or: [{ scholarshipTitle: { $regex: search, $options: 'i' } }, { organization: { $regex: search, $options: 'i' } }] }
            : {};
        const scholarships = await Scholarship.find(query).populate('addedBy', 'name'); // Populating addedBy with the user’s name
        res.status(200).json(scholarships);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a scholarship by ID
exports.getScholarshipById = async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id).populate('addedBy', 'name'); // Populating addedBy field
        if (!scholarship) {
            return res.status(404).json({ error: 'Scholarship not found' });
        }
        res.status(200).json(scholarship);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a scholarship
exports.updateScholarship = async (req, res) => {
    const { scholarshipTitle, organization, applicationDeadline, eligibilityCriteria, applicationLink, description, scholarshipType, fieldOfStudy, country, applicationRequirements } = req.body;

    try {
        const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, {
            scholarshipTitle,
            organization,
            applicationDeadline,
            eligibilityCriteria,
            applicationLink,
            description,
            scholarshipType,
            fieldOfStudy,
            country,
            applicationRequirements
        }, { new: true });

        if (!scholarship) {
            return res.status(404).json({ error: 'Scholarship not found' });
        }

        res.status(200).json({ message: 'Scholarship updated successfully', scholarship });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a scholarship
exports.deleteScholarship = async (req, res) => {
    try {
        const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
        if (!scholarship) {
            return res.status(404).json({ error: 'Scholarship not found' });
        }
        res.status(200).json({ message: 'Scholarship deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
