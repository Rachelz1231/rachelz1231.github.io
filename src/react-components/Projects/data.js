import React from "react";
import { Box, Typography, Link } from "@mui/material";
/* The VolunteerTeaching Component */
export default function Data() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4">Data Analysis</Typography>
      <Typography variant="h6" component="div">
        <strong>Product Performance Analysis</strong> |{" "}
        <em>Statistical Methods, R</em>{" "}
        <Link
          href={`${process.env.PUBLIC_URL}/mingar.pdf`}
          target="_blank"
          sx={{ color: "purple" }}
        >
          Pdf
        </Link>{" "}
        <Link
          href="https://github.com/Rachelz1231/Methods-of-Data-Analysis"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography>
        Investigated on MINGAR’s Fitness Tracker's new product line customers,
        and potential wearable device deficiency for MINGAR company.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>College Admissions Analysis</strong> |{" "}
        <em>Statistical Methods, R</em>{" "}
        <Link
          href={`${process.env.PUBLIC_URL}/collegeAdmission.pdf`}
          target="_blank"
          sx={{ color: "purple", mr: 1 }}
        >
          Pdf
        </Link>{" "} 
        <Link
          href="https://youtu.be/nluSvbEiRao"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Video
        </Link>
      </Typography>
      <Typography>
        Admission rates of colleges and universities in the United States can
        vary significantly due to a variety of reasons. We examined factors that
        could potentially impact these admission rates.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>MLS Player Annual Earning Analysis</strong> |{" "}
        <em>Statistical Methods, R</em>{" "}
        <Link
          href={`${process.env.PUBLIC_URL}/mlsReport.pdf`}
          target="_blank"
          sx={{ color: "purple" }}
        >
          Pdf
        </Link>
      </Typography>
      <Typography>
        Explored the relationship between annual earnings of MLS players and
        their performance, constructing a valuable linear regression model for
        the soccer market. This model helps soccer clubs accurately estimate a
        player's value and offers a roadmap for performance improvement to boost
        earnings.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>Factorial Experiment of CPU usage</strong> |{" "}
        <em>Statistical Methods, R</em>{" "}
        <Link
          href={`${process.env.PUBLIC_URL}/facReport.pdf`}
          target="_blank"
          sx={{ color: "purple" }}
        >
          Pdf
        </Link>
      </Typography>
      <Typography>
        As data analysis students who rely on computers daily, we understand
        their significance in our lives. However, we often encounter situations
        where our computers slow down or freeze due to high CPU usage.
        Monitoring CPU usage can help prevent system crashes. To address this
        issue, our study aims to identify the specific tasks that cause high CPU
        usage when running on a computer.
      </Typography>
      <Typography variant="h6" component="div">
        <strong>Evaluating Models and Algorithms for Social Networks</strong>{" "}
        <Link
          href={`${process.env.PUBLIC_URL}/#/research/social-networks`}
          target="_blank"
          sx={{ color: "purple" }}
        >
          Webpage
        </Link>
      </Typography>
      <Typography variant="body2">
        <i>
          Sept 2021 -- Dec 2022 | Individual Research supervised by Professor
          Peter Marbach | Toronto, ON, Canada
        </i>
      </Typography>
      <Typography>
        Designed, implemented, and assessed the performance of six utility
        functions used by over 80,000 users across 12.7 million tweets. This
        resulted in successful experiments that expanded social communities
        through the developed algorithm.
      </Typography>
      <Typography>
        Delivered research findings to an audience of over 100 students and
        professors at the 2022 ROP Fair.
      </Typography>
    </Box>
  );
}
