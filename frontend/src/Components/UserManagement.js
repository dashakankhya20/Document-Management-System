import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { MyContext } from "./MyContext";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CreateUser from "./CreateUser";
import CreateAdmin from "./CreateAdmin";
import NavHeading from "./NavHeading";
import CircularIndeterminate from "./CircularProgress";
import createNotification from "./CreateNotification";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const { users, setUsers, departments, setDepartments } = useContext(MyContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [getUserDataById, setGetUserDataById] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [createUserForm, setCreateUserForm] = useState(false);
  const [createAdminForm, setCreateAdminForm] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  //console.log("Users: ", users);
  
  useEffect(() => {
    const getAllDepartments = async () => {
      try {
        const result = await axios.get("http://localhost:5000/departments");
        setDepartments(result.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getAllDepartments();
  }, []);

  const getUserById = (id) => {
    const user = users.find((user) => user._id === id);
    console.log("getUserById",user);
    setGetUserDataById(user);
  };

  // const goToAdminPage = () => {
  //   navigate("/admin");
  // }
  
  const handleClickClose = () => {
    setShowForm(false);
  };

  const editUser = async (editUserId, e) => {
    e.preventDefault();
    try {
      const result = await axios.patch(
        `http://localhost:5000/editUser/${editUserId}`,
        {
          updatedUserData: {
            fname: firstName,
            lname: lastName,
            email: email,
            userType: userType,
            department: department,
            gender: gender,
            phone: phone,
          },
        }
      );
      if (result.data.status === "Ok") {
        console.log(result.data.data);
        setUsers(result.data.data);
        setShowForm(false);
        const notificationData = await createNotification(
          `${firstName} ${" "} ${lastName} was edited by ${user.fname} ${" "} ${
            user.lname
          }`, // Message content
          "Admin" // Department
        );
        console.log("Notification created: ", notificationData);
        toast.success(`User was successfully edited!`);
      }
    } catch (error) {
      console.error("Error editing user:", error.message);
    }
  };
  
  const handleSearch = () => {
    if (!users) return;

    const filteredRows = users
      .filter(
        (data) =>
          data.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.userType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((user, index) => ({
        id: index + 1, // Assign a unique ID to each row
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        userType: user.userType,
        gender: user.gender,
        department: user.department,
        phone: user.phone,
        isLoggedIn: user.isLoggedIn,
      }));

    setFilteredUsers(filteredRows);
    //console.log(filteredUsers);
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const result = await axios.get("http://localhost:5000/getAllUser");
        if (result.data.status === "ok") {
          setUsers(result.data.data); // Uncomment this line if you want to update state
          //console.log(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    getAllUser();

    // Cleanup function to prevent memory leaks
    return () => {
      // Cleanup logic (if needed)
    };
  }, []); // Empty dependency array ensures this effect runs only once
  // console.log(getUserDataById)
  useEffect(() => {
    if (getUserDataById) {
      setFirstName(getUserDataById.fname);
      setLastName(getUserDataById.lname);
      setEmail(getUserDataById.email);
      setUserType(getUserDataById.userType);
      setPhone(getUserDataById.phone);
      setDepartment(getUserDataById.department);
      setGender(getUserDataById.gender);
    }
  }, [getUserDataById]);
  const columns = [
    { field: "id", headerName: "ID", width: 30, editable: false },
    {
      field: "fname",
      headerName: "First Name",
      width: "150",
      editable: false,
    },
    {
      field: "lname",
      headerName: "Last Name",
      width: "150",
      editable: false,
    },
    {
      field: "email",
      headerName: "Email ID",
      width: "150",
      editable: false,
    },
    {
      field: "userType",
      headerName: "User Type",
      width: "150",
      editable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: "150",
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      width: "150",
      editable: false,
    },
    {
      field: "phone",
      headerName: "Phone No.",
      width: "150",
      editable: false,
    },
    {
      field: "isLoggedIn",
      headerName: "LoggedIn",
      width: "150",
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const handleDelete = async (id) => {
          try {
            const result = await axios.post(
              "http://localhost:5000/deleteUser",
              { userid: id }
            );
            if (result.data.status === "Ok") {
              const notificationData = await createNotification(
                `${user.fname} ${" "} ${
                  user.lname
                } deleted the user with ID: ${id}`, // Message content
                "Admin" // Department
              );
              console.log("Notification created: ", notificationData);
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== id)
              );
              toast.success("The user was deleted!");
            }
          } catch (error) {
            console.error("Error deleting user:", error.message);
          }
        };
        const handleEdit = async (id) => {
          //console.log(id);
          setEditUserId(id);
          getUserById(id);
          setShowForm(true);
        };
        return user._id === params.row.userId ? null : (
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row.userId)}
            >
              <EditIcon/>
            </Button>{" "}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(params.row.userId)}
            >
              <DeleteIcon/>
            </Button>
          </Box>
        );
        
      },
    },
  ];

  const rows =
    Array.isArray(users) &&
    users.map((user, index) => ({
      id: index + 1, // Assign a unique ID to each row
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      userType: user.userType,
      userId: user._id,
      gender: user.gender,
      department: user.department,
      phone: user.phone,
      isLoggedIn: user.isLoggedIn,
    }));
  return (
    <Box
      // border="1px solid black"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      gap="2rem"
    >
      <NavHeading heading="Users" />
      <Box display="flex" width="50rem" marginTop="1rem" gap="1rem">
        <TextField
          variant="outlined"
          width="10rem"
          fullWidth
          value={searchTerm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder=" Search for a user..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          SEARCH
        </Button>
      </Box>
      {/* Buttons for creating a user and admin */}
      {console.log(userType)}
      {user.userType === "super-admin" && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          gap="1rem"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("USER CREATE BUTTON");
              setCreateUserForm((prev) => !prev);
            }}
          >
            CREATE USER
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              console.log("ADMIN CREATE BUTTON");
              setCreateAdminForm((prev) => !prev);
            }}
          >
            CREATE ADMIN
          </Button>
        </Box>
      )}

      {/* CREATE USER FORM */}
      {createUserForm && <CreateUser showEditForm={createUserForm} />}
      {createAdminForm && <CreateAdmin showEditForm={createAdminForm} />}
      {/* Showing alert after deleting a user */}
      {/* Edit Form */}
      {showForm && getUserDataById && (
        <React.Fragment>
          <Dialog
            fullWidth
            open={showForm}
            onClose={handleClickClose}
            PaperProps={{
              component: "form",
              onSubmit: (e) => editUser(editUserId, e),
            }}
          >
            <DialogTitle color="primary">Edit User</DialogTitle>
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
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="EmailID"
                type="text"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                autoFocus
                disabled
                margin="dense"
                id="userType"
                name="userType"
                label="User Type"
                type="text"
                fullWidth
                variant="outlined"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Department
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={department}
                  label="Department"
                  onChange={(e) => setDepartment(e.target.value)}
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
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CANCEL</Button>
              <Button type="submit">UPDATE</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
      {/* Show Create Admin Form */}
      <Box
        sx={{
          backgroundColor: "white",
          border: "2px solid grey",
          borderRadius: "5px",
        }}
      >
        {filteredUsers || rows ? (
          <DataGrid
            rows={filteredUsers.length > 0 ? filteredUsers : rows}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        ) : (
          <CircularIndeterminate />
        )}
      </Box>
      <ToastContainer/>
    </Box>
  );
};

export default UserManagement;
