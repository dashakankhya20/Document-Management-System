import React, { useContext } from "react";
// import Navbar from './Navbar';
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";
import UserHome from "./userHome";
import UserProfile from "./UserProfile";
import SideMenu from "./SideMenu";
import HeaderMenu from "./HeaderMenu";
import DashboardPage from "./DashboardPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { MyContext } from "./MyContext";

const Dashboard = () => {
  const [userData, setUserData] = useState("");
  const [isadmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [showPage, setShowPage] = useState(false);
  const { user, setUser } = useContext(MyContext);

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data, "userData");
        if (data.data && data.data.userType === "Admin") {
          setIsAdmin(true);
        }

        setUserData(data.data);
        setUser(data.data);
        //console.log(user)
        if (data.data === "token expired") {
          alert("Token expired login again");
          window.localStorage.clear();
          window.location.href = "./";
        }
      });
  }, [user]);

  return (
    <>
      {/* <Navbar/> */}
      <HeaderMenu />
      <div className="dashboard">
        <SideMenu  />
        <div className="dashboard-main">
        {path == '/' ? (
          <DashboardPage />
        ) : (
          <Outlet />
        )}
          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
