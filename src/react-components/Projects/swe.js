import React from "react";
import { Box, Typography, Link } from "@mui/material";
/* The VolunteerTeaching Component */
export default function Swe() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4">Software Engineering</Typography>
      <Typography variant="h6" component="div">
        <strong>Telemedicine for Stroke Rehabilitation</strong>
      </Typography>
      <Typography variant="body2" >
        <i>Sept 2024 - Present</i>
      </Typography>
      <Typography>
        I am designing a user-oriented system that assists clinicians in
        creating rehabilitation exercise curriculums tailored to individual
        patients. The system allows doctors to consider patients' goals within
        their living areas, easily create exercises by interacting with Virtual
        Surroundings, and place virtual objects to define tasks without needing
        coding skills.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>Personal Writing Assistant</strong>{" "}
        <Link
          href="https://github.com/Rachelz1231/Rightee-AI-Writing-Assistant"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography>
        A writing assistant designed to enhance users' writing by offering
        valuable suggestions rather than completely rewriting the content
        through AI. Unlike AI-generated rewrites that often use overly fancy
        terms and can sound inauthentic, Rightee focuses on maintaining the
        writer’s voice.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>Moba Tracker Web App</strong> |{" "}
        <em>Javascript, HTML/CSS, React.js, Node.js</em>{" "}
        <Link
          href="https://github.com/Rachelz1231/Moba-Tracker-Web-App"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography>
        Developed a web application enabling user registration, admin
        governance, profile management, and interactive forums.
      </Typography>
      <Typography>
        Implemented features for game performance tracking, including detailed
        statistical analyses of win rates and champion usage.
      </Typography>
    </Box>
  );
}
