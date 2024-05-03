const mongoose = require('mongoose');

// Define schema for attendance data
const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    leaveCount: {
        type: Number,
        required: true,
        default: 0
    },
    overtimeCount: {
        type: Number,
        required: true,
        default: 0
    },
    absentCount: {
        type: Number,
        required: true,
        default: 0
    },
    pds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDS',
        required: true
    }
});

// Create model for attendance data
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
