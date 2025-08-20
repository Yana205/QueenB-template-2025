import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Link as LinkIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { avatarOptions, generateCustomAvatar } from '../auth/avatarOptions';

const ProfilePage = () => {
  const { id, userType } = useParams();
  const navigate = useNavigate();
  
  // Profile data state - will be populated based on user type
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
    profileImage: ''
  });
  
  // Mentor-specific fields
  const [mentorData, setMentorData] = useState({
    technologies: [],
    yearsOfExperience: '',
    availability: 'available',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
    twitterUrl: ''
  });
  
  // Mentee-specific fields
  const [menteeData, setMenteeData] = useState({
    lookingFor: [],
    profileCompleted: false
  });
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Available options
  const availableTechnologies = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'DevOps', 'Machine Learning', 'AI',
    'Data Science', 'Mobile Development', 'iOS', 'Android', 'Flutter',
    'Ruby on Rails', 'PHP', 'Laravel', 'Swift', 'Kotlin', 'Rust',
    'Go', 'Scala', 'Elixir', 'GraphQL', 'REST APIs', 'Microservices'
  ];
  
  const experienceLevels = [
    '1-2 years', '3-5 years', '5-8 years', '8-12 years', '12+ years'
  ];
  
  const availabilityOptions = [
    { value: 'available', label: 'Available for mentoring' },
    { value: 'part-time', label: 'Part-time (few hours/week)' },
    { value: 'full-time', label: 'Full-time (dedicated mentor)' },
    { value: 'flexible', label: 'Flexible (as needed)' }
  ];

  // Determine user type from URL params, otherwise check sessionStorage
  const getUserType = () => {
    // Check if userType is in URL params
    if (userType && (userType === 'mentor' || userType === 'mentee')) {
      return userType;
    }
    // Fallback to sessionStorage or default to mentor
    return sessionStorage.getItem('userType') || 'mentor';
  };

  const currentUserType = getUserType();
  const isMentor = currentUserType === 'mentor';
  const isMentee = currentUserType === 'mentee';

  // Fetch profile data on component mount
  useEffect(() => {
    // Only fetch data if we have a valid ID and user type
    if (id && currentUserType) {
      fetchProfileData();
    }
  }, [id, currentUserType]);

  // Cleanup effect to prevent API calls after deletion
  useEffect(() => {
    return () => {
      // Cleanup function - this runs when component unmounts
      // This prevents any pending API calls from continuing
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const endpoint = currentUserType === 'mentor' ? `/api/mentors/${id}` : `/api/mentees/${id}`;
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (result.success) {
        const data = result.data;
        
        // Set common profile data
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          description: data.description || '',
          profileImage: data.profileImage || ''
        });
        
        if (currentUserType === 'mentor') {
          // Set mentor-specific data
          setMentorData({
            technologies: data.technologies || [],
            yearsOfExperience: data.yearsOfExperience || '',
            availability: data.availability || 'available',
            linkedinUrl: data.linkedinUrl || '',
            githubUrl: data.githubUrl || '',
            websiteUrl: data.websiteUrl || '',
            twitterUrl: data.twitterUrl || ''
          });
        } else {
          // Set mentee-specific data
          setMenteeData({
            lookingFor: data.lookingFor || [],
            profileCompleted: data.profileCompleted || false
          });
        }
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (currentUserType === 'mentor' && mentorData.hasOwnProperty(name)) {
      setMentorData(prev => ({ ...prev, [name]: value }));
    } else if (currentUserType === 'mentee' && menteeData.hasOwnProperty(name)) {
      setMenteeData(prev => ({ ...prev, [name]: value }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTechnologyChange = (event) => {
    const { value } = event.target;
    if (currentUserType === 'mentor') {
      setMentorData(prev => ({
        ...prev,
        technologies: typeof value === 'string' ? value.split(',') : value
      }));
    } else {
      setMenteeData(prev => ({
        ...prev,
        lookingFor: typeof value === 'string' ? value.split(',') : value
      }));
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setProfileData(prev => ({
      ...prev,
      profileImage: avatarUrl
    }));
    setShowAvatarPicker(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      // Prepare data to send
      const dataToSend = {
        ...profileData,
        ...(currentUserType === 'mentor' ? mentorData : menteeData)
      };
      
      const endpoint = currentUserType === 'mentor' ? `/api/mentors/${id}` : `/api/mentees/${id}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Refresh profile data
        await fetchProfileData();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError('');
      
      const endpoint = currentUserType === 'mentor' ? `/api/mentors/${id}` : `/api/mentees/${id}`;
      console.log('🗑️ Attempting to delete account:', { id, currentUserType, endpoint });
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });
      
      console.log('🗑️ Delete response status:', response.status);
      const result = await response.json();
      console.log('🗑️ Delete response result:', result);
      
      if (result.success) {
        setSuccess('Account deleted successfully');
        console.log('✅ Account deleted successfully, clearing session data...');
        
        // Clear all stored user data immediately
        sessionStorage.removeItem('currentUserId');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('userFirstName');
        sessionStorage.removeItem('userLastName');
        sessionStorage.removeItem('userProfileImage');
        
        // Set loading to prevent any further API calls
        setIsLoading(true);
        
        // Redirect to welcome page immediately
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Failed to delete account');
        console.error('❌ Failed to delete account:', result.error);
      }
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    fetchProfileData();
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Check if user exists and hasn't been deleted
  if (!id || !currentUserType) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="text.secondary">
            User not found or account has been deleted
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, color: 'primary.main' }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {isMentor ? 'Manage your mentor profile and account settings' : 'Manage your mentee profile and account settings'}
        </Typography>
        <Chip 
          label={isMentor ? 'Mentor' : 'Mentee'} 
          color={isMentor ? 'primary' : 'secondary'} 
          sx={{ mt: 2 }}
        />
        
        {/* Navigation Buttons */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/mentors')}
            sx={{ 
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.light'
              }
            }}
          >
            Back to Mentors
          </Button>
        </Box>
      </Box>

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Profile Form */}
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Avatar Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={profileData.profileImage || generateCustomAvatar(profileData.firstName, profileData.lastName)}
              alt="Profile"
              sx={{ 
                width: 120, 
                height: 120, 
                border: '3px solid',
                borderColor: 'primary.light',
                boxShadow: 3
              }}
            />
            {isEditing && (
              <IconButton
                onClick={() => setShowAvatarPicker(true)}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          
          {isEditing && (
            <Button
              variant="outlined"
              onClick={() => setShowAvatarPicker(true)}
              sx={{ mt: 2 }}
            >
              Change Avatar
            </Button>
          )}
        </Box>

        {/* Basic Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Basic Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={profileData.firstName}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={profileData.lastName}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                value={profileData.email}
                fullWidth
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                value={profileData.phone}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Role-Specific Information */}
        {isMentor ? (
          // Mentor-specific sections
          <>
            {/* Professional Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" />
                Professional Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Years of Experience</InputLabel>
                    <Select
                      name="yearsOfExperience"
                      value={mentorData.yearsOfExperience}
                      onChange={handleInputChange}
                      label="Years of Experience"
                    >
                      {experienceLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Availability</InputLabel>
                    <Select
                      name="availability"
                      value={mentorData.availability}
                      onChange={handleInputChange}
                      label="Availability"
                    >
                      {availabilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Technologies & Skills</InputLabel>
                    <Select
                      multiple
                      name="technologies"
                      value={mentorData.technologies}
                      onChange={handleTechnologyChange}
                      label="Technologies & Skills"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {availableTechnologies.map((tech) => (
                        <MenuItem key={tech} value={tech}>
                          {tech}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Contact Links Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon color="primary" />
                Contact Links
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="linkedinUrl"
                    label="LinkedIn Profile"
                    value={mentorData.linkedinUrl || ''}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="githubUrl"
                    label="GitHub Profile"
                    value={mentorData.githubUrl || ''}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    placeholder="https://github.com/yourusername"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="websiteUrl"
                    label="Personal Website"
                    value={mentorData.websiteUrl || ''}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="twitterUrl"
                    label="Twitter/X Profile"
                    value={mentorData.twitterUrl || ''}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!isEditing}
                    placeholder="https://twitter.com/yourusername"
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          // Mentee-specific sections
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              Learning Goals
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Technologies I Want to Learn</InputLabel>
                  <Select
                    multiple
                    name="lookingFor"
                    value={menteeData.lookingFor}
                    onChange={handleTechnologyChange}
                    label="Technologies I Want to Learn"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {availableTechnologies.map((tech) => (
                      <MenuItem key={tech} value={tech}>
                        {tech}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Description Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMentor ? <WorkIcon color="primary" /> : <SearchIcon color="primary" />}
            {isMentor ? 'About Me' : 'What I\'m Looking For'}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="description"
                label={isMentor ? 'About Me' : 'What I\'m Looking For'}
                value={profileData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                disabled={!isEditing}
                placeholder={
                  isMentor 
                    ? "Tell others about your experience, expertise, and what you can help with..."
                    : "Describe what you're looking to learn, your current skill level, and what kind of mentorship you need..."
                }
              />
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              size="large"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
                size="large"
              >
                {isSaving ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={isSaving}
                size="large"
              >
                Cancel
              </Button>
            </>
          )}
        </Box>

        {/* Danger Zone */}
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Danger Zone
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Once you delete your account, there is no going back. Please be certain.
          </Typography>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setShowDeleteDialog(true)}
            size="large"
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      {/* Avatar Picker Dialog */}
      <Dialog
        open={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Choose Your Avatar</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 2, mt: 2 }}>
            {avatarOptions.map((avatar) => (
              <Box
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.url)}
                sx={{
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 2,
                  border: 2,
                  borderColor: profileData.profileImage === avatar.url ? 'primary.main' : 'divider',
                  bgcolor: profileData.profileImage === avatar.url ? 'primary.light' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light'
                  }
                }}
              >
                <Avatar
                  src={avatar.url}
                  alt={avatar.name}
                  sx={{ width: 60, height: 60, mx: 'auto' }}
                />
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  {avatar.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAvatarPicker(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data, including your profile, will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
