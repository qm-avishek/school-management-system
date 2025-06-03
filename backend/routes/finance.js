const express = require('express');
const Transaction = require('../models/Transaction');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkPermission('finance'));

// Get all transactions with pagination and filters
router.get('/transactions', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type = '',
      category = '',
      startDate = '',
      endDate = '',
      status = '',
      academicYear = ''
    } = req.query;

    const query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(query)
      .populate('approvedBy', 'fullName username')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      message: 'Error fetching transactions',
      error: error.message 
    });
  }
});

// Get transaction by ID
router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('approvedBy', 'fullName username');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ 
      message: 'Error fetching transaction',
      error: error.message 
    });
  }
});

// Create new transaction
router.post('/transactions', async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      approvedBy: req.admin._id
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    await transaction.populate('approvedBy', 'fullName username');

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ 
      message: 'Error creating transaction',
      error: error.message 
    });
  }
});

// Update transaction
router.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'fullName username');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ 
      message: 'Error updating transaction',
      error: error.message 
    });
  }
});

// Delete transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ 
      message: 'Error deleting transaction',
      error: error.message 
    });
  }
});

// Get financial reports and statistics
router.get('/reports/overview', async (req, res) => {
  try {
    const { academicYear = new Date().getFullYear().toString() } = req.query;

    // Total income and expenses
    const incomeTotal = await Transaction.aggregate([
      { 
        $match: { 
          type: 'Income', 
          status: 'Completed',
          academicYear 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseTotal = await Transaction.aggregate([
      { 
        $match: { 
          type: 'Expense', 
          status: 'Completed',
          academicYear 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Category-wise breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { 
        $match: { 
          status: 'Completed',
          academicYear 
        } 
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly trends
    const monthlyTrends = await Transaction.aggregate([
      { 
        $match: { 
          status: 'Completed',
          academicYear 
        } 
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Pending transactions
    const pendingTransactions = await Transaction.countDocuments({
      status: 'Pending',
      academicYear
    });

    const totalIncome = incomeTotal[0]?.total || 0;
    const totalExpense = expenseTotal[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        pendingTransactions
      },
      categoryBreakdown,
      monthlyTrends,
      academicYear
    });
  } catch (error) {
    console.error('Financial reports error:', error);
    res.status(500).json({ 
      message: 'Error generating financial reports',
      error: error.message 
    });
  }
});

// Approve/Reject transaction
router.patch('/transactions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        approvedBy: req.admin._id 
      },
      { new: true }
    ).populate('approvedBy', 'fullName username');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      message: `Transaction ${status.toLowerCase()} successfully`,
      transaction
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ 
      message: 'Error updating transaction status',
      error: error.message 
    });
  }
});

module.exports = router;
