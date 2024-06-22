import React, { useContext, useState } from "react";
import { MyContext } from "./MyContext";
import { Box, Typography, Divider, Avatar, Button, Paper } from "@mui/material";
import EditUserProfile from "./EditUserProfile";
import dummyImage from "../images/blank-male.jfif";
import dummyFemaleImage from "../images/blank-female.png";
import CircularIndeterminate from "./CircularProgress";
import ChangePassword from "./ChangePassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
  //const { user } = useContext(MyContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = user?.userType;
  console.log(user);
  const [showEditForm, setShowEditForm] = useState(false);
  console.log(user);

  return user ? (
    <Box display="flex" justifyContent="center">
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10rem",
          padding: "2rem",
          gap: "1rem",
          width: "60rem",
        }}
      >
        <Box
          width="40%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="2rem"
          padding="2rem"
          borderRight="1px solid lightGrey"
        >
          <Avatar
            src={user.gender == "Male" ? dummyImage : dummyFemaleImage}
            sx={{
              width: "150px",
              height: "150px",
            }}
          />
          <Typography variant="h4">
            {user.fname} {user.lname}
          </Typography>
          {(userType === "Admin" ||
            userType === "super-admin") && (
              <Button
                variant="contained"
                onClick={() => setShowEditForm((prev) => !prev)}
              >
                Edit Profile
              </Button>
            )}
          <ChangePassword />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap="1rem"
          width="60%"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Email: </Typography>
            <Typography>{user.email}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Role: </Typography>
            <Typography>{user.userType}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Phone:</Typography>
            <Typography>{user.phone}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Gender: </Typography>
            <Typography>{user.gender}</Typography>
          </Box>
          {/* <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="0.5rem"
          >
          <Typography variant="h1">DOB: </Typography>
          <Typography>{user.dob}</Typography>
          </Box> */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Department: </Typography>
            <Typography>{user.department}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Typography variant="h1">Status: </Typography>
            <Typography>
              {user.isLoggedIn === true ? "Active" : "Deactive"}
            </Typography>
            {console.log(user.isLoggedIn)}
          </Box>
        </Box>

        {/* Conditionally rendering the Edit Form for both users */}
        {console.log(userType)}
        {showEditForm &&
          (userType === "Admin" || userType === "super-admin") && (
            <EditUserProfile showEditForm={showEditForm} />
          )}
      </Paper>
      <ToastContainer/>
    </Box>
  ) : (
    <CircularIndeterminate />
  );
};

export default Profile;
