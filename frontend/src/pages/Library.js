import React, { useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';

const Library = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('book'); // 'book' or 'borrow'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    author: ''
  });

  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publishedYear: '',
    pages: '',
    language: '',
    description: '',
    totalCopies: '',
    availableCopies: '',
    location: '',
    status: 'available'
  });

  const [borrowFormData, setBorrowFormData] = useState({
    bookId: '',
    studentId: '',
    borrowDate: '',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    } else {
      fetchBorrowRecords();
    }
    fetchStats();
  }, [activeTab, currentPage, searchTerm, filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        ...filters
      };
      
      const response = await libraryAPI.getBooks(params);
      setBooks(response.data.books);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowRecords = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        ...filters
      };
      
      const response = await libraryAPI.getBorrowRecords(params);
      setBorrowRecords(response.data.borrowRecords);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch borrow records');
      console.error('Error fetching borrow records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await libraryAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem && modalType === 'book') {        await libraryAPI.updateBook(selectedItem._id, bookFormData);
      } else {
        await libraryAPI.createBook(bookFormData);
      }
      
      setShowModal(false);
      setSelectedItem(null);
      resetBookForm();
      fetchBooks();
      fetchStats();
    } catch (err) {
      setError('Failed to save book');
      console.error('Error saving book:', err);
    }
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem && modalType === 'borrow') {        await libraryAPI.renewBook(selectedItem._id, borrowFormData);
      } else {
        await libraryAPI.issueBook(borrowFormData);
      }
      
      setShowModal(false);
      setSelectedItem(null);
      resetBorrowForm();
      fetchBorrowRecords();
      fetchBooks();
      fetchStats();
    } catch (err) {
      setError('Failed to save borrow record');
      console.error('Error saving borrow record:', err);
    }
  };

  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    if (type === 'book') {
      setBookFormData({
        ...item,
        publishedYear: item.publishedYear || ''
      });
    } else {
      setBorrowFormData({
        ...item,
        borrowDate: item.borrowDate ? item.borrowDate.split('T')[0] : '',
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
        returnDate: item.returnDate ? item.returnDate.split('T')[0] : ''
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (itemId, type) => {
    const confirmMessage = type === 'book' ? 
      'Are you sure you want to delete this book?' : 
      'Are you sure you want to delete this borrow record?';
      
    if (window.confirm(confirmMessage)) {
      try {
        if (type === 'book') {          await libraryAPI.deleteBook(itemId);
          fetchBooks();
        } else {
          await libraryAPI.deleteBorrowRecord(itemId);
          fetchBorrowRecords();
        }
        fetchStats();
      } catch (err) {
        setError(`Failed to delete ${type}`);
        console.error(`Error deleting ${type}:`, err);
      }
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await libraryAPI.returnBook(recordId, {});
      fetchBorrowRecords();
      fetchBooks();
      fetchStats();
    } catch (err) {
      setError('Failed to return book');
      console.error('Error returning book:', err);
    }
  };

  const resetBookForm = () => {
    setBookFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publisher: '',
      publishedYear: '',
      pages: '',
      language: '',
      description: '',
      totalCopies: '',
      availableCopies: '',
      location: '',
      status: 'available'
    });
  };

  const resetBorrowForm = () => {
    setBorrowFormData({
      bookId: '',
      studentId: '',
      borrowDate: '',
      dueDate: '',
      notes: ''
    });
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setBookFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBorrowInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Engineering', 'Mathematics', 'History', 'Literature', 'Reference', 'Journals'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Other'];
  const bookStatuses = ['available', 'checked-out', 'maintenance', 'lost'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalType('book');
              resetBookForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Book
          </button>
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalType('borrow');
              resetBorrowForm();
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Issue Book
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalBooks || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Available Books</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableBooks || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Issued Books</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.issuedBooks || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueBooks || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => {setActiveTab('books'); setCurrentPage(1);}}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Books Catalog
            </button>
            <button
              onClick={() => {setActiveTab('borrow'); setCurrentPage(1);}}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'borrow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Borrow Records
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {activeTab === 'books' ? (
              <>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  {bookStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
                <div></div>
                <div></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'books' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                      <div className="text-sm text-gray-500">{book.publisher} ({book.publishedYear})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.isbn}</div>
                    <div className="text-sm text-gray-500">{book.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.availableCopies}/{book.totalCopies}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (() => {
                        switch(book.status) {
                          case 'available': return 'bg-green-100 text-green-800';
                          case 'checked-out': return 'bg-yellow-100 text-yellow-800';
                          case 'maintenance': return 'bg-blue-100 text-blue-800';
                          default: return 'bg-red-100 text-red-800';
                        }
                      })()
                    }`}>
                      {book.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(book, 'book')}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id, 'book')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book & Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.bookId?.title || 'Book not found'}
                      </div>
                      <div className="text-sm text-gray-500">Student: {record.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.borrowDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.dueDate).toLocaleDateString()}
                    </div>
                    {record.returnDate && (
                      <div className="text-sm text-gray-500">
                        Returned: {new Date(record.returnDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (() => {
                        if (record.returnDate) return 'bg-green-100 text-green-800';
                        if (new Date(record.dueDate) < new Date()) return 'bg-red-100 text-red-800';
                        return 'bg-yellow-100 text-yellow-800';
                      })()
                    }`}>
                      {record.returnDate ? 'Returned' : 
                       new Date(record.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!record.returnDate && (
                      <button
                        onClick={() => handleReturn(record._id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Return
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(record, 'borrow')}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id, 'borrow')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'book' 
                  ? (selectedItem ? 'Edit Book' : 'Add New Book')
                  : (selectedItem ? 'Edit Borrow Record' : 'Issue Book')
                }
              </h3>
              
              {modalType === 'book' ? (
                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Book Title"
                      value={bookFormData.title}
                      onChange={handleBookInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="author"
                      placeholder="Author"
                      value={bookFormData.author}
                      onChange={handleBookInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="isbn"
                      placeholder="ISBN"
                      value={bookFormData.isbn}
                      onChange={handleBookInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      name="category"
                      value={bookFormData.category}
                      onChange={handleBookInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="publisher"
                      placeholder="Publisher"
                      value={bookFormData.publisher}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="publishedYear"
                      placeholder="Published Year"
                      value={bookFormData.publishedYear}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="pages"
                      placeholder="Number of Pages"
                      value={bookFormData.pages}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      name="language"
                      value={bookFormData.language}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Language</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="totalCopies"
                      placeholder="Total Copies"
                      value={bookFormData.totalCopies}
                      onChange={handleBookInputChange}
                      required
                      min="1"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="availableCopies"
                      placeholder="Available Copies"
                      value={bookFormData.availableCopies}
                      onChange={handleBookInputChange}
                      required
                      min="0"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="location"
                      placeholder="Shelf Location"
                      value={bookFormData.location}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      name="status"
                      value={bookFormData.status}
                      onChange={handleBookInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {bookStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    name="description"
                    placeholder="Book Description"
                    value={bookFormData.description}
                    onChange={handleBookInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedItem(null);
                        resetBookForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedItem ? 'Update' : 'Add'} Book
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleBorrowSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="bookId"
                      placeholder="Book ID"
                      value={borrowFormData.bookId}
                      onChange={handleBorrowInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="studentId"
                      placeholder="Student ID"
                      value={borrowFormData.studentId}
                      onChange={handleBorrowInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      name="borrowDate"
                      placeholder="Borrow Date"
                      value={borrowFormData.borrowDate}
                      onChange={handleBorrowInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      placeholder="Due Date"
                      value={borrowFormData.dueDate}
                      onChange={handleBorrowInputChange}
                      required
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    name="notes"
                    placeholder="Notes (optional)"
                    value={borrowFormData.notes}
                    onChange={handleBorrowInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedItem(null);
                        resetBorrowForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {selectedItem ? 'Update' : 'Issue'} Book
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
