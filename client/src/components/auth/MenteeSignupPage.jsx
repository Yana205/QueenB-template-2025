import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Autocomplete,
  Chip
} from '@mui/material';
import { useFormValidation } from '../../hook/useFormValidation';
import SuccessBanner from '../ui/SuccessBanner';

const MenteeSignupPage = () => {
  const navigate = useNavigate();
  
  // Form state - following your database schema
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    description: '',
    lookingFor: [] // Array of technologies they want to learn
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // NEW: Use the reusable validation hook
  const {
    fieldErrors,
    generalError,
    success,
    clearErrors,
    clearFieldError,
    setFieldError,
    setError,
    setSuccessMessage,
    validateEmailField,
    validatePasswordField,
    validateRequiredField,
    validatePhoneField,
    hasErrors
  } = useFormValidation();

  // Available technologies for autocomplete (you can expand this list)
  const availableTechnologies = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'DevOps', 'Machine Learning', 'AI',
    'Data Science', 'Mobile Development', 'iOS', 'Android', 'Flutter'
  ];

  // Handle input changes for regular text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific errors when user types
    if (fieldErrors[name]) {
      clearFieldError(name);
    }
    
    // Clear any previous general errors/success messages
    if (generalError) setError('');
    if (success) setSuccessMessage('');
    
    // Real-time validation for specific fields
    if (name === 'email' && value) {
      validateEmailField(value);
    }
    if (name === 'password' && value) {
      validatePasswordField(value);
    }
    if (name === 'phone' && value) {
      validatePhoneField(value);
    }
  };

  // Handle technology selection (autocomplete)
  const handleTechnologyChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: newValue
    }));
    if (generalError) setError('');
    if (success) setSuccessMessage('');
  };

  // Validate entire form before submission
  const validateForm = () => {
    let isValid = true;
    
    // Validate all required fields
    if (!validateRequiredField(formData.firstName, 'firstName')) isValid = false;
    if (!validateRequiredField(formData.lastName, 'lastName')) isValid = false;
    if (!validateEmailField(formData.email)) isValid = false;
    if (!validatePasswordField(formData.password)) isValid = false;
    if (!validatePhoneField(formData.phone)) isValid = false;
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    clearErrors();

    try {
      // Create mentee data (following your database schema)
      const menteeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        description: formData.description || '',
        lookingFor: formData.lookingFor,
        profileCompleted: true,
        isActive: true
      };

      // Send POST request to create mentee
      const response = await fetch('/api/mentees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menteeData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // NEW: Show success banner instead of simple message
        setShowSuccessBanner(true);
        
        // Store the user ID and type for profile access
        if (data.data && data.data._id) {
          sessionStorage.setItem('currentUserId', data.data._id);
          sessionStorage.setItem('userType', 'mentee');
        }
        
        // Redirect to mentors page after a longer delay to show the banner
        setTimeout(() => {
          navigate('/mentors?signupSuccess=1');
        }, 3000); // Increased to 3 seconds to show the banner
      } else {
        // Handle field-specific errors from server
        if (data.fieldErrors) {
          Object.keys(data.fieldErrors).forEach(field => {
            setFieldError(field, data.fieldErrors[field]);
          });
        } else {
          setError(data.error || 'Failed to create mentee account');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.email.trim() && 
           !fieldErrors.email &&
           formData.password.length >= 6 && 
           !fieldErrors.password &&
           formData.phone.trim() && 
           !fieldErrors.phone &&
           !hasErrors();
  };

  // NEW: Handle success banner close
  const handleSuccessBannerClose = () => {
    setShowSuccessBanner(false);
  };

  // NEW: Handle immediate navigation to mentors
  const handleExploreMentors = () => {
    navigate('/mentors?signupSuccess=1');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 6,
            width: '100%',
            maxWidth: 600,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 232, 214, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                mb: 1
              }}
            >
              Create Mentee Account
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              Join QueenB and find your perfect mentor
            </Typography>
          </Box>

          {/* NEW: Success Banner */}
          {showSuccessBanner && (
            <SuccessBanner
              title="Account Created Successfully"
              subtitle="You're all set! Ready to find your perfect mentor and start your learning journey."
              ctaLabel="View My Profile"
              onCtaClick={() => {
                const userId = sessionStorage.getItem('currentUserId');
                if (userId) {
                  navigate(`/profile/mentee/${userId}`);
                }
              }}
              onClose={handleSuccessBannerClose}
              variant="clean"
            />
          )}

          {/* Additional Navigation Options */}
          {showSuccessBanner && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                onClick={handleExploreMentors}
                sx={{ mr: 2 }}
              >
                Explore Mentors
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const userId = sessionStorage.getItem('currentUserId');
                  if (userId) {
                    navigate(`/profile/mentee/${userId}`);
                  }
                }}
              >
                Edit My Profile
              </Button>
            </Box>
          )}

          {/* Error Message - Nice Button Style */}
          {generalError && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'error.light', 
              border: '1px solid',
              borderColor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="body2" color="error.dark" sx={{ flex: 1 }}>
                {generalError}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => setError('')}
                sx={{ ml: 2, minWidth: 'auto' }}
              >
                ×
              </Button>
            </Box>
          )}

          {/* Sign-up Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              {/* First Name and Last Name - Side by Side */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name "
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  sx={{ flex: 1 }}
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                />
                
                <TextField
                  fullWidth
                  label="Last Name "
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  sx={{ flex: 1 }}
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                />
              </Box>

              {/* Email */}
              <TextField
                fullWidth
                label="Email "
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => {
                  // Additional validation on blur
                  validateEmailField(e.target.value);
                }}
                required
                sx={{ mb: 2 }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email || "We'll use this for your login"}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password "
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={(e) => {
                  // Additional validation on blur
                  validatePasswordField(e.target.value);
                }}
                required
                sx={{ mb: 2 }}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || "Minimum 6 characters"}
              />

              {/* Phone */}
              <TextField
                fullWidth
                label="Phone Number "
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={(e) => {
                  // Additional validation on blur
                  validatePhoneField(e.target.value);
                }}
                required
                sx={{ mb: 2 }}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone || "Format: 050-1234567"}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="About You (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
                helperText="Tell us what you're looking to learn"
              />

              {/* Technologies Autocomplete */}
              <Autocomplete
                multiple
                options={availableTechnologies}
                value={formData.lookingFor}
                onChange={handleTechnologyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Technologies You Want to Learn *"
                    placeholder="Start typing..."
                    helperText="Select the technologies you want to learn"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        label={option}
                        {...chipProps}
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'white',
                          '& .MuiChip-deleteIcon': {
                            color: 'white',
                          }
                        }}
                      />
                    );
                  })
                }
                sx={{ mb: 3 }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid() || isLoading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Back to Login */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                color="primary"
                onClick={() => navigate('/login/mentee')}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  p: 0,
                  minWidth: 'auto'
                }}
              >
                ← Back to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default MenteeSignupPage;
