import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [externalEmail, setExternalEmail] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const isForgotPassword = location.pathname === "/forgot-password";
  const isChangePassword = location.pathname === "/change-password";
  const logout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/log-out", {
        email: user.email,
      });
      const { message } = response.data;
      console.log(response);
      console.log(message);
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("user-type");
      window.location.href = "/login";
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value;
    setOtp(value);

    // Display the submit button if the OTP is 4 digits
    if (value.length === 4) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verifyOTP", {
        email: user?.email || externalEmail,
        otp: otp,
      });
      if (response.data.success) {
        toast.success("OTP verification done!");
        setShowPassword(true);
      } else {
        toast.error("Invalid OTP!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length !== 8) {
      toast.error("Password must be 8 characters long");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/updatePassword",
          {
            email: user?.email || externalEmail,
            newPassword: newPassword,
          }
        );
        if (response.data.status === "ok") {
          toast.success("Password changed successfully!");
          logout();
          navigate("/login");
        } else {
          toast.error("Failed to change password!");
        }
      } catch (error) {
        console.error("Error changing password:", error);
      }
    }
  };

  const sendForgotPasswordOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: externalEmail }),
      });
      const result = await response.json();

      if (result.success) {
        // Redirect to the OTP verification page
        setShowOTPInput(true);
      } else {
        // Handle OTP sending failure
        console.log("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {showPassword ? (
        <Paper
          sx={{
            margin: "10rem",
            padding: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Typography variant="h1">Enter your new password</Typography>
          <TextField
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Paper>
      ) : (
        <Paper
          sx={{
            margin: "10rem",
            padding: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {isForgotPassword && ( // Render TextField for external email only if it's forgot password
            <>
              <Typography variant="h1">Please enter your Email ID:</Typography>
              <TextField
                placeholder="Your Email"
                value={externalEmail}
                onChange={(e) => setExternalEmail(e.target.value)}
              />
              <Button variant="contained" onClick={sendForgotPasswordOTP}>
                SEND OTP
              </Button>
            </>
          )}
          {showOTPInput && (
            <>
              <Typography variant="h1">
                Please enter OTP sent to your email id
              </Typography>
              <TextField
                placeholder="4 digit OTP"
                value={otp}
                onChange={handleOTPChange}
              />
            </>
          )}

          {isChangePassword && (
            <>
              <Typography variant="h1">
                Please enter OTP sent to your email id
              </Typography>
              <TextField
                placeholder="4 digit OTP"
                value={otp}
                onChange={handleOTPChange}
              />
            </>
          )}
          {showButton && (
            <Button variant="contained" onClick={handleVerifyOTP}>
              Submit
            </Button>
          )}
        </Paper>
      )}
      <ToastContainer />
    </>
  );
};

export default OTPVerify;
