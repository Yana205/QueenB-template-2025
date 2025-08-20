import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Container
} from "@mui/material";
import { 
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import SearchBar from "./SearchBar";
import AllMentorsCards from "./AllMentorsCards";

function HomePage() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  //use state to get all mentors from the api
  const [mentorList, setMentorList] = useState([]);
  const [fillteredMentorsList, setfillteredMentorsList] = useState([]);

  // Get current user data from sessionStorage (set after signup)
  const [currentUser, setCurrentUser] = useState({
    id: null,
    firstName: 'User',
    lastName: 'Name',
    profileImage: null
  });

  useEffect(() => {
    // Get complete user data from sessionStorage (set after login)
    const loadUserData = () => {
      const userId = sessionStorage.getItem('currentUserId');
      const userType = sessionStorage.getItem('userType');
      const userFirstName = sessionStorage.getItem('userFirstName');
      const userLastName = sessionStorage.getItem('userLastName');
      const userProfileImage = sessionStorage.getItem('userProfileImage');
      
      console.log('HomePage: Found userId:', userId, 'userType:', userType);
      console.log('HomePage: Found user name:', userFirstName, userLastName);
      console.log('HomePage: Found profile image:', userProfileImage);
      
      if (userId) {
        setCurrentUser(prev => ({ 
          ...prev, 
          id: userId,
          userType: userType || 'mentor', // Default to mentor if not specified
          firstName: userFirstName || 'User',
          lastName: userLastName || 'Name',
          profileImage: userProfileImage || null
        }));
      }
    };

    // Load user data initially
    loadUserData();

    // Listen for custom profile update events
    const handleProfileUpdate = () => {
      console.log('HomePage: Profile update event received, refreshing user data');
      loadUserData(); // Reload user data
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    // Navigate to profile page with user ID and type
    const userType = sessionStorage.getItem('userType') || 'mentor';
    navigate(`/profile/${userType}/${currentUser.id}`);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    
    // Clear all user data from sessionStorage
    sessionStorage.removeItem('currentUserId');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userFirstName');
    sessionStorage.removeItem('userLastName');
    sessionStorage.removeItem('userProfileImage');
    
    // Reset current user state
    setCurrentUser({
      id: null,
      firstName: 'User',
      lastName: 'Name',
      profileImage: null
    });
    
    // Redirect to home page
    navigate('/');
  };

  //fetch all mentors into allMentors list
  //runs only once because of the empty dependency array in useEffect -[]
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch("/api/mentors");
        const data = await response.json();

        if (data.success) {
          setMentorList(data.data);
          setfillteredMentorsList(data.data);
          console.log("Mentors users count = ", data.count);
        } else {
          console.error("Failed to load mentors:", data.error);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  // state for the currently filltered list of mentors that display 
  const handelSearchClick = (searchData) => {
    if (!mentorList || mentorList.length === 0) return;
    if (searchData.category === "" && searchData.text === "") {
      setfillteredMentorsList(mentorList);
      return;
    }
    const searchValue = searchData.text.trim().toLowerCase();

    const filltered = mentorList.filter((mentor) => {
      if (searchData.category === "technologies") {
        return mentor.technologies.some((tech) =>
          tech.toLowerCase().includes(searchValue)
        );
      } else if (searchData.category === "fullName") {
        const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
        return fullName.includes(searchValue);
      } else if (searchData.category === "yearsOfExperience") {
        return String(mentor.yearsOfExperience) === searchValue;
      }
      return;
    });

    if (filltered.length === 0) {
      alert("No mentors found for your search");
      setfillteredMentorsList(mentorList);
      return;
    }

    setfillteredMentorsList(filltered);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        px: 3, 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: 'lg',
          mx: 'auto'
        }}>
          <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
            QueenB Mentorship
          </Typography>
          
          {/* Profile Menu */}
          {currentUser.id && (
            <>
              <IconButton
                size="large"
                edge="end"
                onClick={handleProfileMenuOpen}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                {currentUser.profileImage ? (
                  <Avatar src={currentUser.profileImage} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon sx={{ mr: 1 }} />
                  My Profile ({currentUser.userType || 'mentor'})
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Typography variant="h2">Find Your Mentor</Typography>

          <SearchBar handelSearchClick={handelSearchClick} />

          <AllMentorsCards allMentors={fillteredMentorsList} />
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
