const Attendance = require('../database/models/employee/Attendance');

// Middleware function to retrieve attendance data by PDS ID
const getAttendanceByPDSId = async (req, res, next) => {
    try {
        const pdsId = req.params.pdsId;
        const attendanceData = await Attendance.findOne({ pds: pdsId });
        if (!attendanceData) {
            return res.status(404).json({ message: 'Attendance data not found for the specified PDS ID' });
        }
        res.json(attendanceData);
    } catch (error) {
        next(error);
    }
};

// Middleware function to update attendance data by PDS ID
const updateAttendanceByPDSId = async (req, res, next) => {
    try {
        const pdsId = req.params.pdsId;
        const updatedData = req.body;
        const attendanceData = await Attendance.findOneAndUpdate({ pds: pdsId }, updatedData, { new: true });
        if (!attendanceData) {
            return res.status(404).json({ message: 'Attendance data not found for the specified PDS ID' });
        }
        res.json(attendanceData);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAttendanceByPDSId,
    updateAttendanceByPDSId
};