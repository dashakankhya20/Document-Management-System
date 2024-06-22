import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const NotificationWrapper = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLength, setNotificationLength] = useState(null);

  useEffect(() => {
    const fetchNotificationsByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getNotificationsByUserId/${user._id}`
        );
        const { data } = response;
        const { notifications } = data;

        // Filter out notifications where the logged-in user's ID is in the readBy array
        const unreadNotifications = notifications.filter(
          (notification) => !notification.readBy.includes(user._id)
        );

        setNotifications(unreadNotifications);
        setNotificationLength(unreadNotifications.length);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchNotificationsByUserId();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    try {
      await Promise.all(
        notifications.map(async (notification) => {
          if (!notification.readBy.includes(user._id)) {
            await markNotificationAsRead(user._id, notification._id);
          }
        })
      );
      setNotificationLength(0);
      setNotifications([]);
    } catch (error) {
      console.error("Error marking notifications as read:", error.message);
    } finally {
      setAnchorEl(null);
    }
  };

  const markNotificationAsRead = async (userId, notificationId) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/markNotificationAsRead",
        {
          userId: userId,
          notificationId: notificationId,
        }
      );

      console.log(response.data); // Log the response from the server

       // Remove the notification from the local state
    

      // Handle success response here if needed
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
      // Handle error response here if needed
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label={`show ${notifications.length} notifications`}
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={notificationLength} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {notifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: "1px solid grey",
              padding: "2rem",
            }}
          >
            <MenuItem disabled>No notifications to show</MenuItem>
            <Divider />
          </Box>
        ) : (
          notifications.map((data, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              padding="1rem"
              borderBottom="1px solid grey"
            >
              <FiberManualRecordIcon
                color="primary"
                sx={{
                  width: "1rem",
                  height: "1rem",
                }}
              />
              <MenuItem>{data.message}</MenuItem>
            </Box>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default NotificationWrapper;
