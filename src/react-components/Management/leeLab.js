import React from "react";
import { Box, Typography } from "@mui/material";
/* The VolunteerTeaching Component */
export default function LeeLab() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Undergraduate Research Team Lead in University of Toronto, Lee Language
        Lab
      </Typography>
      <Typography variant="subtitle1">
        <i>Jan 2023 – May 2024 | Toronto, ON, Canada</i>
      </Typography>
      <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
        I played a key role in coordinating weekly meetings,
        managing agendas, taking meeting notes, and setting up a well-organized
        document system, significantly improved our team's productivity
        and collaboration. Additionally, I was responsible for training and
        mentoring new students, ensuring they transition smoothly into the lab,
        become familiar with the equipment, and quickly get up to speed.
      </Typography>
    </Box>
  );
}
