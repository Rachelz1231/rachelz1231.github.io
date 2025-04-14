import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
import publications from "./publications.json";

/* The Publications Component */
export default function Publications() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        zIndex: "-999",
        overflow: "hidden",
        minHeight: "100vh",
        px: "5vw",
        pt: "150px",
      }}
    >
      <Typography variant="h2">Publications</Typography>
      <Divider sx={{ backgroundColor: "white", m: 1 }}></Divider>
      <Box
        sx={{
          textAlign: "left",
          zIndex: "0",
        }}
      >
        {publications.map((pub, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: { xs: "20px", sm: "20px", md: "18px" },
            p: "10px",
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: pub.authors }} /> ({pub.year}).{" "}
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pub.title}
          </a>{" "}
          <i>{pub.venue}</i>
          {pub.note && <> <b>{pub.note}</b></>}
        </Typography>
      ))}
      </Box>
    </Box>
  );
}
