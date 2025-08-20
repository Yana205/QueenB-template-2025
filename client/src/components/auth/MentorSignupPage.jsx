import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import AvatarPicker from './AvatarPicker';
import { defaultAvatar } from './avatarOptions';
import { useFormValidation } from '../../hook/useFormValidation';
import SuccessBanner from '../ui/SuccessBanner';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import LinkIcon from '@mui/icons-material/Link';

const MentorSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    yearsOfExperience: '',
    expertise: [],
    description: '',
    availability: 'flexible',
    avatar: defaultAvatar, // Add default avatar
    linkedinUrl: '', // LinkedIn profile URL
    githubUrl: '', // GitHub profile URL
    websiteUrl: '', // Personal website URL
    twitterUrl: '' // Twitter/X profile URL
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [localError, setLocalError] = useState(''); // Local error state for server errors
  
  // Use the reusable validation hook
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

  // Available technologies for expertise (mentor's skills)
  const availableTechnologies = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'DevOps', 'Machine Learning', 'AI',
    'Data Science', 'Mobile Development', 'iOS', 'Android', 'Flutter',
    'Ruby on Rails', 'PHP', 'Laravel', 'Swift', 'Kotlin', 'Rust',
    'Go', 'Scala', 'Elixir', 'GraphQL', 'REST APIs', 'Microservices'
  ];

  // Experience levels
  const experienceLevels = [
    '1-2 years', '3-5 years', '5-8 years', '8-12 years', '12+ years'
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'part-time', label: 'Part-time (few hours/week)' },
    { value: 'full-time', label: 'Full-time (dedicated mentor)' },
    { value: 'flexible', label: 'Flexible (as needed)' }
  ];

  // Effect to handle navigation based on query parameters
  useEffect(() => {
    const signupSuccess = new URLSearchParams(location.search).get('signupSuccess');
    if (signupSuccess === '1') {
      setShowSuccessBanner(true);
    }
  }, [location.search]);

  // Effect to clear success banner after a delay
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

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
    
    // Clear local error when user types in email field
    if (name === 'email' && localError) {
      setLocalError('');
    }
    
    // Don't clear general errors when typing - let server errors stay visible
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
    if (name === 'linkedinUrl' && value) {
      validateLinkedInUrl(value);
    }
    if (name === 'githubUrl' && value) {
      validateGitHubUrl(value);
    }
    if (name === 'websiteUrl' && value) {
      validateWebsiteUrl(value);
    }
    if (name === 'twitterUrl' && value) {
      validateTwitterUrl(value);
    }
  };

  // Handle expertise selection (autocomplete)
  const handleExpertiseChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      expertise: newValue
    }));
    if (generalError) setError('');
    if (success) setSuccessMessage('');
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
    if (generalError) setError('');
    if (success) setSuccessMessage('');
  };

  // Validate LinkedIn URL
  const validateLinkedInUrl = (url) => {
    if (url && !url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/)) {
      setFieldError('linkedinUrl', 'Please enter a valid LinkedIn profile URL');
    } else {
      clearFieldError('linkedinUrl');
    }
  };

  // Validate GitHub URL
  const validateGitHubUrl = (url) => {
    if (url && !url.match(/^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/)) {
      setFieldError('githubUrl', 'Please enter a valid GitHub profile URL');
    } else {
      clearFieldError('githubUrl');
    }
  };

  // Validate website URL
  const validateWebsiteUrl = (url) => {
    if (url && !url.match(/^https?:\/\/.+/)) {
      setFieldError('websiteUrl', 'Please enter a valid website URL starting with http:// or https://');
    } else {
      clearFieldError('websiteUrl');
    }
  };

  // Validate Twitter/X URL
  const validateTwitterUrl = (url) => {
    if (url && !url.match(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/)) {
      setFieldError('twitterUrl', 'Please enter a valid Twitter/X profile URL');
    } else {
      clearFieldError('twitterUrl');
    }
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
    if (!validateRequiredField(formData.yearsOfExperience, 'yearsOfExperience')) isValid = false;
    
    // Special validation for expertise array
    if (!formData.expertise || formData.expertise.length === 0) {
      setFieldError('expertise', 'Please select at least one area of expertise');
      isValid = false;
    } else {
      clearFieldError('expertise');
    }
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fix the errors above before submitting');
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      // Create mentor data (following your database schema)
      const mentorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        yearsOfExperience: parseInt(formData.yearsOfExperience.split('-')[0]), // Convert "1-2 years" to 1
        technologies: formData.expertise, // Map expertise to technologies
        description: formData.description || '',
        availability: 'available', // Map to valid enum value
        profileImage: formData.avatar, // Add the selected avatar
        linkedinUrl: formData.linkedinUrl || undefined, // LinkedIn URL
        githubUrl: formData.githubUrl || undefined, // GitHub URL
        websiteUrl: formData.websiteUrl || undefined, // Personal website
        twitterUrl: formData.twitterUrl || undefined, // Twitter/X URL
        profileCompleted: true,
        isActive: true
      };

      console.log('Submitting mentor data:', mentorData);

      const response = await fetch('/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mentorData),
      });

      const result = await response.json();

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message || 'Mentor registered successfully!');
        setShowSuccessBanner(true);
        
        // Store complete user data for profile access and display
        if (result.data && result.data._id) {
          sessionStorage.setItem('currentUserId', result.data._id);
          sessionStorage.setItem('userType', 'mentor');
          sessionStorage.setItem('userFirstName', result.data.firstName);
          sessionStorage.setItem('userLastName', result.data.lastName);
          sessionStorage.setItem('userProfileImage', result.data.profileImage || '');
        }
        
        // Clear form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          yearsOfExperience: '',
          expertise: [],
          description: '',
          availability: 'flexible',
          avatar: defaultAvatar,
          linkedinUrl: '',
          githubUrl: '',
          websiteUrl: '',
          twitterUrl: ''
        });
        
        // Don't clear errors immediately - let user see success message first
        
        // Redirect to mentors page to see all mentors
        setTimeout(() => {
          navigate('/mentors?signupSuccess=1', { replace: true });
        }, 2000);
      } else {
        console.log('Server error response:', result);
        console.log('Setting error to:', result.error);
        const errorMessage = result.error || 'Failed to register mentor';
        setError(errorMessage); // Set in hook
        setLocalError(errorMessage); // Set in local state
        console.log('Error state after setting:', generalError);
        // Don't clear form data on error - let user fix the issue
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle browser back button
  const handleBackNavigation = () => {
    // Save form state to sessionStorage before navigating
    sessionStorage.setItem('mentorSignupForm', JSON.stringify(formData));
    navigate(-1);
  };

  // Restore form state from sessionStorage on component mount
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('mentorSignupForm');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
        // Clear saved data after restoring
        sessionStorage.removeItem('mentorSignupForm');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  // Save form state to sessionStorage when form data changes
  useEffect(() => {
    const hasData = formData.firstName || formData.lastName || formData.email || 
                   formData.password || formData.phone || formData.yearsOfExperience || 
                   formData.expertise.length > 0 || formData.description || 
                   formData.linkedinUrl || formData.githubUrl || formData.websiteUrl || 
                   formData.twitterUrl;
    
    if (hasData) {
      sessionStorage.setItem('mentorSignupForm', JSON.stringify(formData));
    }
  }, [formData]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const hasUnsavedChanges = formData.firstName || formData.lastName || formData.email || 
                             formData.password || formData.phone || formData.yearsOfExperience || 
                             formData.expertise.length > 0 || formData.description || 
                             formData.linkedinUrl || formData.githubUrl || formData.websiteUrl || 
                             formData.twitterUrl;

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData]);

  // Debug: Monitor error state changes
  useEffect(() => {
    console.log('generalError changed to:', generalError);
  }, [generalError]);

  // Debug: Monitor local error state changes
  useEffect(() => {
    console.log('localError changed to:', localError);
  }, [localError]);

  // Check if form is valid for submit button
  const isFormValid = () => {
    // Check all required fields are filled
    const hasRequiredFields = 
      formData.firstName.trim() && 
      formData.lastName.trim() && 
      formData.email.trim() && 
      formData.password.length >= 6 && 
      formData.phone.trim() && 
      formData.yearsOfExperience && 
      formData.expertise.length > 0;
    
    // Check no field errors exist
    const hasNoFieldErrors = 
      !fieldErrors.firstName && 
      !fieldErrors.lastName && 
      !fieldErrors.email && 
      !fieldErrors.password && 
      !fieldErrors.phone && 
      !fieldErrors.yearsOfExperience && 
      !fieldErrors.expertise;
    
    // Check no general errors
    const hasNoGeneralErrors = !hasErrors();
    
    // If form is valid, clear any general errors
    if (hasRequiredFields && hasNoFieldErrors && generalError) {
      setError('');
    }
    
    // Debug logging
    console.log('Form Validation Debug:', {
      hasRequiredFields,
      hasNoFieldErrors,
      hasNoGeneralErrors,
      formData: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.length,
        phone: formData.phone.trim(),
        yearsOfExperience: formData.yearsOfExperience,
        expertise: formData.expertise,
        expertiseLength: formData.expertise.length
      },
      fieldErrors,
      generalError: generalError,
      expertiseCheck: formData.expertise.length > 0
    });
    
    return hasRequiredFields && hasNoFieldErrors && hasNoGeneralErrors;
  };

  // Handle success banner close
  const handleSuccessBannerClose = () => {
    setShowSuccessBanner(false);
  };

  // Handle immediate navigation to mentors
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
            {/* Back Button */}
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Button
                onClick={handleBackNavigation}
                sx={{ 
                  textTransform: 'none',
                  color: (theme) => theme?.palette?.text?.secondary || '#6B4F4F',
                  '&:hover': {
                    color: (theme) => theme?.palette?.text?.primary || '#2C1810'
                  }
                }}
                startIcon={<span>←</span>}
              >
                Back
              </Button>
            </Box>
            
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              textAlign: 'center', 
              color: (theme) => theme?.palette?.primary?.main || '#E8B4B8',
              fontWeight: 600 
            }}>
              Join as a Mentor
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              Share your expertise and help others grow
            </Typography>
          </Box>

          {/* Success Banner */}
          {showSuccessBanner && (
            <SuccessBanner
              title="Welcome to QueenB, Mentor!"
              subtitle="You're now ready to help others grow and succeed. Your expertise will make a real difference in someone's learning journey."
              ctaLabel="View My Profile"
              onCtaClick={() => {
                const userId = sessionStorage.getItem('currentUserId');
                if (userId) {
                  navigate(`/profile/mentor/${userId}`);
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
                View All Mentors
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const userId = sessionStorage.getItem('currentUserId');
                  if (userId) {
                    navigate(`/profile/mentor/${userId}`);
                  }
                }}
              >
                Edit My Profile
              </Button>
            </Box>
          )}

          {/* Error Message */}
          {(localError || generalError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {localError || generalError}
            </Alert>
          )}

          {/* Sign-up Form */}
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Basic Information
                <PersonIcon sx={{ color: 'primary.main' }} />
              </Typography>
              
              <Grid container spacing={2}>
                {/* First Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    name="firstName"
                    label="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.firstName}
                    helperText={fieldErrors.firstName}
                    fullWidth
                    required
                  />
                </Grid>
                
                {/* Last Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    name="lastName"
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.lastName}
                    helperText={fieldErrors.lastName}
                    fullWidth
                    required
                  />
                </Grid>
                
                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    fullWidth
                    required
                  />
                </Grid>
                
                {/* Password */}
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Password *"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    fullWidth
                    required
                  />
                </Grid>
                
                {/* Phone */}
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Avatar Selection */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Profile Picture
                <AccountCircleIcon sx={{ color: 'primary.main' }} />
              </Typography>
              <AvatarPicker
                selectedAvatar={formData.avatar}
                onAvatarSelect={handleAvatarSelect}
                error={fieldErrors.avatar}
                firstName={formData.firstName}
                lastName={formData.lastName}
              />
            </Box>

            {/* Professional Information Section */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Professional Information
                <WorkIcon sx={{ color: 'primary.main' }} />
              </Typography>
              
              <Grid container spacing={2}>
                {/* Years of Experience */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Years of Experience *</InputLabel>
                    <Select
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      label="Years of Experience *"
                      required
                    >
                      {experienceLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Expertise Areas */}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={availableTechnologies}
                    value={formData.expertise}
                    onChange={handleExpertiseChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Areas of Expertise *"
                        placeholder="Select your skills..."
                        helperText={fieldErrors.expertise || "Choose the technologies you're expert in"}
                        error={!!fieldErrors.expertise}
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
                  />
                </Grid>
                
                {/* Availability */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Availability *</InputLabel>
                    <Select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      label="Availability *"
                      required
                    >
                      {availabilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Description */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
              <TextField
                fullWidth
                label="About You & Your Mentoring Style"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                helperText="Tell mentees about your experience and how you like to mentor in our free community"
              />
            </Box>

            {/* Contact Links Section */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: 1, borderColor: 'divider', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Contact Links (Optional)
                <LinkIcon sx={{ color: 'primary.main' }} />
              </Typography>
              
              <Grid container spacing={2}>
                {/* LinkedIn */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    helperText="Your LinkedIn profile URL"
                  />
                </Grid>
                
                {/* GitHub */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="GitHub Profile"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    helperText="Your GitHub profile URL"
                  />
                </Grid>
                
                {/* Personal Website */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Personal Website"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    helperText="Your personal or portfolio website"
                  />
                </Grid>
                
                {/* Twitter/X */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Twitter/X Profile"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourusername"
                    helperText="Your Twitter/X profile URL"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                These links will be displayed on your mentor profile for mentees to contact you
              </Typography>
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
                'Create Mentor Account'
              )}
            </Button>

            {/* Back to Login */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                color="primary"
                onClick={handleBackNavigation}
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

export default MentorSignupPage;
