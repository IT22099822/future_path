// backend/routes/appointmentRoutes.js
const express = require('express');
const { createAppointment, getAgentAppointments, updateAppointmentStatus, getUserAppointments, deleteAppointment, getApprovedAppointments} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/', protect, createAppointment); // Create appointment
router.get('/agent/:agentId', protect, getAgentAppointments); // View agent appointments
router.put('/:appointmentId', protect, updateAppointmentStatus); // Approve/reject appointment
router.get('/my', protect, getUserAppointments);//viewing user's appointments (either student or agent)
router.delete('/:appointmentId', protect, deleteAppointment); // Delete appointment
router.get('/my/approved', protect, getApprovedAppointments); // View approved appointments



module.exports = router;
