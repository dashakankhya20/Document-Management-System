import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import axios from "axios";
import NavHeading from "./NavHeading";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Notifications = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationLength, setNotificationLength] = useState(null);

  useEffect(() => {
    const fetchNotificationsByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getNotificationsByUserId/${user._id}`
        );
        const { data } = response;
        const { notifications } = data;
        setNotificationsList(notifications);
        setNotificationLength(notifications.length);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchNotificationsByUserId();
  }, []);
  console.log(notificationsList);
  return (
    <Box>
      <NavHeading heading="Notifications" />
      <Box
        sx={{
          margin: "4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        {notificationLength > 0 ? (
          notificationsList.map((data, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                borderBottom: "1px solid grey",
                padding: "2rem",
                gap: "1rem",
              }}
            >
              <FiberManualRecordIcon
                color="primary"
                sx={{
                  width: "1rem",
                  height: "1rem",
                }}
              />
              <Typography>{data.message}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="h1" padding="2rem" fontStyle="italic" color="grey">
            No notifications to show
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
