const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token. Admin not found.' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const checkPermission = (module) => {
  return (req, res, next) => {
    if (req.admin.role === 'super_admin') {
      return next();
    }

    if (!req.admin.permissions[module]) {
      return res.status(403).json({ 
        message: `Access denied. You don't have permission to access ${module} module.` 
      });
    }

    next();
  };
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient privileges.' 
      });
    }
    next();
  };
};

module.exports = { auth, checkPermission, requireRole };
