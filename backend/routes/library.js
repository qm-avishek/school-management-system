const express = require('express');
const { Book, BorrowRecord } = require('../models/Library');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(checkPermission('library'));

// BOOKS ROUTES

// Get all books with pagination and filters
router.get('/books', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = ''
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
        { publisher: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (status) query.status = status;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ 
      message: 'Error fetching books',
      error: error.message 
    });
  }
});

// Get book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ 
      message: 'Error fetching book',
      error: error.message 
    });
  }
});

// Create new book
router.post('/books', async (req, res) => {
  try {
    const bookData = req.body;
    
    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      return res.status(400).json({ 
        message: 'Book with this ISBN already exists' 
      });
    }

    // Set available copies equal to total copies for new book
    bookData.availableCopies = bookData.totalCopies;

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ 
      message: 'Error adding book',
      error: error.message 
    });
  }
});

// Update book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ 
      message: 'Error updating book',
      error: error.message 
    });
  }
});

// Delete book
router.delete('/books/:id', async (req, res) => {
  try {
    // Check if book has active borrows
    const activeBorrows = await BorrowRecord.countDocuments({
      bookId: req.params.id,
      status: 'Borrowed'
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete book with active borrows' 
      });
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ 
      message: 'Error deleting book',
      error: error.message 
    });
  }
});

// BORROW RECORDS ROUTES

// Get all borrow records with pagination and filters
router.get('/borrows', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      borrowerId = '',
      borrowerType = ''
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (borrowerId) query.borrowerId = borrowerId;
    if (borrowerType) query.borrowerType = borrowerType;

    const borrows = await BorrowRecord.find(query)
      .populate('bookId', 'title author isbn')
      .populate('issuedBy', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BorrowRecord.countDocuments(query);

    res.json({
      borrows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get borrow records error:', error);
    res.status(500).json({ 
      message: 'Error fetching borrow records',
      error: error.message 
    });
  }
});

// Issue book (create borrow record)
router.post('/borrows', async (req, res) => {
  try {
    const { bookId, borrowerId, borrowerType, dueDate } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check if borrower already has this book
    const existingBorrow = await BorrowRecord.findOne({
      bookId,
      borrowerId,
      status: 'Borrowed'
    });

    if (existingBorrow) {
      return res.status(400).json({ 
        message: 'Borrower already has this book' 
      });
    }

    const borrowRecord = new BorrowRecord({
      bookId,
      borrowerId,
      borrowerType,
      dueDate: new Date(dueDate),
      issuedBy: req.admin._id
    });

    await borrowRecord.save();
    await borrowRecord.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'issuedBy', select: 'fullName username' }
    ]);

    res.status(201).json({
      message: 'Book issued successfully',
      borrowRecord
    });
  } catch (error) {
    console.error('Issue book error:', error);
    res.status(500).json({ 
      message: 'Error issuing book',
      error: error.message 
    });
  }
});

// Return book
router.patch('/borrows/:id/return', async (req, res) => {
  try {
    const { fine = 0, notes = '' } = req.body;

    const borrowRecord = await BorrowRecord.findById(req.params.id);
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrowRecord.status !== 'Borrowed') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    borrowRecord.status = 'Returned';
    borrowRecord.returnDate = new Date();
    borrowRecord.fine = fine;
    borrowRecord.notes = notes;

    await borrowRecord.save();
    await borrowRecord.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'issuedBy', select: 'fullName username' }
    ]);

    res.json({
      message: 'Book returned successfully',
      borrowRecord
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ 
      message: 'Error returning book',
      error: error.message 
    });
  }
});

// Renew book
router.patch('/borrows/:id/renew', async (req, res) => {
  try {
    const { newDueDate } = req.body;

    const borrowRecord = await BorrowRecord.findById(req.params.id);
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrowRecord.status !== 'Borrowed') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    if (borrowRecord.renewalCount >= 2) {
      return res.status(400).json({ 
        message: 'Maximum renewal limit reached' 
      });
    }

    borrowRecord.dueDate = new Date(newDueDate);
    borrowRecord.renewalCount += 1;

    await borrowRecord.save();
    await borrowRecord.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'issuedBy', select: 'fullName username' }
    ]);

    res.json({
      message: 'Book renewed successfully',
      borrowRecord
    });
  } catch (error) {
    console.error('Renew book error:', error);
    res.status(500).json({ 
      message: 'Error renewing book',
      error: error.message 
    });
  }
});

// Get overdue books
router.get('/overdue', async (req, res) => {
  try {
    const overdueBooks = await BorrowRecord.find({
      status: 'Borrowed',
      dueDate: { $lt: new Date() }
    })
    .populate('bookId', 'title author isbn')
    .populate('issuedBy', 'fullName username')
    .sort({ dueDate: 1 });

    res.json({ overdueBooks });
  } catch (error) {
    console.error('Get overdue books error:', error);
    res.status(500).json({ 
      message: 'Error fetching overdue books',
      error: error.message 
    });
  }
});

// Get library statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } }
    ]);
    const borrowedBooks = await BorrowRecord.countDocuments({ status: 'Borrowed' });
    const overdueBooks = await BorrowRecord.countDocuments({
      status: 'Borrowed',
      dueDate: { $lt: new Date() }
    });

    const categoryStats = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const borrowStats = await BorrowRecord.aggregate([
      { $match: { status: 'Borrowed' } },
      { $group: { _id: '$borrowerType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalBooks,
      availableBooks: availableBooks[0]?.total || 0,
      borrowedBooks,
      overdueBooks,
      categoryStats,
      borrowStats
    });
  } catch (error) {
    console.error('Library stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching library statistics',
      error: error.message 
    });
  }
});

module.exports = router;
