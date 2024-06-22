//Main page which will be displayed for /home
import React from "react";
import { Box } from "@mui/material";
import DashboardPage from "./DashboardPage";
import Footer from "./Footer";
import DashboardWidget from "./DashboardWidget";

const HomePage = () => {
  const userType = sessionStorage.getItem("user-type");
  console.log(userType);
  console.log("On Home Page");
  return (
    <Box padding="0" margin="0">
      {userType === "Admin" || userType === "super-admin" ? (
        <DashboardWidget />
      ) : (
        <DashboardPage />
      )}
    </Box>
  );
};

export default HomePage;
