import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/bisag-logo3.png";
import "./Navbar.css";

const Navbar = () => {
  const [click, setClick] = useState(true);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Bisag Logo" />
          </Link>
        </div>

        <div className={click ? "navbar-menu active" : "navbar-menu"}>
          <Link to="/forms/all" onClick={closeMobileMenu} className="nav-link"> 
            <p>Forms</p>
          </Link>
          <Link to="/users" onClick={closeMobileMenu} className="nav-link">
            <p>Users</p>
          </Link>
          <Link to="/about" onClick={closeMobileMenu} className="nav-link">
            <p>About Us</p>
          </Link>
          <Link to="/" onClick={closeMobileMenu} className="nav-link">
            <div className="navbar-menu-login">
              <p>Logout </p>{" "}
              <i class="fa-solid fa-right-to-bracket login-icon"></i>
            </div>
          </Link>
        </div>
        {/* <div clasName="navbar-mobile" onClick={handleClick}>
          <i class={click ? "fa-solid fa-bars" : "fa-solid fa-xmark"}></i>
        </div> */}
      </nav>
    </>
  );
};

export default Navbar;
