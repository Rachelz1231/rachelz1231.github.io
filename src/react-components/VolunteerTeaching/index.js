import React from "react";
import "./styles.css";
import { Typography, Box, Paper, Divider } from "@mui/material";
// Importing images
import classroom from "./static/classroom.png";
import oakville from "./static/oakville.png";
import teaching from "./static/2022.PNG";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
/* Component for the VolunteerTeaching page */
export default function Education() {
  return (
    <Box
      className="volunteerTeaching"
      sx={{
        flexGrow: 1,
        zIndex: "-999",
        overflow: "hidden",
        px: "5vw",
        py: "150px",
      }}
    >
      <Typography variant="h2">Education</Typography>
      <Divider sx={{ m:1 }}></Divider>
      <Box sx={{ display: "inline-block" }}>
        <Paper
          sx={{
            color: "grey",
            backgroundImage: `url(${oakville})`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            width: "300px",
            height: "200px",
            float: "right",
            marginX: "2vw",
          }}
        ></Paper>
        {/* <figcaption>
              Fig. 1 - Oakville Gallery's summer art camp. Accessed via
              https://www.oakvillegalleries.com/programs/list/kids.
            </figcaption> */}
        <Typography variant="h6" sx={{ margin: "auto" }}>
          The idea of volunteer teaching initially seemed far-fetched to me when
          I was quite young, but it gradually became an integral part of my
          life. My journey into the world of education began in grade 11, and
          I've since dedicated five years to this cause. During high school, I
          volunteered at Oakville Gallery's summer art camp, where I had the
          privilege of teaching children aged 6 to 12. Witnessing the boundless
          potential and creativity of these young minds ignited my passion for
          teaching.
        </Typography>
      </Box>
      <Box sx={{ display: "inline-block", marginBottom: "2vw" }}>
        <Paper
          sx={{
            color: "grey",
            backgroundImage: `url(${classroom})`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            width: "300px",
            height: "200px",
            float: "left",
            marginX: "2vw",
          }}
        ></Paper>
        <Typography variant="h6">
          Growing up in a developing country, I am acutely aware of the
          educational inequalities faced by children worldwide. While Canada
          boasts a robust education system, many children worldwide lack access
          to basic education. From 2019 to 2022, I served as a member of the
          Volunteer Teaching Team for Educating Chinese Children Hope Offered, a
          student club and nonprofit organization. Our mission is to provide
          educational support to underserved children in rural areas of China.
          We established charity shops, organized charity auctions, and promoted
          volunteer events on campus. Each summer, we orchestrated educational
          camps in rural China, fully covering the costs and recruiting
          qualified university students to teach.
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{ display: "inline-block", marginBottom: "2vw" }}
      >
        As the Vice President of the organization, my role was multifaceted. I
        actively sought new volunteer opportunities, forged partnerships with
        local schools in rural China, and oversaw various aspects of volunteer
        engagement. This included providing remote supervision, and ensuring the
        success of volunteer recruitment and training. Our team diligently
        monitored all events in China to ensure their seamless execution.
      </Typography>
      <Box sx={{ display: "inline-block", marginBottom: "2vw" }}>
        <Paper
          sx={{
            color: "grey",
            backgroundImage: `url(${teaching})`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            width: "300px",
            height: "200px",
            float: "right",
            marginX: "2vw",
          }}
        ></Paper>
        <Typography variant="h6">
          The year 2019 presented us with the formidable challenge of the
          COVID-19 pandemic, which forced us to pause or cancel our in-person
          volunteering events in China. However, we refused to be deterred and
          pivoted towards remote volunteer teaching opportunities. We organized
          mental health care initiatives for left-behind children through phone
          calls and successfully hosted remote teaching events through
          pre-recorded videos in the Daliangshan Mountains, Sichuan. In 2022, we
          managed to host a mental health care and volunteer teaching event for
          left-behind children in Linyi, Shandong.
        </Typography>
      </Box>
      <Typography variant="h6">
        Volunteer teaching is not just a phase; it's a lifelong commitment and
        my enduring goal. This objective propels me to continue learning for the
        betterment of future generations. The path of volunteer teaching demands
        persistence and unwavering determination, and I am resolute in doing my
        utmost to contribute to a better world."
      </Typography>
    </Box>
  );
}
