
import React, { useState } from "react";
import { Card, Typography, CardContent, CardMedia } from "@mui/material";
import MentorDialog from "./MentorDialog";
import MentorFullName from "./mentor/MentorFullName";
import MentorTechnologies from "./mentor/MentorTechnologies";

function MentorCard({ mentor }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
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
