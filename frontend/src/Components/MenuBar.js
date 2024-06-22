import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import navBisagLogo from "../images/bisag-logo2.png";
import axios from "axios";
import NotificationWrapper from "./NotificationWrapper";

const pages = [
  { name: "Documents", path: "/documents" },
  { name: "Users", path: "/users" },
  // { name: "Admins", path: "/admins" },
  { name: "Requests", path: "/requests" },
  { name: "About Us", path: "/about" },
 
];

const userPages = [
  { name: "Documents", path: "/documents" },
  { name: "About Us", path: "/about" },
];

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = sessionStorage.getItem("user-type");
  console.log(sessionStorage.getItem("user"));
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  console.log(user);

  console.log(location.pathname);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    //navigate("/profile");
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

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

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
      <MenuItem onClick={() => navigate("/notifications")}>
        Notifications
      </MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {pages.map((page) => (
        <MenuItem
          key={page.name}
          onClick={handleMenuClose}
          component={Link}
          to={page.path}
          selected={location.pathname === pages.path}
          sx={{
            color: location.pathname === pages.path ? "grey" : "",
          }}
        >
          {page.name}
        </MenuItem>
      ))}
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Typography>Profile</Typography>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Box width="5rem" height="5rem">
            <img
              src={navBisagLogo}
              alt="Bisag Nav Logo"
              height="100%"
              width="100%"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: "none", md: "flex", lg: "flex" },
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            {userType === "Admin" || userType === "super-admin"
              ? pages.map((page) => (
                  <Button
                    key={page.name}
                    component={Link}
                    to={page.path}
                    sx={{
                      "& .MuiTypography-root": {
                        transition: "background-color 0.3s ease-in-out",
                        backgroundColor:
                          location.pathname === page.path ? "#f5f5f5" : "",
                        padding:
                          location.pathname === page.path ? "0.5rem" : "",
                        borderRadius:
                          location.pathname === page.path ? "0.5rem" : "",
                      },
                    }}
                  >
                    <Typography component="h1" variant="h1">
                      {page.name}
                    </Typography>
                  </Button>
                ))
              : userPages.map((page) => (
                  <Button
                    key={page.name}
                    color="inherit"
                    component={Link}
                    to={page.path}
                  >
                    <Typography component="h1" variant="h1">
                      {page.name}
                    </Typography>
                  </Button>
                ))}
            {/* Notification Icon */}
            <NotificationWrapper />
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
