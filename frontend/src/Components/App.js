//THIS ONE IS THE WORKING ONE!
import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { pdfjs } from "react-pdf";
import "./App.css";
import DataGridForms from "./DataGridForms";
import { MyContext } from "./MyContext";
import NavHeading from "./NavHeading";
import UserDataGridForms from "./UserDataGridForms";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [file, setFile] = useState("");
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [access, setAccess] = useState("public");
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentDescription, setNewDepartmentDescription] = useState("");
  const [newDepartmentManager, setNewDepartmentManager] = useState("");
  const { forms, setForms } = useContext(MyContext);
  const [userForms, setUserForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userFilteredData, setUserFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDepartForm, setShowDepartmentForm] = useState(false);
  const userType = sessionStorage.getItem("user-type");
  const handleClickOpen = () => {
    setShowForm(true);
  };
  const handleClickClose = () => {
    setShowForm(false);
    setShowDepartmentForm(false);
  };

  const getAllDepartments = async () => {
    try {
      const result = await axios.get("http://localhost:5000/departments");
      setDepartments(result.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const createNewDepartment = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/department/new", {
        name: newDepartmentName,
        description: newDepartmentDescription,
        manager: newDepartmentManager,
      });
      console.log(result.data);
      toast.success("New department added!");
      setShowDepartmentForm(false);
      getAllDepartments();
      setNewDepartmentName("");
      setNewDepartmentDescription("");
      setNewDepartmentManager("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      setForms(result.data.data);
      //console.log(forms);
    } catch (error) {
      console.error("Error fetching PDFs:", error.message);
    }
  };

  // axios request to get files for user (public)
  const getFilesForUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/get-public-files"
      );
      const { data } = response.data;
      setUserForms(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = async () => {
    //console.log("It is working!")
    const filtered = forms.filter(
      (data) =>
        data.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.accessControl.toLowerCase().includes(searchTerm.toLowerCase())

    );
    setFilteredData(filtered);
    const userFiltered = userForms.filter(
      (data) =>
        data.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUserFilteredData(userFiltered);
  };
  const submitImage = async (e) => {
    e.preventDefault();

    if (!file || file.type !== "application/pdf") {
      toast.success("Please upload a valid PDF file.");
      return;
    }
    // console.log("Filtered Data", filteredData);
    // console.log("Actual Data: ", allImage);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docName", docName);
    formData.append("docNumber", docNumber);
    formData.append("department", department);
    formData.append("access", access);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.data.status === "ok") {
        toast.success("Uploaded Successfully!!!");
        getPdf();
        // Reset form fields after successful submission
        setFile("");
        setDocName("");
        setDocNumber("");
        setDepartment("");
        // setAccess("");
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  useEffect(() => {
    getPdf();
    getFilesForUser();
    getAllDepartments();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      {/* Search by a document name or number */}
      <NavHeading heading="Documents" />
      <Box display="flex" width="50rem" marginTop="3rem" gap="1rem">
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
          placeholder=" Search forms..."
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

      {/* Dialog box for creating new form */}
      {showForm && (
        <React.Fragment>
          <Dialog
            open={showForm}
            onClose={handleClickClose}
            fullWidth
            PaperProps={{
              component: "form",
              onSubmit: submitImage,
            }}
          >
            <DialogTitle color="primary">Create Document</DialogTitle>
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
                id="docName"
                name="docName"
                label="Document Name"
                type="text"
                fullWidth
                variant="outlined"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="docNumber"
                name="docNumber"
                label="Document Number"
                type="text"
                fullWidth
                variant="outlined"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
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
                  required
                >
                  {departments.map((data, index) => (
                    <MenuItem value={data.name} key={index}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Upload File"
                required
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setFile(e.target.files[0])}
                inputProps={{
                  accept: "application/pdf",
                  required: true,
                }}
              />
              {/* <FormControl fullWidth>
                <InputLabel id="access-control">Access</InputLabel>
                <Select
                  labelId="access-control"
                  id="access-control"
                  value={access}
                  label="Access"
                  onChange={(e) => setAccess(e.target.value)}
                  required
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </Select>
              </FormControl> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CANCEL</Button>
              <Button type="submit">SUBMIT</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}

      {/* Dialog box for adding new department */}
      {showDepartForm && (
        <React.Fragment>
          <Dialog
            open={showDepartForm}
            onClose={handleClickClose}
            fullWidth
            PaperProps={{
              component: "form",
              onSubmit: (e) => createNewDepartment(e),
            }}
          >
            <DialogTitle color="primary">Add New Department</DialogTitle>
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
                id="newDepartmentName"
                name="newDepartmentName"
                label="Department Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="newDepartmentDescription"
                name="newDepartmentDescription"
                label="Enter a description"
                type="text"
                fullWidth
                variant="outlined"
                value={newDepartmentDescription}
                onChange={(e) => setNewDepartmentDescription(e.target.value)}
              />

              <TextField
                autoFocus
                required
                margin="dense"
                id="newDepartmentManager"
                name="newDepartmentManager"
                label="Manager Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newDepartmentManager}
                onChange={(e) => setNewDepartmentManager(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CANCEL</Button>
              <Button type="submit">SUBMIT</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
      <div className="uploaded">
        {userType === "Admin" || userType === "super-admin" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap="1rem"
            marginBottom="1rem"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              CREATE DOCUMENT
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDepartmentForm(true)}
            >
              ADD DEPARTMENT
            </Button>
          </Box>
        )}

        {/* DataGrid which will display all the forms uploaded so far */}
        {/* {console.log(filteredData)} */}

        {userType === "Admin" || userType === "super-admin" ? (
          <DataGridForms
            data={filteredData.length === 0 ? forms : filteredData}
          />
        ) : (
          <UserDataGridForms
            userForms={
              userFilteredData.length === 0 ? userForms : userFilteredData
            }
          />
        )}
      </div>
      <ToastContainer/>
    </Box>
  );
}

export default App;
