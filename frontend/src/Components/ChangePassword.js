import React, { useState } from "react";
import { Button, Box, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleSendOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });
      const result = await response.json();

      if (result.success) {
        // Redirect to the OTP verification page

        navigate("/change-password");
      } else {
        // Handle OTP sending failure
        console.log("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="error" onClick={handleSendOTP}>
        Change Password?
      </Button>
    </Box>
  );
};

export default ChangePassword;
