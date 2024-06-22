import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { MyContext } from "./MyContext";
import axios from "axios";
import { pdfjs } from "react-pdf";
import AlertBox from "./AlertBox";
import VersionHistory from "./VersionHistory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import createNotification from "./CreateNotification";
import InfoIcon from "@mui/icons-material/Info";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const DataGridForms = ({ data }) => {
  const { forms, setForms, departments, setDepartments } =
    useContext(MyContext);
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [file, setFile] = useState("");
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [remarks, setRemarks] = useState("");
  const [access, setAccess] = useState("");
  const [request, setRequest] = useState("");
  const [editDocId, setEditDocId] = useState("");
  const [requestDocId, setRequestDocId] = useState("");
  const [versionDocName, setVersionDocName] = useState("");
  const [versionDepartment, setVersionDepartment] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = sessionStorage.getItem("user-type");

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

  // console.log("Data: ", data);
  console.log("Forms: ", forms);
  const handleClickClose = () => {
    setShowForm(false);
    setShowRequestForm(false);
    setShowVersionHistory(false);
    setRequest("");
  };

  const handleSelectChange = (e) => {
    setDepartment(e.target.value);
  };
  console.log("File Object", file);
  const editDocument = async (editDocId, e) => {
    console.log("Edit ID: ", editDocId);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file); // Append the file to the FormData object

      // Append other form data fields
      formData.append("docName", docName);
      formData.append("docNumber", docNumber);
      formData.append("department", department);
      formData.append("remarks", remarks);

      const result = await axios.put(
        `http://localhost:5000/update-file/${editDocId}`,
        formData, // Send the FormData object containing the file
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );
      if (result.data.status === "ok") {
        const { data } = result.data;
        setForms(data);
        toast.success("The form has been edited!");
        const notificationData = await createNotification(
          `${docName} (doc No: ${docNumber}) was edited by ${user.fname} ${user.lname}`,
          "Admin"
        );
        console.log("Notification created: ", notificationData);
        handleClickClose();
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const submitRequest = async (e) => {
    e.preventDefault();
    console.log(user._id);
    try {
      const result = await axios.post(`http://localhost:5000/submit-request`, {
        userId: user._id,
        documentId: requestDocId,
        content: request,
      });

      console.log(result);
      if (result.status === 201) {
        // Reset form fields after successful submission
        setRequest("");
        setRequestDocId("");
        setShowRequestForm(false);
        const notificationData = await createNotification(
          `${user.fname} ${user.lname} made a request`, // Message content
          "Admin" // Department
        );
        console.log("Notification created: ", notificationData);
      } else {
        // Handle unsuccessful request submission
        console.error("Error submitting request");
      }
      handleClickClose();
    } catch (error) {
      console.error("Error submitting request:", error.message);
      // Handle error, show error message, etc.
    }
  };

  //console.log(showAlert);

  const columns = [
    { field: "id", headerName: "ID", width: 30, editable: false },
    {
      field: "docName",
      headerName: "Document name",
      width: 140,
      editable: false,
    },
    {
      field: "docNumber",
      headerName: "Document Number",
      width: 130,
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      width: 140,
      editable: false,
    },
    {
      field: "version",
      headerName: "Version",
      width: 70,
      editable: false,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 140,
      editable: false,
    },
    {
      field: "access",
      headerName: "Access",
      width: 140,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Issued Date",
      width: 140,
      editable: false,
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 140,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      renderCell: (params) => {
        const getFormDataById = async (id) => {
          try {
            const result = await axios.get(
              `http://localhost:5000/get-file/${id}`
            );
            if (result.data.status === "ok") {
              console.log(result.data);
              console.log(result.data.data.docName);
              setDocName(result.data.data.docName);
              setDocNumber(result.data.data.docNumber);
              setDepartment(result.data.data.department);
              setRemarks(result.data.data.remarks);
              setAccess(result.data.data.acccessControl);
            }
          } catch (error) {
            console.error(error.message);
          }
        };
        const handleAccessControl = async (
          id,
          currentAccess,
          documentName,
          documentNumber,
          departmentName
        ) => {
          const newAccess = currentAccess === "public" ? "private" : "public";
          try {
            const response = await axios.put(
              `http://localhost:5000/access-control/${id}`,
              {
                accessControl: newAccess,
              }
            );

            const { message } = response.data;
            setForms((prevForms) =>
              prevForms.map((form) =>
                form._id === id ? { ...form, accessControl: newAccess } : form
              )
            );
            toast.success(message);
            const notificationData = await createNotification(
              `${documentName} (doc No: ${documentNumber}) of department ${department} access changed to ${newAccess} by ${user.fname} ${user.lname}`, // Message content
              "Admin" // Department
            );
            console.log("Notification created: ", notificationData);
          } catch (error) {
            console.error(error.message);
            toast.error(error.message);
          }
        };
        const handleDelete = async (
          id,
          documentName,
          documentNumber,
          departmentName
        ) => {
          try {
            const result = await axios.delete(
              `http://localhost:5000/delete-file/${id}`
            );
            if (result.data.status === "ok") {
              toast.success("The form was deleted!");

              const filteredForms = forms.filter((form) => form._id !== id);
              setForms(filteredForms);

              const notificationData = await createNotification(
                `${documentName} (doc No: ${documentNumber}) of department ${department} was deleted by ${user.fname} ${user.lname}`,
                "Admin" // Department
              );
              console.log("Notification created: ", notificationData);
            }
          } catch (error) {
            console.error("Error deleting file:", error.message);
          }
        };
        const handleEdit = async (id) => {
          getFormDataById(id);
          setShowForm(true);
          console.log(typeof id);
          setEditDocId(id);
        };
        const handleRequest = async (id) => {
          getFormDataById(id);
          setShowRequestForm(true);
          setRequestDocId(id);
        };
        const handleShowVersionHistory = async (
          version_dName,
          version_dept
        ) => {
          setVersionDocName(version_dName);
          setVersionDepartment(version_dept);
          setShowVersionHistory(true);
        };
        return (
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                handleShowVersionHistory(
                  params.row.docName,
                  params.row.department
                )
              }
            >
              <InfoIcon />
            </Button>{" "}
            <Button
              variant="contained"
              size="small"
              //onClick={() => handleEdit(params.row.docId)}
              onClick={() =>
                handleAccessControl(
                  params.row.docId,
                  params.row.access,
                  params.row.docName,
                  params.row.docNumber,
                  params.row.department
                )
              }
              sx={{
                backgroundColor: "transparent",
              }}
            >
              {params.row.access === "public" ? (
                <PublicIcon
                  sx={{
                    color: "green",
                  }}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{
                    color: "red",
                  }}
                />
              )}
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              size="small"
              //onClick={() => handleEdit(params.row.docId)}
              onClick={() => handleEdit(params.row.docId)}
            >
              <EditIcon />
            </Button>{" "}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() =>
                handleDelete(
                  params.row.docId,
                  params.row.docName,
                  params.row.docNumber,
                  params.row.department
                )
              }
            >
              <DeleteIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  // Map your data into rows for the DataGrid
  const rows = data.map((item, index) => ({
    id: index + 1,
    docName: item.docName,
    docNumber: item.docNumber,
    department: item.department,
    version: item.version,
    remarks: item.remarks,
    access: item.accessControl,
    createdAt: new Date(item.createdAt).toLocaleString(),
    updatedAt: new Date(item.updatedAt).toLocaleString(),
    docId: item._id,
    pdf: item.pdf,
  }));

  // console.log("Selected: ", selectedRowIds)
  return (
    <Box
      width="100%"
      sx={{
        backgroundColor: "white",
        border: "2px solid grey",
        borderRadius: "5px",
      }}
    >
      {/*{showAlert && (
        <AlertBox message="Form was successfully deleted" severity="success" />
      )}*/}
      {showForm && (
        <React.Fragment>
          <Dialog
            open={showForm}
            onClose={handleClickClose}
            fullWidth
            PaperProps={{
              component: "form",
              onSubmit: (e) => editDocument(editDocId, e),
            }}
          >
            <DialogTitle color="primary">Edit Form</DialogTitle>
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
              <TextField
                autoFocus
                required
                margin="dense"
                id="remarks"
                name="remarks"
                label="Remark"
                type="text"
                fullWidth
                variant="outlined"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
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
                  onChange={handleSelectChange}
                >
                  {departments.map((data, index) => (
                    <MenuItem value={data.name} key={index}>
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Upload File"
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CANCEL</Button>
              <Button type="submit">SUBMIT</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
      {showRequestForm && (
        <React.Fragment>
          <Dialog
            open={showRequestForm}
            onClose={handleClickClose}
            fullWidth
            PaperProps={{
              component: "form",
              onSubmit: (e) => submitRequest(e),
            }}
          >
            <DialogTitle color="primary">Request Change</DialogTitle>
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
                disabled
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
                disabled
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
                  onChange={handleSelectChange}
                  disabled
                >
                  <MenuItem value="Intern">Intern</MenuItem>
                  <MenuItem value="Trainee">Trainee</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              </FormControl>
              <TextField
                autoFocus
                required
                multiline
                margin="dense"
                id="request"
                name="request"
                label="Type your request"
                type="text"
                fullWidth
                variant="outlined"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CANCEL</Button>
              <Button type="submit">SUBMIT</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}

      {/* Showing Dialog Box for version history */}
      {showVersionHistory && (
        <React.Fragment>
          <Dialog
            open={showVersionHistory}
            onClose={handleClickClose}
            fullWidth
          >
            <DialogTitle color="primary" textAlign="center">
              Version History
            </DialogTitle>
            <DialogContent
              sx={{
                width: "100%",
              }}
            >
              <table className="version-history">
                <tr>
                  <th>V No.</th>
                  <th>Updated</th>
                  <th>Remarks</th>
                  <th>View</th>
                </tr>

                {/* Display version history */}
                {forms
                  .filter(
                    (form) =>
                      form.docName === versionDocName &&
                      form.department === versionDepartment
                  )
                  .map((form, index) => (
                    <tr key={index}>
                      <td>{form.version}</td>
                      <td>{new Date(form.updatedAt).toLocaleString()}</td>
                      <td>{form.remarks || "-"}</td>
                      <td>
                        <a
                          href={`http://localhost:5000/files/${form.pdf}`}
                          target="_blank"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
              </table>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickClose}>CLOSE</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        // checkboxSelection
        disableSelectionOnClick
        autoHeight
        onCellClick={(params, event) => {
          if (params.field === "docName") {
            const pdf = params.row.pdf; // Assuming the field containing the PDF name is named "pdf"
            window.open(`http://localhost:5000/files/${pdf}`, "_blank");
          }
        }}
      />
      <ToastContainer/>
    </Box>
  );
};

export default DataGridForms;
