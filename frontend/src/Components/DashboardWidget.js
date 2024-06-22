import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import NavHeading from "./NavHeading";
import axios from "axios";
import CircularIndeterminate from "./CircularProgress";

const DashboardWidget = () => {
  const [keyMetrics, setKeyMetrics] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const adminDashboardKeyMetrics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getKeyMetricsForAdminDashboard"
        );
        const { data } = response;
        setKeyMetrics(data);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching key metrics:", error);
      }
    };

    adminDashboardKeyMetrics();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  return keyMetrics ? (
    <>
      <NavHeading heading="Dashboard" />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap="3rem"
        margin="2rem"
      >
        {/* Total documents */}
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper1,
          }}
        >
          <Typography component="h2" variant="h2">
            Uploaded Documents
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalDocumentsUploaded}
          </Typography>
        </Paper>
        {/* Draft */}
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper2,
          }}
        >
          <Typography component="h2" variant="h2">
            Private Documents
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalDraftDocuments}
          </Typography>
        </Paper>
        {/* For approval */}
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper3,
          }}
        >
          <Typography component="h2" variant="h2">
            Requests
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalRequests}
          </Typography>
        </Paper>
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper4,
          }}
        >
          <Typography component="h2" variant="h2">
            Total Users
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalNonAdminUsers}
          </Typography>
        </Paper>
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper5,
          }}
        >
          <Typography component="h2" variant="h2">
            Online Users
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalOnlineUsers}
          </Typography>
        </Paper>
        <Paper
          sx={{
            width: "20rem",
            height: "15rem",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            backgroundColor: theme.palette.primary.paper6,
          }}
        >
          <Typography component="h2" variant="h2">
            Total admins
          </Typography>
          <Typography component="h5" variant="h5">
            {keyMetrics.totalAdminUsers}
          </Typography>
        </Paper>
      </Box>
    </>
  ) : (
    <CircularIndeterminate />
  );
};

export default DashboardWidget;
