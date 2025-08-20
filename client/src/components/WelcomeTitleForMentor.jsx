import React from "react";
import { Box, Typography } from "@mui/material";

function WelcomeTitleForMentor({ mentorName }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">Hi {mentorName}, </Typography>
      <Typography variant="h2">meet your fellow mentors </Typography>
    </Box>
  );
}

export default WelcomeTitleForMentor;