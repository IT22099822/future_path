const Appointment = require('../models/Appointment');
const asyncHandler = require('express-async-handler');

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private (student or agent)
const createAppointment = asyncHandler(async (req, res) => {
    const student = req.user._id; // Assuming the user is logged in as a student
    const { agent, dateTime, topic, details } = req.body;

    console.log('Received appointment data:', req.body);
    console.log('Authenticated user:', req.user);

    if (!student || !agent || !dateTime || !topic || !details) {
        console.log('Missing fields:', { student, agent, dateTime, topic, details });
        res.status(400);
        throw new Error('All fields are required');
    }

    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

    const conflictingAppointment = await Appointment.findOne({
        agent,
        $or: [
            {
                dateTime: { $gte: startTime, $lt: endTime } // Another appointment starts within this time window
            },
            {
                dateTime: { $lt: startTime, $gt: new Date(startTime.getTime() - 60 * 60 * 1000) } // An ongoing appointment overlaps with this one
            }
        ]
    });

    if (conflictingAppointment) {
        res.status(400);
        throw new Error('There is already an appointment booked during this time window');
    }

    const appointment = await Appointment.create({
        student,
        agent,
        dateTime,
        topic,
        details,
    });

    res.status(201).json(appointment);
});

// @desc    Fetch appointments for an agent
// @route   GET /api/appointments/agent/:agentId
// @access  Private (agent)
const getAgentAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ agent: req.params.agentId, status: 'Pending' })
        .populate('student', 'name')
        .sort({ dateTime: 1 });

    res.status(200).json(appointments);
});

// @desc    Approve or reject an appointment
// @route   PUT /api/appointments/:appointmentId
// @access  Private (agent)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status, message } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    appointment.status = status;
    if (message) appointment.message = message;

    await appointment.save();
    res.status(200).json(appointment);
});

// @desc    Get appointments for the logged-in user (student or agent)
// @route   GET /api/appointments/my?search=keyword
// @access  Private (student or agent)
const getUserAppointments = asyncHandler(async (req, res) => {
    const user = req.user;
    const search = req.query.search || ''; // Get search keyword from query params

    let appointments;

    if (user.userType === 'student') {
        appointments = await Appointment.find({
            student: user._id,
            $or: [
                { topic: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ]
        })
            .populate('agent', 'name')
            .sort({ dateTime: 1 });
    } else if (user.userType === 'agent') {
        appointments = await Appointment.find({
            agent: user._id,
            $or: [
                { topic: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ]
        })
            .populate('student', 'name')
            .sort({ dateTime: 1 });
    } else {
        res.status(400);
        throw new Error('Invalid user type');
    }

    res.status(200).json(appointments);
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:appointmentId
// @access  Private (student)
const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    if (appointment.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this appointment');
    }

    if (appointment.status === 'Approved') {
        res.status(400);
        throw new Error('Approved appointments cannot be deleted');
    }

    await Appointment.deleteOne({ _id: req.params.appointmentId });

    res.status(204).send(); // No content to send back
});

// @desc    Get approved appointments for the logged-in user (student or agent)
// @route   GET /api/appointments/my/approved
// @access  Private (student or agent)
const getApprovedAppointments = asyncHandler(async (req, res) => {
    const user = req.user;

    let appointments;

    if (user.userType === 'student') {
        appointments = await Appointment.find({ student: user._id, status: 'Approved' })
            .populate('agent', 'name')
            .sort({ dateTime: 1 });
    } else if (user.userType === 'agent') {
        appointments = await Appointment.find({ agent: user._id, status: 'Approved' })
            .populate('student', 'name')
            .sort({ dateTime: 1 });
    } else {
        res.status(400);
        throw new Error('Invalid user type');
    }

    res.status(200).json(appointments);
});

module.exports = {
    createAppointment,
    getAgentAppointments,
    updateAppointmentStatus,
    getUserAppointments,
    deleteAppointment,
    getApprovedAppointments,
};
