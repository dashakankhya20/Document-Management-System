import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from "@mui/material";

const AlertBox = ({ message, severity, closeAlert }) => {
 const [open, setOpen] = useState(true);

 const handleClose = () => {
  setOpen(false);
 }

  return (
    <Box
      display={open ? "flex" : "none"}
      justifyContent="center"
      alignItems="center"
      padding="0.3rem"
    >
      <Alert
        icon={<CheckIcon fontSize="inherit" />}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
      <IconButton
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default AlertBox;
