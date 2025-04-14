import React from "react";
import { Box, Typography } from "@mui/material";
/* The VolunteerTeaching Component */
export default function VolunteerTeaching() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Vice President at Educating Chinese Children Hope Offered (ECCHO)
      </Typography>
      <Typography variant="subtitle1">
        <i>Sept 2019 – May 2022 | Toronto, ON, Canada</i>
      </Typography>

      <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
        During my time with ECCHO, I managed managing everything from outreach
        and event coordination to recruiting and training volunteers, and
        overseeing remote supervision of teaching activities.
      </Typography>
      <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
        In response to the pandemic, I took the lead in launching online
        teaching and mental health programs to make sure children could continue
        learning, while also addressing their emotional well-being during such a
        challenging time.
      </Typography>
    </Box>
  );
}
