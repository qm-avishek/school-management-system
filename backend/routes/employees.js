const express = require('express');
const Employee = require('../models/Employee');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkPermission('employees'));

// Get all employees with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      employeeType = '',
      status = 'Active'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) query.department = department;
    if (employeeType) query.employeeType = employeeType;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ 
      message: 'Error fetching employees',
      error: error.message 
    });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ 
      message: 'Error fetching employee',
      error: error.message 
    });
  }
});

// Create new employee
router.post('/', async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { employeeId: employeeData.employeeId },
        { email: employeeData.email }
      ]
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Employee with this ID or email already exists' 
      });
    }

    const employee = new Employee(employeeData);
    await employee.save();

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ 
      message: 'Error creating employee',
      error: error.message 
    });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ 
      message: 'Error updating employee',
      error: error.message 
    });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      message: 'Error deleting employee',
      error: error.message 
    });
  }
});

// Get employee statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    
    const departmentStats = await Employee.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await Employee.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$employeeType', count: { $sum: 1 } } }
    ]);

    const salaryStats = await Employee.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$salary.netSalary' },
          avgSalary: { $avg: '$salary.netSalary' },
          minSalary: { $min: '$salary.netSalary' },
          maxSalary: { $max: '$salary.netSalary' }
        }
      }
    ]);

    res.json({
      totalEmployees,
      departmentStats,
      typeStats,
      salaryStats: salaryStats[0] || {}
    });
  } catch (error) {
    console.error('Employee stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching employee statistics',
      error: error.message 
    });
  }
});

module.exports = router;
