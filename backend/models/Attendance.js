const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true
  },
  course: {
    type: String,
    required: true
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
  subject: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  academicYear: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per student per date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Index for better query performance
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ course: 1, year: 1, semester: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ academicYear: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
