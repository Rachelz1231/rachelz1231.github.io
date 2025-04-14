import React from "react";
import { useRef } from "react";
import profilePhoto from "./static/profile-photo.jpg";
import { Box, Typography, Zoom, Paper, Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
/* The AboutMe Component */
export default function AboutMe() {
  const aboutMeInfoBox = useRef(null);
  return (
    <Box
      className="aboutMe"
      sx={{ width: "100%", height: { xs: "840px", lg: "840px" } }}
    >
      <Zoom
        in={true}
        style={{ transitionDuration: "900ms", transitionDelay: "300ms" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: { xs: "100vw" },
            py: "10vw",
            pt: "110px",
          }}
        >
          <Paper
            className="aboutMePhoto"
            sx={{
              borderRadius: "50%",
              border: 5,
              backgroundImage: `url(${profilePhoto})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              width: { xs: "30vw", md: "240px" },
              height: { xs: "30vw", md: "240px" },
            }}
          ></Paper>
        </Box>
      </Zoom>
      <Zoom in={true} style={{ transitionDuration: "900ms" }}>
        <Box
          className="aboutMeInfoBox"
          ref={aboutMeInfoBox}
          sx={{
            backgroundColor: "transparent",
            textAlign: "center",
            zIndex: "0",
            paddingLeft: { xs: "5vw", md: "20vw", lg: "20vw" },
            paddingRight: { xs: "5vw", md: "20vw", lg: "20vw" },
          }}
        >
          <Zoom
            in={true}
            style={{ transitionDuration: "700ms", transitionDelay: "200ms" }}
          >
            <Typography
              sx={{
                fontSize: "36px",
              }}
            >
              Hello! It's me,
            </Typography>
          </Zoom>
          <Zoom
            in={true}
            style={{ transitionDuration: "700ms", transitionDelay: "200ms" }}
          >
            <Typography
              sx={{
                fontSize: "63px",
                py: "0",
              }}
            >
              Rachel Zeng.
            </Typography>
          </Zoom>

          <Zoom
            in={true}
            style={{ transitionDuration: "700ms", transitionDelay: "200ms" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "20px", md: "18px" },
                px: {
                  xl: "20px",
                  lg: "75px",
                  md: "20px",
                  sm: "10px",
                  xs: "10px",
                },
              }}
            >
              I am currently pursuing a Master of Engineering at UC Berkeley.
              Before that, I earned my Bachelor's degree in Computer Science
              from the University of Toronto, focusing on distributed systems
              and web development.
              <br />
              <br />I have a deep passion for technology in all its
              forms—whether it is studying systems, building them, or
              understanding the people who will use them.
            </Typography>
          </Zoom>
          <Zoom
            in={true}
            style={{ transitionDuration: "700ms", transitionDelay: "200ms" }}
          >
            <a
              href="/Yuchen_Zeng_resume.pdf"
              download
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                aria-label="email"
                sx={{ m: 2 }}
              >
                Resume
              </Button>
            </a>
          </Zoom>
        </Box>
      </Zoom>
    </Box>
  );
}
