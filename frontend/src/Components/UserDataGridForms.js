import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { pdfjs } from "react-pdf";
import createNotification from "./CreateNotification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const UserDataGridForms = ({ userForms }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [access, setAccess] = useState("");
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [request, setRequest] = useState("");
  const [requestDocId, setRequestDocId] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);

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

  const handleClickClose = () => {
    setShowForm(false);
    setShowRequestForm(false);
    setRequest("");
  };

  const handleSelectChange = (e) => {
    setDepartment(e.target.value);
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
        toast.success("Your request has been sent!");
        const notificationData = await createNotification(
          `${user.fname} ${user.lname} made a request`, // Message content
          "Admin" // Department
        );
        console.log("Notification created: ", notificationData);
      } else {
        // Handle unsuccessful request submission
        console.error("Error submitting request");
      }
    } catch (error) {
      console.error("Error submitting request:", error.message);
      // Handle error, show error message, etc.
    }
  };

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
    // {
    //   field: "remarks",
    //   headerName: "Remarks",
    //   width: 140,
    //   editable: false,
    // },
    // {
    //   field: "access",
    //   headerName: "Access",
    //   width: 140,
    //   editable: false,
    // },
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
      width: 240,
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
        const handleRequest = async (id) => {
          getFormDataById(id);
          setShowRequestForm(true);
          setRequestDocId(id);
        };
        return (
          <Box>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleRequest(params.row.docId)}
            >
              Request
            </Button>
          </Box>
        );
      },
    },
  ];
  console.log(userForms);

  // Map your data into rows for the DataGrid
  const rows = userForms.map((item, index) => ({
    id: index + 1,
    docName: item.docName,
    docNumber: item.docNumber,
    department: item.department,
    version: item.version,
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
                  {departments.map((data, index) => (
                    <MenuItem value={data.name} key={index}>
                      {data.name}
                    </MenuItem>
                  ))}
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
      <ToastContainer />
    </Box>
  );
};

export default UserDataGridForms;
