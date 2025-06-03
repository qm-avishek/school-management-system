const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Computer Science', 'Mechanical Engineering', 'Electrical Engineering',
      'Civil Engineering', 'Electronics', 'Chemical Engineering',
      'Mathematics', 'Physics', 'Chemistry', 'General', 'Reference'
    ]
  },
  language: {
    type: String,
    default: 'English'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    shelf: String,
    rack: String,
    floor: String
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock', 'Discontinued'],
    default: 'Available'
  }
}, {
  timestamps: true
});

const borrowRecordSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowerId: {
    type: String,
    required: true // Can be student ID or employee ID
  },
  borrowerType: {
    type: String,
    enum: ['Student', 'Employee'],
    required: true
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Borrowed', 'Returned', 'Overdue', 'Lost'],
    default: 'Borrowed'
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  renewalCount: {
    type: Number,
    default: 0,
    max: 2 // Maximum 2 renewals allowed
  },
  notes: {
    type: String,
    trim: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Update available copies when borrowing/returning
borrowRecordSchema.pre('save', async function(next) {
  if (this.isNew) {
    // New borrow record
    await mongoose.model('Book').findByIdAndUpdate(
      this.bookId,
      { $inc: { availableCopies: -1 } }
    );
  } else if (this.isModified('status') && this.status === 'Returned') {
    // Book returned
    await mongoose.model('Book').findByIdAndUpdate(
      this.bookId,
      { $inc: { availableCopies: 1 } }
    );
  }
  next();
});

// Index for better query performance
borrowRecordSchema.index({ borrowerId: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1, status: 1 });

const Book = mongoose.model('Book', bookSchema);
const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

module.exports = { Book, BorrowRecord };
