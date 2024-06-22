import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import "./SideMenu.css";
import { MyContext } from "./MyContext";

const SideMenu = () => {
  const { user } = useContext(MyContext);
  //console.log(user && user.userType);
  return (
    <div className="sidemenu-container">
      <UserProfile  />
      <div className="sidemenu-items">
        <Link to="/forms/all" className="sidemenu-item">
          Forms
        </Link>
        {user && user.userType === "Admin" && (
          <>
            <Link to="/users" className="sidemenu-item">
              Users
            </Link>
            <Link to="/createuser" className="sidemenu-item">
              Create User
            </Link>
            <Link to="/sign-up/adminauth" className="sidemenu-item">
              Create Admin
            </Link>
          </>
        )}
        <Link to="/about" className="sidemenu-item">
          About Us
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
