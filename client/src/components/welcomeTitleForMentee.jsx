import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

function WelcomeTitleForMentee({menteeName}){
return(
    <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h2">Hi {menteeName}, </Typography>
            <Typography variant="h2">
              your perfect mentor is just a click away
            </Typography>
          </Box>
);
}

export default WelcomeTitleForMentee;
