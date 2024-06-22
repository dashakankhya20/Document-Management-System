import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <Box 
    sx={{ 
        margin:"20rem",
        display: "flex",
        alignItems:"center",
        justifyContent:"center"
        }}
        >
      <CircularProgress />
    </Box>
  );
}
