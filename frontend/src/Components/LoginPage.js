import React, { useState } from "react";
import {
  Paper,
  InputLabel,
  TextField,
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import bisagLogo from "../images/bisag_logo.png";
import bgImage from "../images/bisag_bgImage.jpg";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { palette } = useTheme();
  const primary_color = palette.primary.main;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your email id!");
    } else if (password === "") {
      toast.error("Please enter your password!");
    } else if (password.length !== 8) {
      toast.error("Please enter 8 digit password!");
    } else {
      try {
        const result = await axios.post("http://localhost:5000/login-user", {
          email,
          password,
        });
        const response = await result.data;

        console.log(response.user);
        if (response.status === "ok") {
          sessionStorage.setItem("isLoggedIn", response.user.isLoggedIn);
          sessionStorage.setItem("user", JSON.stringify(response.user));
          sessionStorage.setItem("user-type", response.user.userType);
          // alert("Successfully LoggedIn!");
          window.location.href = "/";
        } else {
          toast.error("Invalid credentials!");
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  console.log(typeof isLoggedIn);
  const user = sessionStorage.getItem("user");
  console.log(user);

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        sx={{
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          margin: "4rem",
        }}
      >
        <Box height="5rem" width="15rem">
          {/* <img
            src={bisagLogo}
            alt="Bisag Logo"
            width="100%"
            height="100%"
            style={{
              objectFit: "contain",
            }}
            
          /> */}
          <Typography
            textAlign="center"
            variant="h4"
            width="100%"
            color={primary_color}
          >
            Login Page
          </Typography>
        </Box>
        <Box width="40rem">
          <InputLabel>Enter Your Email:</InputLabel>
          <TextField
            placeholder="Email ID"
            autoFocus
            autoComplete="off"
            required
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Box>
        <Box width="40rem">
          <InputLabel>Enter Your Password:</InputLabel>
          <TextField
            placeholder="Password"
            autoFocus
            autoComplete="off"
            required
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Link to="/forgot-password">
            <Typography variant="h7" color="red">
              Forgot Password?
            </Typography>
          </Link>
        </Box>

        <Button variant="contained" type="submit" onClick={handleSubmit}>
          LOGIN
        </Button>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default LoginPage;
