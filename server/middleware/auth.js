// server/middleware/auth.js
// Authentication middleware for protecting routes

const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

// Middleware to verify JWT token and attach user to request
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on type
    let user;
    if (decoded.userType === 'mentor') {
      user = await Mentor.findById(decoded.userId);
    } else if (decoded.userType === 'mentee') {
      user = await Mentee.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
    }

    // Attach user and user type to request
    req.user = user;
    req.userType = decoded.userType;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Middleware to check if user is a mentor
const requireMentor = (req, res, next) => {
  if (req.userType !== 'mentor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied - mentor role required' 
    });
  }
  next();
};

// Middleware to check if user is a mentee
const requireMentee = (req, res, next) => {
  if (req.userType !== 'mentee') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied - mentee role required' 
    });
  }
  next();
};

// Middleware to check if user is either mentor or mentee
const requireAuth = (req, res, next) => {
  if (!req.user || !req.userType) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireMentor,
  requireMentee,
  requireAuth
};
