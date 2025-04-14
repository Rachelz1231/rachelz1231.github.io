import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
import VolunteerTeaching from "./volunteerTeaching";
import UnittestTeam from "./unittestTeam";
import LeeLab from "./leeLab";
/* The Publications Component */
export default function Management() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        zIndex: "-999",
        overflow: "hidden",
        px: "5vw",
        py: "150px",
      }}
    >
      <Typography variant="h2">Management and Leaderships</Typography>
      <Divider sx={{ m: 1 }}></Divider>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Research Lead at University of California, Berkeley
        </Typography>
        <Typography variant="subtitle1">
          <i>
            The Donald O. Pederson Center for Electronic Systems Design | Sept
            2024 – Present | Berkeley, CA, USA
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Supervised by Edward Kim, I am designing a user-oriented system that
          assists clinicians in creating rehabilitation exercise curriculums
          tailored to individual patients. The system allows doctors to
          consider patients' goals within their living areas, easily create
          exercises by interacting with Virtual Surroundings, and place virtual
          objects to define tasks without needing coding skills.
        </Typography>
      </Box>
      <LeeLab></LeeLab>
      <UnittestTeam></UnittestTeam>
      <VolunteerTeaching></VolunteerTeaching>
    </Box>
  );
}
