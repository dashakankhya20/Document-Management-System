import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import App from "./Components/App";
import AboutUs from "./Components/AboutUs";
import HomePage from "./Components/HomePage";
import UserManagement from "./Components/UserManagement";
import Profile from "./Components/Profile";
import LoginPage from "./Components/LoginPage";
import LayoutPage from "./Components/LayoutPage";
import UserRequests from "./Components/UserRequests";
import Notifications from "./Components/Notifications";
import OTPVerify from "./Components/OTPVerify";


const Main = () => {
  // Check if loggedIn is already set in localStorage
  const isLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn"));
  console.log(isLoggedIn);
  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <Route path="/login" element={<LoginPage />} />
        ) : (
          <Route element={<LayoutPage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<App />} />
            <Route path="/users" element={<UserManagement />} />
            {/* <Route path="/admin" element={<SignUp />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/requests" element={<UserRequests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/change-password" element={<OTPVerify />} />
          </Route>
        )}
        <Route path="/forgot-password" element={<OTPVerify />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
