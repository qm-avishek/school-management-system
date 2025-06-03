const express = require('express');
const Student = require('../models/Student');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkPermission('students'));

// Get all students with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      course = '',
      year = '',
      status = 'Active'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (course) query.course = course;
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ 
      message: 'Error fetching students',
      error: error.message 
    });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ 
      message: 'Error fetching student',
      error: error.message 
    });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const studentData = req.body;
    
    // Check if student ID already exists
    const existingStudent = await Student.findOne({
      $or: [
        { studentId: studentData.studentId },
        { email: studentData.email }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student with this ID or email already exists' 
      });
    }

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ 
      message: 'Error creating student',
      error: error.message 
    });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ 
      message: 'Error updating student',
      error: error.message 
    });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ 
      message: 'Error deleting student',
      error: error.message 
    });
  }
});

// Get student statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    const totalGraduated = await Student.countDocuments({ status: 'Graduated' });
    
    const courseStats = await Student.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const yearStats = await Student.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalStudents,
      totalGraduated,
      courseStats,
      yearStats
    });
  } catch (error) {
    console.error('Student stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching student statistics',
      error: error.message 
    });
  }
});

module.exports = router;
