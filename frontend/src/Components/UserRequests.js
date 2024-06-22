import React, { useContext, useState, useEffect } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularIndeterminate from "./CircularProgress";
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
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { MyContext } from "./MyContext";
import axios from "axios";
import NavHeading from "./NavHeading";
import sendNotification from "./CreateNotificationUser";

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [requestApproved, setRequestApproved] = useState(false);
  const [requestRejected, setRequestRejected] = useState(false);

  const handleRequestApprove = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/requests/${id}`, {
        status: "Approved", // Use 'status' instead of 'requestStatus'
      });
      const { request } = response.data;
      console.log(request);
      console.log(request.requestStatus); // Log the updated status
      // Update the requests array with the new status
      console.log(request.userId);
      setRequests((prevRequests) =>
        prevRequests.map((item) =>
          item._id === id ? { ...item, requestStatus: "Approved" } : item
        )
      );
      request.requestStatus === "Approved" && setRequestApproved(true);
      setRequestRejected(false);
      const notificationData = await sendNotification(
        "Your request has been approved!", // Message content
        request.userId
      );
      console.log(notificationData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRequestReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/requests/${id}`, {
        status: "Rejected", // Use 'status' instead of 'requestStatus'
      });
      const { request } = response.data;
      console.log(request.requestStatus); // Log the updated status
      setRequests((prevRequests) =>
        prevRequests.map((item) =>
          item._id === id ? { ...item, requestStatus: "Rejected" } : item
        )
      );
      request.requestStatus === "Rejected" && setRequestRejected(true);
      setRequestApproved(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, editable: false },
    {
      field: "userName",
      headerName: "Username",
      width: 120,
      editable: false,
    },
    {
      field: "docName",
      headerName: "Document Name",
      width: 120,
      editable: false,
    },
    {
      field: "docNumber",
      headerName: "Document Number",
      width: 120,
      editable: false,
    },
    {
      field: "version",
      headerName: "Version",
      width: 120,
      editable: false,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 120,
      editable: false,
    },
    {
      field: "content",
      headerName: "Request",
      width: 120,
      editable: false,
    },
    {
      field: "requestStatus",
      headerName: "Status",
      width: 120,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 120,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      editable: false,
      renderCell: (params) => {
        const updateApproveStatus = async (requestId) => {
          try {
            console.log(requestId);
            await handleRequestApprove(requestId);
          } catch (error) {
            console.error(error.message);
          }
        };
        const updateDisApproveStatus = async (requestId) => {
          try {
            console.log(requestId);
            await handleRequestReject(requestId);
          } catch (error) {
            console.error(error.message);
          }
        };

        return (
          <Box>
            <Tooltip title="Approve Request">
              <IconButton
                onClick={() => updateApproveStatus(params.row.requestId)}
                sx={{
                  color:
                    params.row.requestStatus === "Approved"
                      ? "green"
                      : undefined,
                }}
              >
                <CheckCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Request">
              <IconButton
                onClick={() => updateDisApproveStatus(params.row.requestId)}
                sx={{
                  color:
                    params.row.requestStatus === "Rejected" ? "red" : undefined,
                }}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const rows = requests.map((item, index) => ({
    id: index + 1,
    userName: item.userId ? `${item.userId.fname} ${item.userId.lname}` : "N/A", // Concatenate first name and last name
    docName: item.documentId ? item.documentId.docName : "N/A",
    docNumber: item.documentId ? item.documentId.pdf : "N/A",
    version: item.documentId ? item.documentId.version : "N/A",
    remarks: "N/A", // You may replace this with the actual field from the API if available
    content: item.content,
    requestStatus: item.requestStatus,
    createdAt: new Date(item.createdAt).toLocaleString(),
    requestId: item._id,
  }));
  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const result = await axios.get("http://localhost:5000/getAllRequests");
        console.log(result.data.requests);
        setRequests(result.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    getAllRequests();
  }, []); // Empty dependency array means this effect runs only once after the initial render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        width: "100%",
      }}
    >
      <NavHeading heading="Requests" />
      {requests ? (
        <Box
          sx={{
            backgroundColor: "white",
            border: "2px solid grey",
            borderRadius: "5px",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        </Box>
      ) : (
        <CircularIndeterminate />
      )}
    </Box>
  );
};

export default UserRequests;
