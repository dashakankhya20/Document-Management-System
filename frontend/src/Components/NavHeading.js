import React from "react";
import { IconButton, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import QuizIcon from "@mui/icons-material/Quiz";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from "@emotion/react";

const NavHeading = ({ heading }) => {
  const theme = useTheme();
  const { palette } = theme;
  const iconMapping = {
    Dashboard: <HomeIcon />,
    Documents: <AssignmentIcon />,
    Users: <GroupsIcon />,
    Requests: <QuizIcon />,
    "About Us": <InfoIcon />,
    Notifications:<NotificationsIcon/>
  };
  return (
    
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap="0.6rem"
      marginTop="7rem"
    >
      <IconButton
        sx={{
          backgroundColor: palette.primary.main,
        }}
      >
        {iconMapping[heading]}
      </IconButton>
      <Typography component="h4" variant="h4">
        {heading}
      </Typography>
    </Box>
  );
};

export default NavHeading;
