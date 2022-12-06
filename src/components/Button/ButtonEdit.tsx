import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box } from "@mui/system";

const ButtonEdit = ({ color, onClick, fontSize, toggleChangeIcon }: any) => {
  return (
    <Box m={1}>
      <IconButton onClick={onClick}>
        {toggleChangeIcon ? (
          <EditIcon fontSize={fontSize} color={color} />
        ) : (
          <CancelIcon fontSize={fontSize} color={color} />
        )}
      </IconButton>
    </Box>
  );
};

export default ButtonEdit;
