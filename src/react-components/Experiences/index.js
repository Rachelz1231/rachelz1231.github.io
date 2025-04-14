import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
/* The Publications Component */
export default function Experiences() {
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
      <Typography variant="h2">Experiences</Typography>
      <Divider sx={{ m: 1 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Software Developer, Lead Researcher at UC Berkeley
        </Typography>
        <Typography variant="subtitle1">
          <i>
            Cognition and Computation in Design Lab + Pederson Center for
            Electronic Systems Design | Sept 2024 – Present | Berkeley, CA
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Led development of a Chrome extension with TypeScript, React, and
          Flask integrating generative AI for visual stimuli research. Built a
          personalized AR rehabilitation task authoring tool using Unity on Meta
          Quest 3. Created a compliant EMR web system using React, Next.js,
          Node.js, and Firebase. Hosted cloud infrastructure on AWS, integrating
          CI/CD with Jenkins and Docker.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Software Developer, Lead Researcher at University of Toronto
        </Typography>
        <Typography variant="subtitle1">
          <i>
            Intelligent Adaptive Interventions Lab | Aug 2023 – May 2024 |
            Toronto, ON
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Deployed full-stack SaaS tools using GPT-4 and LLMs to support youth
          in mental health and creative writing. Developed apps with React.js,
          NestJS, Flask, and MongoDB for iOS, Android, and Web. Led user studies
          and co-authored 3 peer-reviewed papers, including CHI submissions.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Distributed System Engineer at Huawei Technologies Canada
        </Typography>
        <Typography variant="subtitle1">
          <i>
            Distributed Data and Storage Management Lab | May 2022 – Aug 2023 |
            Markham, ON
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Developed core database features in C/C++ for GaussDB
          (PostgreSQL-based), including LRU cache, consistent hashing, and
          B-/LSM-trees. Achieved a 150% tpmC performance boost via TPC-C
          benchmarking. Designed 50+ tests simulating distributed system edge
          cases. Presented architecture insights to 40+ engineers using
          KVM-based environments.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Machine Learning Engineer, Lead Researcher at University of Toronto
        </Typography>
        <Typography variant="subtitle1">
          <i>Lee Language Lab | Jan 2023 – May 2024 | Toronto, ON</i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Conducted 100+ ML experiments optimizing translation models like
          mBART, mT5, XLM-R. Boosted BLEU scores by 20% for low-resource
          languages through task transfer learning. Led project management
          across the full research lifecycle, coordinating cross-functional
          efforts.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Researcher at University of Toronto
        </Typography>
        <Typography variant="subtitle1">
          <i>
            Evaluating Models and Algorithms for Social Networks | Sept 2021 –
            Dec 2022 | Toronto, ON
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Designed and tested six utility functions used on datasets of over
          12.7M tweets. Improved algorithms for expanding online communities.
          Presented findings at the 2022 ROP Fair to 100+ attendees, including
          faculty and students.
        </Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Researcher at University of Toronto
        </Typography>
        <Typography variant="subtitle1">
          <i>
            Evaluating Models and Algorithms for Social Networks supervised by Prof.Peter Marbach | Sept 2021 –
            Dec 2022 | Toronto, ON, Canada
          </i>
        </Typography>
        <Typography sx={{ fontSize: { xs: "3vw", sm: "20px", lg: "20px" } }}>
          Designed, implemented, and assessed the performance of six utility functions for defining social network hierarchies,
          which were applied to over 80,000 users and 12.7 million tweets. Presented research findings
          to an audience of over 100 students and professors at the 2022
          Research Opportunities Program Fair.
        </Typography>
      </Box>
    </Box>
  );
}
