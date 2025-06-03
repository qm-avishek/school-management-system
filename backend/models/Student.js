const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  course: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical']
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  guardianInfo: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  academicInfo: {
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    totalCredits: { type: Number, default: 0 },
    attendancePercentage: { type: Number, min: 0, max: 100, default: 0 }
  },
  feeStatus: {
    totalFee: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    lastPaymentDate: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Dropped'],
    default: 'Active'
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
studentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
