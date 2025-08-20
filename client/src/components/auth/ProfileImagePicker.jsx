import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const ProfileImagePicker = ({ onImageSelect, open, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Collection of profile images
  const profileImages = [
    {
      id: 1,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0YIKgjCGBqjH8qbrmYoticIccFZGlw2rOtGKKIe9sTRdj8Ur0HyDEe3KVjVPz114DpJM&usqp=CAU',
      name: 'Profile 1'
    },
    {
      id: 2,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6IdAbsEc7WHa_2vJqWhiRKxksCE06rrCRossqPgRa_junZOB1tdcwB52cs3CPvov9IVk&usqp=CAU',
      name: 'Profile 2'
    },
    {
      id: 3,
      url: 'https://i.pinimg.com/564x/c1/45/9e/c1459e3a8e8049f8d4d5962c57509432.jpg',
      name: 'Profile 3'
    },
    {
      id: 4,
      url: 'https://i.pinimg.com/564x/8a/2a/bb/8a2abb6c8d8049e52314d791b9c20ac0.jpg',
      name: 'Profile 4'
    }
  ];

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelect(selectedImage.url);
      onClose();
      setSelectedImage(null);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Choose Your Profile Picture
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select a profile picture from the options below. You can change this later in your profile settings.
        </Typography>

        <Grid container spacing={2}>
          {profileImages.map((image) => (
            <Grid item xs={6} sm={4} md={3} key={image.id}>
              <Paper
                elevation={selectedImage?.id === image.id ? 8 : 2}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  border: selectedImage?.id === image.id ? '3px solid' : '1px solid',
                  borderColor: selectedImage?.id === image.id ? 'primary.main' : 'divider',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 4,
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={() => handleImageSelect(image)}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  
                  {selectedImage?.id === image.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckIcon />
                    </Box>
                  )}
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    mt: 1,
                    fontWeight: selectedImage?.id === image.id ? 'bold' : 'normal'
                  }}
                >
                  {image.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          disabled={!selectedImage}
        >
          Use This Picture
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileImagePicker;
