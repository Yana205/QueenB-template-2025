// server/addPasswordsToExisting.js
// Script to add password fields to existing mentor and mentee records

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Mentor = require('./models/Mentor');
const Mentee = require('./models/Mentee');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function addPasswordsToExisting() {
  try {
    console.log('Starting to add passwords to existing records...');
    
    // Update existing mentors
    const mentorsResult = await Mentor.updateMany(
      { password: { $exists: false } }, // Find mentors without password
      { $set: { password: 'default123' } } // Set default password
    );
    console.log(`Updated ${mentorsResult.modifiedCount} mentors with default password`);
    
    // Update existing mentees
    const menteesResult = await Mentee.updateMany(
      { password: { $exists: false } }, // Find mentees without password
      { $set: { password: 'default123' } } // Set default password
    );
    console.log(`Updated ${menteesResult.modifiedCount} mentees with default password`);
    
    console.log('✅ All existing records now have password fields!');
    console.log('📝 Default password for existing users: default123');
    console.log('💡 Users should change their passwords after first login');
    
  } catch (error) {
    console.error('Error updating records:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
addPasswordsToExisting();
