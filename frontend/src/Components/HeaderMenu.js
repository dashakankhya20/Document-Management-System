import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/bisag-logo3.png";
import "./HeaderMenu.css";
import SearchBar from "./SearchBar";

const HeaderMenu = () => {

  const handleClick = () => {
    window.localStorage.removeItem("loggedIn")
  }
  return (
    <div className="headermenu-container">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Bisag Logo" />
        </Link>
      </div>
      {/* <SearchBar /> */}
      
      <Link to="/login" className="sidemenu-item" onClick={handleClick}>
        <div className="login-btn">
          Logout <i class="fa-solid fa-right-from-bracket"></i>
        </div>
      </Link>
    </div>
  );
};

export default HeaderMenu;
