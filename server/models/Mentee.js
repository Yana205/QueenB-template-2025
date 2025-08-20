// server/models/Mentee.js
// This defines the structure of mentee data in MongoDB

const mongoose = require('mongoose');

// Create the schema for a Mentee
const menteeSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
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
    unique: true,
    lowercase: true,
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
  
  // Optional description about what they're looking for
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Technologies/skills they want to learn
  lookingFor: {
    type: [String], // Array of technologies they're interested in
    required: false,
    default: []
  },
  
  // Profile completion status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Profile image
  profileImage: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0YIKgjCGBqjH8qbrmYoticIccFZGlw2rOtGKKIe9sTRdj8Ur0HyDEe3KVjVPz114DpJM&usqp=CAU'
  },
  
  // For future authentication
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'mentees'
});

// Indexes for performance
menteeSchema.index({ email: 1 });
menteeSchema.index({ lookingFor: 1 });

// Virtual for full name
menteeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if profile is complete
menteeSchema.methods.checkProfileCompletion = function() {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
  const isComplete = requiredFields.every(field => this[field]);
  
  if (isComplete && !this.profileCompleted) {
    this.profileCompleted = true;
    return this.save();
  }
  
  return Promise.resolve(this);
};



// Static method to find active mentees
menteeSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Clean up response
menteeSchema.methods.toJSON = function() {
  const mentee = this.toObject();
  delete mentee.__v;
  return mentee;
};

// Create and export the model
const Mentee = mongoose.model('Mentee', menteeSchema);

module.exports = Mentee;