import {
  Box,
  Card,
  CardActions,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import React from "react";
import Toolbar from "@mui/material/Toolbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

export const CardFilm = ({
  src,
  onClick,
  handleDelete,
  handleDetail,
  handleEdit,
}: any) => {
  return (
    <div>
      <Card
        sx={{
          position: "relative",
          margin: 2,
          borderRadius: 2,
          boxShadow: 5,
          ":hover": {
            boxShadow: 20,
            cursor: "pointer",
          },
        }}
        onClick={onClick}
      >
        <img height="335px" width="215px" src={src} />
        <Divider />
        <div>
          <CardActions
            sx={{
              height: 50,
              justifyContent: "center",
            }}
          >
            <IconButton onClick={handleDelete}>
              <DeleteIcon color="error" />
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon color="error" />
            </IconButton>
            <IconButton onClick={handleDetail}>
              <InfoIcon color="error" />
            </IconButton>
          </CardActions>
        </div>
      </Card>
    </div>
  );
};
