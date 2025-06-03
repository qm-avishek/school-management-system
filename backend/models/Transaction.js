const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Student Fees', 'Salary', 'Infrastructure', 'Equipment', 
      'Utilities', 'Maintenance', 'Library', 'Laboratory', 
      'Events', 'Scholarships', 'Other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Check', 'Online', 'Card'],
    required: true
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  relatedEntity: {
    type: String, // Could be student ID, employee ID, etc.
    trim: true
  },
  entityType: {
    type: String,
    enum: ['Student', 'Employee', 'Vendor', 'Other']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String
  }],
  academicYear: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, category: 1 });
transactionSchema.index({ academicYear: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
