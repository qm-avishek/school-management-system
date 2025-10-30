import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI } from '../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('mark'); // mark, view, reports
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const courses = [
    'Computer Science',
    'Mechanical',
    'Electrical',
    'Civil',
    'Electronics',
    'Chemical'
  ];

  const years = [1, 2, 3, 4];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // Fetch students for marking attendance
  const fetchStudentsForAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getReport({
        date: selectedDate,
        course: selectedCourse,
        year: selectedYear,
        semester: selectedSemester
      });

      setStudents(response.data.report);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedCourse, selectedYear, selectedSemester]);

  const fetchAttendanceStats = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCourse) params.course = selectedCourse;
      if (selectedYear) params.year = selectedYear;
      if (selectedSemester) params.semester = selectedSemester;

      // Get last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      params.startDate = format(startDate, 'yyyy-MM-dd');
      params.endDate = format(endDate, 'yyyy-MM-dd');

      const response = await attendanceAPI.getStats(params);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, selectedYear, selectedSemester]);

  // Fetch students for marking attendance
  useEffect(() => {
    if (activeTab === 'mark' && selectedCourse && selectedYear && selectedSemester) {
      fetchStudentsForAttendance();
    }
  }, [activeTab, fetchStudentsForAttendance, selectedCourse, selectedYear, selectedSemester, selectedDate]);

  // Fetch attendance stats
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchAttendanceStats();
    }
  }, [activeTab, fetchAttendanceStats]);

  const handleAttendanceChange = (studentId, status) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.student._id === studentId
          ? { ...student, status, modified: true }
          : student
      )
    );
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);

      const modifiedStudents = students.filter(s => s.modified);
      
      if (modifiedStudents.length === 0) {
        toast.error('No changes to save');
        return;
      }

      const attendanceRecords = modifiedStudents.map(student => ({
        studentId: student.student._id,
        status: student.status,
      }));

      const response = await attendanceAPI.markBulkAttendance({
        attendanceRecords,
        date: selectedDate
      });

      toast.success(`Attendance saved for ${response.data.results.success.length} students`);
      
      if (response.data.results.failed.length > 0) {
        toast.error(`Failed for ${response.data.results.failed.length} students`);
      }

      // Refresh the list
      fetchStudentsForAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAll = (status) => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({
        ...student,
        status,
        modified: true
      }))
    );
  };

  const renderMarkAttendance = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Select Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      {selectedCourse && selectedYear && selectedSemester && (
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Mark Attendance - {format(new Date(selectedDate), 'MMMM dd, yyyy')}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAll('Present')}
                  className="btn btn-sm btn-success"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('Absent')}
                  className="btn btn-sm btn-danger"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Mark All Absent
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students found for the selected class
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.student.firstName} {student.student.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleAttendanceChange(student.student._id, 'Present')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  student.status === 'Present'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.student._id, 'Absent')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  student.status === 'Absent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.student._id, 'Late')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  student.status === 'Late'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.student._id, 'Excused')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  student.status === 'Excused'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving || students.filter(s => s.modified).length === 0}
                    className="btn btn-primary"
                  >
                    {saving ? (
                      <>
                        <div className="spinner-sm mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Save Attendance
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Filter Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchAttendanceStats}
              className="btn btn-primary"
            >
              <Filter className="w-5 h-5 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-green-50 border-l-4 border-green-500">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.statusStats.Present || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>
            </div>

            <div className="card bg-red-50 border-l-4 border-red-500">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.statusStats.Absent || 0}
                    </p>
                  </div>
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </div>
            </div>

            <div className="card bg-yellow-50 border-l-4 border-yellow-500">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Late</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.statusStats.Late || 0}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 border-l-4 border-blue-500">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.attendancePercentage || 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRecords || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.statusStats.Present || 0}
                  </p>
                  <p className="text-sm text-gray-600">Present Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {stats.statusStats.Absent || 0}
                  </p>
                  <p className="text-sm text-gray-600">Absent Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.statusStats.Excused || 0}
                  </p>
                  <p className="text-sm text-gray-600">Excused</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Mark daily attendance and view attendance reports
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mark')}
            className={`${
              activeTab === 'mark'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <PieChart className="w-5 h-5 mr-2" />
            Reports & Statistics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'mark' && renderMarkAttendance()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default Attendance;
