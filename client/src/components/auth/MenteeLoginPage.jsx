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
  Divider
} from '@mui/material';
import authService from '../../services/authService';

const MenteeLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simple authentication - check against mentee database
      const response = await fetch('/api/mentees');
      const data = await response.json();

      if (data.success) {
        // Find mentee with matching email and password
        const mentee = data.data.find(mentee => 
          mentee.email === formData.email && 
          mentee.password === formData.password
        );

        if (mentee) {
          // Login successful - set sessionStorage and redirect to mentors page
          console.log('Mentee login successful:', mentee.firstName);
          
          // Store complete user data in sessionStorage for profile access and display
          sessionStorage.setItem('currentUserId', mentee._id);
          sessionStorage.setItem('userType', 'mentee');
          sessionStorage.setItem('userFirstName', mentee.firstName);
          sessionStorage.setItem('userLastName', mentee.lastName);
          sessionStorage.setItem('userProfileImage', mentee.profileImage || '');
          
          // Redirect to mentors page
          navigate('/mentors');
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup/mentee');
  };

  const isFormValid = formData.email && formData.password;

  return (
    <Container maxWidth="sm">
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
            p: 4,
            width: '100%',
            maxWidth: 400,
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
              Mentee Login
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              Welcome back! Sign in to continue
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                autoComplete="email"
                autoFocus
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid || isLoading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Sign Up Button */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleSignUp}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderColor: 'secondary.main',
              color: 'secondary.main',
              '&:hover': {
                borderColor: 'secondary.dark',
                backgroundColor: 'rgba(200, 216, 208, 0.08)',
              }
            }}
          >
            Create New Account
          </Button>

          {/* Back to Welcome */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              color="primary"
              onClick={() => navigate('/')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                p: 0,
                minWidth: 'auto'
              }}
            >
              ← Back to Welcome
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MenteeLoginPage;
