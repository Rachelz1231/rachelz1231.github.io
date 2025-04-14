import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
import Systems from "./systems";
import Data from "./data";
import Swe from "./swe";
/* The Publications Component */
export default function Projects() {
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
      <Typography variant="h2">Projects</Typography>
      <Divider sx={{ m: 1 }}></Divider>
      <Systems></Systems>
      <Swe></Swe>
      <Data></Data>
    </Box>
  );
}
