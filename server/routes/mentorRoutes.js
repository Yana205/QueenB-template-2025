// server/routes/mentorRoutes.js
// API endpoints for mentor operations

const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// ==========================================
// GET /api/mentors - Get all mentors 
// ==========================================
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all mentors...');
    
    const mentors = await Mentor.find()
      .sort({ createdAt: -1 }); // Newest first
    
    console.log(`✅ Found ${mentors.length} mentors in database`);
    mentors.forEach(mentor => {
      console.log(`  - ${mentor.firstName} ${mentor.lastName} (ID: ${mentor._id})`);
    });
    
    res.json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('❌ Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentors'
    });
  }
});

// ==========================================
// GET /api/mentors/search - Search mentors // by full name or Technologis
// ==========================================
router.get('/search', async (req, res) => {
  try {
    const { technology, name } = req.query;
    let query = {};
    
    // Build search query
    if (technology) {
      query.technologies = { 
        $regex: new RegExp(technology, 'i') 
      };
    }
    
    if (name) {
      query.$or = [
        { firstName: { $regex: new RegExp(name, 'i') } },
        { lastName: { $regex: new RegExp(name, 'i') } }
      ];
    }
    
    const mentors = await Mentor.find(query);
    
    res.json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// ==========================================
// GET /api/mentors/:id - Get single mentor
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching mentor with ID:', req.params.id);
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      console.log('❌ Mentor not found:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    console.log('✅ Mentor found:', mentor.firstName, mentor.lastName);
    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('❌ Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor'
    });
  }
});

// ==========================================
// POST /api/mentors - Create new mentor
// ==========================================
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new mentor with data:', req.body);
    
    // Create new mentor instance
    const mentor = new Mentor(req.body);
    
    // Save to database
    await mentor.save();
    
    console.log('✅ Mentor created successfully:', mentor.fullName);
    
    res.status(201).json({
      success: true,
      data: mentor,
      message: 'Mentor registered successfully!'
    });
  } catch (error) {
    console.error('Error creating mentor:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors
      });
    }
    
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create mentor'
    });
  }
});

// ==========================================
// PUT /api/mentors/:id - Update mentor
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    console.log('🔄 Attempting to update mentor with ID:', req.params.id);
    console.log('📝 Update data received:', req.body);
    
    // Validate the mentor ID
    if (!req.params.id || req.params.id.length !== 24) {
      console.log('❌ Invalid mentor ID format:', req.params.id);
      return res.status(400).json({
        success: false,
        error: 'Invalid mentor ID format'
      });
    }
    
    // Check if mentor exists before updating
    const existingMentor = await Mentor.findById(req.params.id);
    if (!existingMentor) {
      console.log('❌ Mentor not found for update:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    console.log('✅ Found mentor to update:', existingMentor.firstName, existingMentor.lastName);
    
    // Perform the update
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!mentor) {
      console.log('❌ Failed to update mentor:', req.params.id);
      return res.status(500).json({
        success: false,
        error: 'Failed to update mentor'
      });
    }
    
    console.log('✅ Mentor updated successfully:', mentor.firstName, mentor.lastName);
    
    res.json({
      success: true,
      data: mentor,
      message: 'Mentor updated successfully!'
    });
  } catch (error) {
    console.error('❌ Error updating mentor:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    if (error.name === 'CastError') {
      console.log('❌ Cast error - invalid data type:', error.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid data format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update mentor',
      details: error.message
    });
  }
});

// ==========================================
// DELETE /api/mentors/:id - Delete mentor
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Attempting to delete mentor with ID:', req.params.id);
    
    // First, check if mentor exists
    const existingMentor = await Mentor.findById(req.params.id);
    if (!existingMentor) {
      console.log('❌ Mentor not found for deletion:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    console.log('✅ Found mentor to delete:', existingMentor.firstName, existingMentor.lastName);
    
    // Perform the deletion
    const deletedMentor = await Mentor.findByIdAndDelete(req.params.id);
    
    if (!deletedMentor) {
      console.log('❌ Failed to delete mentor:', req.params.id);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete mentor'
      });
    }
    
    console.log('✅ Mentor deleted successfully:', deletedMentor.firstName, deletedMentor.lastName);
    
    // Verify deletion by trying to find the mentor again
    const verifyDeletion = await Mentor.findById(req.params.id);
    if (verifyDeletion) {
      console.log('⚠️ WARNING: Mentor still exists after deletion!', req.params.id);
    } else {
      console.log('✅ Verification: Mentor successfully removed from database');
    }
    
    res.json({
      success: true,
      message: 'Mentor deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting mentor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete mentor'
    });
  }
});

module.exports = router;