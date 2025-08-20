import React, { useState } from "react";
import { Card, Typography, CardContent, CardMedia, Box } from "@mui/material";
import MentorDialog from "./MentorDialog";
import MentorFullName from "./mentor/MentorFullName";
import MentorTechnologies from "./mentor/MentorTechnologies";

function MentorCard({ mentor }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          height: 300,
          width: 300,
          maxHeight: 300,
          maxWidth: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardMedia
          sx={{ height: 150, width: 120 }}
          image={mentor.profileImage}
          title="mentor-photo"
        />

        <CardContent>
          <MentorFullName mentor={mentor} />
          <MentorTechnologies mentor={mentor} />
        </CardContent>

        {/* Click to open dialog */}
        <Box 
          onClick={() => setOpen(true)}
          sx={{ 
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            py: 1,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Click to see contact info
          </Typography>
        </Box>
      </Card>

      {/* click on mentor card will open dialog with the mentor contact card */}
      <MentorDialog
        open={open}
        onClose={() => setOpen(false)}
        mentor={mentor}
      />
    </>
  );
}
export default MentorCard;
