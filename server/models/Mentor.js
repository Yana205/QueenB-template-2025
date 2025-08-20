// server/models/Mentor.js
// This defines the structure of mentor data in MongoDB

const mongoose = require('mongoose');

// Create the schema (blueprint) for a Mentor
const mentorSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true, // Removes extra spaces
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true, // Convert to lowercase
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please provide a valid phone number'
    ]
  },
  
  // Professional Information
  technologies: {
    type: [String], // Array of strings
    required: [true, 'At least one technology/skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Please add at least one technology'
    }
  },
  
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50 years']
  },
  
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Social/Contact Links
  linkedinUrl: {
    type: String,
    required: false,
    match: [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
      'Please provide a valid LinkedIn URL'
    ]
  },
  
  githubUrl: {
    type: String,
    required: false,
    match: [
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
      'Please provide a valid GitHub URL'
    ]
  },
  
  websiteUrl: {
    type: String,
    required: false,
    match: [
      /^https?:\/\/.+/,
      'Please provide a valid website URL starting with http:// or https://'
    ]
  },
  
  twitterUrl: {
    type: String,
    required: false,
    match: [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/,
      'Please provide a valid Twitter/X URL'
    ]
  },
  
  // Optional fields for future features
  profileImage: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0YIKgjCGBqjH8qbrmYoticIccFZGlw2rOtGKKIe9sTRdj8Ur0HyDEe3KVjVPz114DpJM&usqp=CAU' // Default profile image
  },
  
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  
  // Track when mentor joined
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Schema options
  timestamps: true, // Automatically manage createdAt and updatedAt
  collection: 'mentors' // Name of collection in MongoDB
});

// Indexes for better search performance
mentorSchema.index({ email: 1 }); // Index on email for fast lookups
mentorSchema.index({ technologies: 1 }); // Index for technology searches
mentorSchema.index({ firstName: 'text', lastName: 'text' }); // Text search on names

// Virtual property for full name (computed, not stored)
mentorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to format mentor data for API response
mentorSchema.methods.toJSON = function() {
  const mentor = this.toObject();
  delete mentor.__v; // Remove version key
  return mentor;
};

// Static method to find mentors by technology
mentorSchema.statics.findByTechnology = function(tech) {
  return this.find({ 
    technologies: { 
      $regex: new RegExp(tech, 'i') // Case-insensitive search
    } 
  });
};

// Pre-save hook (runs before saving)
mentorSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;