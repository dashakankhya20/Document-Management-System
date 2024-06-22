import React, { useContext, useState } from "react";
import "./signup_component.css";
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
import { MyContext } from "./MyContext";
import axios from "axios";

export default function CreateAdmin({ showEditForm }) {
  const { users, setUsers } = useContext(MyContext);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(showEditForm);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  console.log(showForm);
  const handleClickClose = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(fname, lname, email, password);

    axios
      .post(
        "http://localhost:5000/register",
        {
          fname,
          email,
          lname,
          password,
          userType: "Admin",
          phone,
          department: "Admin",
          gender,
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
          alert("New Admin Created!");
          setShowForm(false);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        alert("Something went wrong");
      });
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
          <DialogTitle color="primary">Create Admin</DialogTitle>
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
              autoFocus
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
              autoFocus
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter 8 digit password"
              fullWidth
              variant="outlined"
              value={password}
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
            {/* <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              displayEmpty
            >
              <MenuItem disabled value="">
                Department*
              </MenuItem>
              <MenuItem value="Intern">Intern</MenuItem>
              <MenuItem value="Trainee">Trainee</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select> */}

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
    </React.Fragment>
  );
}
