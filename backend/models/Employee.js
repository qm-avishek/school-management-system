const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
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
  department: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical', 'Administration', 'Library', 'Finance']
  },
  designation: {
    type: String,
    required: true
  },
  employeeType: {
    type: String,
    enum: ['Teaching', 'Non-Teaching', 'Administrative'],
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  salary: {
    basic: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number }
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    percentage: Number
  }],
  experience: {
    totalYears: { type: Number, default: 0 },
    previousOrganizations: [{
      name: String,
      designation: String,
      duration: String,
      responsibilities: String
    }]
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Resigned', 'Terminated'],
    default: 'Active'
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Calculate net salary before saving
employeeSchema.pre('save', function(next) {
  if (this.salary.basic !== undefined) {
    this.salary.netSalary = this.salary.basic + (this.salary.allowances || 0) - (this.salary.deductions || 0);
  }
  next();
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
