import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import axios from "axios";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUserProfile = ({ showEditForm }) => {
  const { setUser } = useContext(MyContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [showForm, setShowForm] = useState(showEditForm);

  useEffect(() => {
    if (user) {
      setFname(user.fname);
      setLname(user.lname);
      setEmail(user.email);
      setGender(user.gender);
      setPhone(user.phone);
      setDepartment(user.department);
    }
  }, []);

  const handleClickClose = () => {
    setShowForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = { fname, lname, email, phone, department, gender };
    try {
      const response = await axios.put(
        `http://localhost:5000/editProfile/${user._id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const userData = response.data.user;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log(JSON.stringify(userData, null, 2));

      toast.success("Your profile has been updated!");
      setShowForm(false);

      // Navigate to "/" after updating the profile
    } catch (error) {
      console.error("Error updating profile:", error);
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
            onSubmit: (e) => handleUpdate(e),
          }}
        >
          <DialogTitle color="primary">Edit Profile</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
          >
            <TextField
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
              required
              margin="dense"
              id="phone"
              name="phone"
              label="Phone No"
              type="text"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              displayEmpty
            >
              <MenuItem disabled value="">
                Department*
              </MenuItem>
              <MenuItem value="Intern">Intern</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Trainee">Trainee</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Defense">Defense</MenuItem>
            </Select>

            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              displayEmpty
            >
              <MenuItem disabled value="">
                Gender*
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
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
};

export default EditUserProfile;
