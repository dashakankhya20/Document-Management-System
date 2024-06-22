import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import NavHeading from "./NavHeading";

const AboutUs = () => {
  console.log("About us");
  const aboutus = () => {
    window.open("https://bisag-n.gov.in/about_us", "_blank");
  };
  return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap="1rem"
    >
      <NavHeading heading="About Us"/>
      <Paper
        sx={{
          padding: "4rem",
          margin:"2rem"
        }}
      >
        <Typography
          variant="h3"
          component="p"
          fontWeight="bold"
          color="primary"
        >
          About BISAG-N
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap="1rem"
        >
          <Typography variant="body1">BISAG-N</Typography>
          <Typography fontStyle="italic" variant="body2">
            Bhaskaracharya National Institute for Space Applications and
            Geo-informatics
          </Typography>
          <Typography>
            Bhaskaracharya National Institute for Space Applications and
            Geo-informatics is an Autonomous Scientific Society registered under
            the Societies Registration Act, 1860 under the MeitY, Government of
            India to undertake technology development & management, research &
            development, facilitate National & International cooperation,
            capacity building and support technology transfer & entrepreneurship
            development in area of geo-spatial technology.
          </Typography>
          <Button variant="contained" onClick={aboutus}>
            Read More
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AboutUs;
