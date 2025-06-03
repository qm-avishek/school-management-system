import React, { useState, useEffect } from 'react';
import { studentsAPI, employeesAPI, financeAPI, libraryAPI } from '../services/api';
import {
  Users,
  Briefcase,
  DollarSign,
  BookOpen,
  TrendingUp,
  TrendingDown,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: {},
    employees: {},
    finance: {},
    library: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [studentsRes, employeesRes, financeRes, libraryRes] = await Promise.all([
          studentsAPI.getStats(),
          employeesAPI.getStats(),
          financeAPI.getReports(),
          libraryAPI.getStats(),
        ]);

        setStats({
          students: studentsRes.data,
          employees: employeesRes.data,
          finance: financeRes.data,
          library: libraryRes.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.students.totalStudents || 0,
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Employees',
      value: stats.employees.totalEmployees || 0,
      change: '+3%',
      changeType: 'increase',
      icon: Briefcase,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(stats.finance.summary?.totalIncome || 0).toLocaleString()}`,
      change: '+8%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Library Books',
      value: stats.library.totalBooks || 0,
      change: '+5%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of SSGB Engineering College operations
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 text-white ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm">
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-1 ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students by Course Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Students by Course</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.students.courseStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Employee Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.employees.departmentStats || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats.employees.departmentStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Financial Overview</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{(stats.finance.summary?.totalIncome || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ₹{(stats.finance.summary?.totalExpense || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Expenses</div>
              </div>
              <div className="col-span-2 text-center">
                <div className={`text-2xl font-bold ${
                  (stats.finance.summary?.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{(stats.finance.summary?.netBalance || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Net Balance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Library Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Library Status</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Total Books</span>
                </div>
                <span className="text-lg font-semibold">{stats.library.totalBooks || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <span className="text-lg font-semibold">{stats.library.availableBooks || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Borrowed</span>
                </div>
                <span className="text-lg font-semibold">{stats.library.borrowedBooks || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Overdue</span>
                </div>
                <span className="text-lg font-semibold text-red-600">
                  {stats.library.overdueBooks || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Add Student</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Briefcase className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Add Employee</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Add Transaction</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Add Book</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
