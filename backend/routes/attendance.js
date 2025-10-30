const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Helper function to sanitize query parameters
const sanitizeQuery = (query) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(query)) {
    // Only allow simple types, no objects or arrays that could contain operators
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Helper to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Apply auth middleware to all routes
router.use(auth);
router.use(checkPermission('attendance'));

// Mark attendance for a single student
router.post('/mark', async (req, res) => {
  try {
    const { studentId, date, status, subject, remarks } = req.body;

    // Validate required fields
    if (!studentId || !date || !status) {
      return res.status(400).json({ message: 'Student ID, date, and status are required' });
    }

    // Validate ObjectId format
    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    // Validate status enum
    const validStatuses = ['Present', 'Absent', 'Late', 'Excused'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get current academic year (e.g., "2024-2025")
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const academicYear = month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    // Check if attendance already exists for this student on this date
    let attendance = await Attendance.findOne({ 
      studentId, 
      date: new Date(date).setHours(0, 0, 0, 0) 
    });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.subject = subject;
      attendance.remarks = remarks;
      attendance.markedBy = req.admin._id;
      await attendance.save();
      
      return res.json({ 
        message: 'Attendance updated successfully',
        attendance 
      });
    }

    // Create new attendance record
    attendance = new Attendance({
      studentId,
      date: new Date(date).setHours(0, 0, 0, 0),
      status,
      course: student.course,
      year: student.year,
      semester: student.semester,
      subject,
      remarks,
      markedBy: req.admin._id,
      academicYear
    });

    await attendance.save();

    res.status(201).json({ 
      message: 'Attendance marked successfully',
      attendance 
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ 
      message: 'Error marking attendance',
      error: error.message 
    });
  }
});

// Mark attendance for multiple students (bulk)
router.post('/mark-bulk', async (req, res) => {
  try {
    const { attendanceRecords, date } = req.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ message: 'Attendance records array is required' });
    }

    const results = {
      success: [],
      failed: []
    };

    // Get current academic year
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const academicYear = month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    for (const record of attendanceRecords) {
      try {
        const { studentId, status, subject, remarks } = record;

        // Validate student ID
        if (!isValidObjectId(studentId)) {
          results.failed.push({ studentId, error: 'Invalid student ID format' });
          continue;
        }

        // Validate status
        const validStatuses = ['Present', 'Absent', 'Late', 'Excused'];
        if (!validStatuses.includes(status)) {
          results.failed.push({ studentId, error: 'Invalid status value' });
          continue;
        }

        const student = await Student.findById(studentId);
        if (!student) {
          results.failed.push({ studentId, error: 'Student not found' });
          continue;
        }

        const attendanceDate = new Date(String(date)).setHours(0, 0, 0, 0);

        // Check if attendance exists
        let attendance = await Attendance.findOne({ studentId, date: attendanceDate });

        if (attendance) {
          // Update existing
          attendance.status = String(status);
          attendance.subject = subject ? String(subject) : attendance.subject;
          attendance.remarks = remarks ? String(remarks) : attendance.remarks;
          attendance.markedBy = req.admin._id;
          await attendance.save();
        } else {
          // Create new
          attendance = new Attendance({
            studentId,
            date: attendanceDate,
            status: String(status),
            course: student.course,
            year: student.year,
            semester: student.semester,
            subject: subject ? String(subject) : undefined,
            remarks: remarks ? String(remarks) : undefined,
            markedBy: req.admin._id,
            academicYear
          });
          await attendance.save();
        }

        results.success.push({ studentId, attendanceId: attendance._id });
      } catch (error) {
        results.failed.push({ studentId: record.studentId, error: error.message });
      }
    }

    res.json({ 
      message: 'Bulk attendance marking completed',
      results 
    });
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    res.status(500).json({ 
      message: 'Error marking bulk attendance',
      error: error.message 
    });
  }
});

// Get attendance records with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      startDate,
      endDate,
      course,
      year,
      semester,
      status,
      studentId
    } = req.query;

    const query = {};

    // Validate and sanitize query parameters
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(String(startDate)).setHours(0, 0, 0, 0),
        $lte: new Date(String(endDate)).setHours(23, 59, 59, 999)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(String(startDate)).setHours(0, 0, 0, 0) };
    } else if (endDate) {
      query.date = { $lte: new Date(String(endDate)).setHours(23, 59, 59, 999) };
    }

    if (course) query.course = String(course);
    if (year && !isNaN(year)) query.year = parseInt(year);
    if (semester && !isNaN(semester)) query.semester = parseInt(semester);
    if (status) query.status = String(status);
    if (studentId && isValidObjectId(studentId)) query.studentId = studentId;

    const attendance = await Attendance.find(query)
      .populate('studentId', 'firstName lastName studentId email')
      .sort({ date: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      message: 'Error fetching attendance',
      error: error.message 
    });
  }
});

// Get attendance for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate ObjectId
    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    const query = { studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(String(startDate)).setHours(0, 0, 0, 0),
        $lte: new Date(String(endDate)).setHours(23, 59, 59, 999)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const absentDays = attendance.filter(a => a.status === 'Absent').length;
    const lateDays = attendance.filter(a => a.status === 'Late').length;
    const excusedDays = attendance.filter(a => a.status === 'Excused').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(2) : 0;

    res.json({
      attendance,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendancePercentage: parseFloat(attendancePercentage)
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ 
      message: 'Error fetching student attendance',
      error: error.message 
    });
  }
});

// Get attendance statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate, course, year, semester } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(String(startDate)).setHours(0, 0, 0, 0),
        $lte: new Date(String(endDate)).setHours(23, 59, 59, 999)
      };
    }

    if (course) query.course = String(course);
    if (year && !isNaN(year)) query.year = parseInt(year);
    if (semester && !isNaN(semester)) query.semester = parseInt(semester);

    const totalRecords = await Attendance.countDocuments(query);
    
    const statusCounts = await Attendance.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusStats = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Excused: 0
    };

    statusCounts.forEach(item => {
      statusStats[item._id] = item.count;
    });

    const attendancePercentage = totalRecords > 0 
      ? (((statusStats.Present + statusStats.Late) / totalRecords) * 100).toFixed(2) 
      : 0;

    // Get daily attendance trends
    const dailyTrends = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: 30 }
    ]);

    res.json({
      totalRecords,
      statusStats,
      attendancePercentage: parseFloat(attendancePercentage),
      dailyTrends
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ 
      message: 'Error fetching attendance stats',
      error: error.message 
    });
  }
});

// Get attendance report for a class/section
router.get('/report', async (req, res) => {
  try {
    const { date, course, year, semester } = req.query;

    if (!date || !course || !year || !semester) {
      return res.status(400).json({ 
        message: 'Date, course, year, and semester are required' 
      });
    }

    // Validate and sanitize inputs
    const sanitizedCourse = String(course);
    const sanitizedYear = parseInt(year);
    const sanitizedSemester = parseInt(semester);

    if (isNaN(sanitizedYear) || isNaN(sanitizedSemester)) {
      return res.status(400).json({ 
        message: 'Year and semester must be valid numbers' 
      });
    }

    // Get all students in the class
    const students = await Student.find({
      course: sanitizedCourse,
      year: sanitizedYear,
      semester: sanitizedSemester,
      status: 'Active'
    }).select('studentId firstName lastName email');

    const reportDate = new Date(String(date)).setHours(0, 0, 0, 0);

    // Get attendance records for the date
    const attendanceRecords = await Attendance.find({
      date: reportDate,
      course: sanitizedCourse,
      year: sanitizedYear,
      semester: sanitizedSemester
    });

    // Create a map for quick lookup
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.studentId.toString()] = record;
    });

    // Build report
    const report = students.map(student => ({
      student: {
        _id: student._id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      },
      attendance: attendanceMap[student._id.toString()] || null,
      status: attendanceMap[student._id.toString()]?.status || 'Not Marked'
    }));

    res.json({
      date: new Date(date),
      course,
      year: parseInt(year),
      semester: parseInt(semester),
      totalStudents: students.length,
      markedCount: attendanceRecords.length,
      report
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ 
      message: 'Error generating attendance report',
      error: error.message 
    });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ 
      message: 'Error deleting attendance',
      error: error.message 
    });
  }
});

module.exports = router;
