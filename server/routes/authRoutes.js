// server/routes/authRoutes.js
// Authentication routes for signup and login

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// POST /auth/signup - Register new user (mentor or mentee)
router.post('/signup', async (req, res) => {
  try {
    const { userType, firstName, lastName, email, password, phone, ...otherFields } = req.body;

    // Validate user type
    if (!userType || !['mentor', 'mentee'].includes(userType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'User type must be either "mentor" or "mentee"' 
      });
    }

    // Check if user already exists
    const existingMentor = await Mentor.findOne({ email: email.toLowerCase() });
    const existingMentee = await Mentee.findOne({ email: email.toLowerCase() });
    
    if (existingMentor || existingMentee) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    let newUser;
    
    if (userType === 'mentor') {
      // Validate mentor-specific fields
      const { technologies, yearsOfExperience, description, linkedinUrl } = otherFields;
      
      if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'At least one technology is required for mentors' 
        });
      }
      
      if (!yearsOfExperience || yearsOfExperience < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Years of experience is required and must be non-negative' 
        });
      }

      newUser = new Mentor({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        technologies,
        yearsOfExperience,
        description,
        linkedinUrl
      });
    } else {
      // Validate mentee-specific fields
      const { description, lookingFor } = otherFields;
      
      newUser = new Mentee({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        description,
        lookingFor: lookingFor || []
      });
    }

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, userType);

    // Return user data (without password) and token
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${userType} registered successfully`,
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user account',
      error: error.message 
    });
  }
});

// POST /auth/login - Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user based on type
    let user;
    if (userType === 'mentor') {
      user = await Mentor.findOne({ email: email.toLowerCase() });
    } else if (userType === 'mentee') {
      user = await Mentee.findOne({ email: email.toLowerCase() });
    } else {
      // If no userType specified, search in both collections
      user = await Mentor.findOne({ email: email.toLowerCase() }) || 
             await Mentee.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Determine user type if not specified
    const actualUserType = userType || (user instanceof Mentor ? 'mentor' : 'mentee');

    // Generate token
    const token = generateToken(user._id, actualUserType);

    // Return user data (without password) and token
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        userType: actualUserType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
});

// GET /auth/me - Get current user profile (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // User is already attached to req by the middleware
    const userResponse = req.user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        user: userResponse,
        userType: req.userType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
});

module.exports = router;
