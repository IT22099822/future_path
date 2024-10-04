// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User is the model for students
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
