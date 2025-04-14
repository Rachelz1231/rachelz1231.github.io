import { Box, Typography } from "@mui/material";
import React from "react";

/* The Footer Component */
class Footer extends React.Component {
  render() {
    const { title, subtitle } = this.props;
    return (
      <Box sx={{ marginTop: { xs: "20px" } }}>
        {/* <Typography className="footer">BUILT FROM SCRATCH BY ME :)</Typography> */}
      </Box>
    );
  }
}

export default Footer;
