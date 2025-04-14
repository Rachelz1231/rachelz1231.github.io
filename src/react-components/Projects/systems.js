import React from "react";
import { Box, Typography, Link } from "@mui/material";
/* The VolunteerTeaching Component */
export default function Systems() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4">Systems</Typography>
      <Typography variant="h6" component="div">
        <strong>Fault-tolerant Key-value Service</strong> | <em>C++</em>{" "}
        <Link
          href="https://github.com/Rachelz1231/Fault-tolerant-key-value-service"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography variant="body2">
        <i>Jan 2023 - May 2024</i>
      </Typography>
      <Typography>
        Implemented a distributed key-value (KV) store system with replication
        across multiple servers and crash recovery mechanism, designed to handle
        concurrent client requests efficiently.
      </Typography>
      <Typography>
        Detailed the design decisions and implementation strategies in
        documentation, addressing conceptual challenges and optimizing system
        performance.
      </Typography>

      <Typography variant="h6" component="div">
        <strong>Key-value Database System</strong> | <em>C++</em>{" "}
        <Link
          href="https://github.com/Rachelz1231/Key-Value-Database"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography variant="body2">
        <i>Sept 2023 - Dec 2023</i>
      </Typography>
      <Typography>
        Developed a multi-stage database system, implementing in-memory
        structures and persistent storage mechanisms.
      </Typography>
      <Typography>
        Enhanced system performance by integrating buffer pools with LRU
        eviction, static B-Trees, and an LSM-tree featuring Bloom filters to
        optimize data retrieval and reduce disk I/O.
      </Typography>

      <Typography variant="h6" component="div">
        <strong>Parallel-Memory-Allocator</strong>{" "}
        <Link
          href="https://github.com/Rachelz1231/Parallel-Memory-Allocator"
          target="_blank"
          sx={{ color: "purple" }}
        >
          Git
        </Link>
      </Typography>
      <Typography>
        In our study of system designs, we focused on key areas: speed,
        scalability, avoidance of false sharing, and minimal fragmentation. To
        explore these concepts, we developed our own parallel memory allocator.
      </Typography>
      <Typography>
        This project discusses its design, implementation details, and
        performance evaluations.
      </Typography>
    </Box>
  );
}
