import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  const navigate = useNavigate();
  const openExternalLink = (url) => {
    window.open(url, "_blank");
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="baseline"
      gap="1rem"
      backgroundColor="black"
      color="white"
      padding="4rem"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="1rem"
      >
        <Typography variant="h2">Gandhinagar Address</Typography>
        <Typography variant="h1">
          Main address Near CH '0' Circle, Indulal Yagnik Marg,
          <br />
          Gandhinagar-Ahmedabad Highway, Gandhinagar-382 007 Gujarat, India.
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="1rem"
      >
        <Typography variant="h2">New Delhi Address</Typography>
        <Typography variant="h1">
          Ground Floor Electronics Niketan, MeitY, <br />
          New Delhi-110003
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h2">Connect With Us</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="1rem"
        >
          <IconButton
            sx={{
              color: "white",
            }}
            onClick={() =>
              openExternalLink("https://www.facebook.com/bisagn.meity/")
            }
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
            }}
            onClick={() =>
              openExternalLink("https://twitter.com/bisag_n?lang=en")
            }
          >
            <XIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
            }}
            onClick={() =>
              openExternalLink("https://www.facebook.com/bisagn.meity/")
            }
          >
            <PinterestIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
            }}
            onClick={() =>
              openExternalLink(
                "https://www.linkedin.com/school/bhaskaracharya-institute-for-space-applications-and-geo-informatics/mycompany/"
              )
            }
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
            }}
            onClick={() =>
              openExternalLink("https://www.facebook.com/bisagn.meity/")
            }
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
