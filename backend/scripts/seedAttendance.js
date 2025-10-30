const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

dotenv.config();

const seedAttendance = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all active students
    const students = await Student.find({ status: 'Active' }).limit(50);
    
    if (students.length === 0) {
      console.log('⚠️  No students found. Please seed students first.');
      process.exit(0);
    }

    console.log(`📊 Found ${students.length} active students`);

    // Generate attendance for the last 7 days
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const year = date.getFullYear();
      const month = date.getMonth();
      const academicYear = month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

      for (const student of students) {
        // Random status with weighted probability (80% present, 10% absent, 5% late, 5% excused)
        const random = Math.random();
        let status;
        if (random < 0.80) status = 'Present';
        else if (random < 0.90) status = 'Absent';
        else if (random < 0.95) status = 'Late';
        else status = 'Excused';

        attendanceRecords.push({
          studentId: student._id,
          date: date,
          status: status,
          course: student.course,
          year: student.year,
          semester: student.semester,
          academicYear: academicYear
        });
      }
    }

    console.log(`📝 Generated ${attendanceRecords.length} attendance records`);

    // Clear existing attendance data
    await Attendance.deleteMany({});
    console.log('🗑️  Cleared existing attendance data');

    // Insert new attendance records
    await Attendance.insertMany(attendanceRecords);
    console.log('✅ Sample attendance data seeded successfully!');

    // Show statistics
    const stats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Attendance Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding attendance:', error);
    process.exit(1);
  }
};

seedAttendance();
