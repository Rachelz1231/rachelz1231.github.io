import React from "react";
import { Box, Typography, Divider,Paper, Grid, IconButton } from "@mui/material";
import { grey, red, green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
/* The Publications Component */
export default function Contact() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        zIndex: "-999",
        overflow: "hidden",
        px: "5vw",
        py: "150px",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2">Get in Touch</Typography>
      <Typography sx={{ fontSize: { xs: "20px", sm: "20px", md: "18px" } }}>
        I am actively seeking a full-time entry-level software engineer role
        starting May 2025!
      </Typography>
      <Divider sx={{ m: 1 }}></Divider>
      
      <Grid
        className="contact"
        container
        spacing={1}
        direction="row"
        sx={{
          width: "100%",
          // justifyContent: {xs:"left", sm: "center"},
          opacity: 0.8,
        }}
      >
        <Grid item xs={12} sm={6} padding={0}>
          <Paper
            className="contact"
            onClick={() =>
              window.open("https://www.linkedin.com/in/rachel-yuchen-zeng/", "_blank")
            }
            sx={{
              "&:hover": {
                cursor: "pointer",
                scale: "1.04",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
              }}
            >
              LinkedIn
            </Typography>
            <IconButton
              aria-label="linkedIn"
              onClick={() =>
                window.open("https://www.linkedin.com/in/rachel-yuchen-zeng/", "_blank")
              }
            >
              <LinkedInIcon
                sx={{
                  fontSize: { xs: 30, sm: 50, md: 90 },
                  margin: 0,
                  color: `${paletteBlue[2]}`,
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              Rachel Z
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            className="contact"
            onClick={() => window.open("https://github.com/Rachelz1231")}
            sx={{
              "&:hover": {
                cursor: "pointer",
                scale: "1.04",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              Github
            </Typography>
            <IconButton
              aria-label="gitHub"
              onClick={() => window.open("https://github.com/Rachelz1231")}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: 30, sm: 50, md: 90 },
                  color: `${grey[700]}`,
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              Rachelz1231
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} padding={0}>
          <Paper
            className="contact"
            onClick={() => window.open("https://wa.me/15108338855")}
            sx={{
              "&:hover": {
                cursor: "pointer",
                scale: "1.04",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              WhatsApp
            </Typography>
            <IconButton
              aria-label="whatsapp"
              onClick={() => window.open("https://wa.me/15108338855")}
            >
              <WhatsAppIcon
                sx={{
                  fontSize: { xs: 30, sm: 50, md: 90 },
                  color: `${green[400]}`,
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              +1 510 833 8855
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            className="contact"
            onClick={() => window.open("mailto:rachel.zeng@berkeley.edu")}
            sx={{
              "&:hover": {
                cursor: "pointer",
                scale: "1.04",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                display: { xs: "inline-block", sm: "block" },
                //width: { xs: "20vw", sm: "auto" },
              }}
            >
              Email
            </Typography>
            <IconButton
              aria-label="gmail"
              onClick={() => window.open("mailto:rachel.zeng@berkeley.edu")}
            >
              <EmailIcon
                sx={{
                  fontSize: { xs: 30, sm: 50, md: 90 },
                  color: `${red[400]}`,
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "20px",
              }}
            >
              rachel.zeng@berkeley.edu
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
