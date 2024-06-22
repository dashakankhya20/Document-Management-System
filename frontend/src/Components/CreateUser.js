import React, { useState, useContext, useEffect } from "react";
import "./signup_component.css";
import { MyContext } from "./MyContext";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Form } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function CreateUser({ showEditForm }) {
  const { users, setUsers, departments } = useContext(MyContext);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(showEditForm);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  console.log(showForm);
  const handleClickClose = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(fname, lname, email, password);
    if(password.length != 8){
      toast.error("Password must be 8 characters long!");
    }else if(phone.length != 10){
      toast.error("Phone number must be 10 digits!")
    }
    
    else {
      axios
      .post(
        "http://localhost:5000/register",
        {
          fname,
          email,
          lname,
          password,
          userType: "User",
          phone,
          department,
          gender,
          profilePicture,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "ok") {
          setUsers(response.data.users);
          setShowForm(false);
        toast.success("New User Created!");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        toast.error("Something went wrong");
      });
    }
    
  };

  return (
    <React.Fragment>
      {showForm && (
        <Dialog
          fullWidth
          open={showForm}
          onClose={handleClickClose}
          PaperProps={{
            component: "form",
            onSubmit: (e) => handleSubmit(e),
          }}
        >
          <DialogTitle color="primary">Create User</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
          >
            <TextField
              autoFocus
              required
              margin="dense"
              id="fname"
              name="fname"
              label="First Name"
              type="text"
              fullWidth
              variant="outlined"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="lname"
              name="lname"
              label="Last Name"
              type="text"
              fullWidth
              variant="outlined"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />

            <TextField
              autoComplete="off"
              required
              margin="dense"
              id="email"
              name="email"
              label="EmailId"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              autoComplete="off"
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              placeholder="Enter 8 digit password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="phone"
              name="phone"
              label="Phone No"
              type="text"
              fullWidth
              variant="outlined"
              value={phone}
              placeholder="Enter 10 digit phone number"
              onChange={(e) => setPhone(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Department</InputLabel>
              <Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                displayEmpty
                required
              >
                {departments.map((data, index) => (
                  <MenuItem value={data.name} key={index}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClickClose}>CANCEL</Button>
            <Button type="submit">SUBMIT</Button>
          </DialogActions>
        </Dialog>
      )}
      <ToastContainer/>
    </React.Fragment>
  );
}
