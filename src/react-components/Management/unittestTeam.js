import React from "react";
import { Box, Typography } from "@mui/material";
/* The VolunteerTeaching Component */
export default function UnittestTeam() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Unittest Lead at Huawei Technologies Canada Ltd.
      </Typography>
      <Typography variant="subtitle1">
        <i>May 2022 – Aug 2023 | Markham, ON, Canada</i>
      </Typography>
      <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
        During my time at Huawei, I led a test group of interns where we focused
        on implementing over 50 G-tests, mock tests, concurrency tests, and
        integration tests. I played a key leadership role in enhancing the
        quality of the product and ensuring that it met rigorous standards.
      </Typography>
    </Box>
  );
}
