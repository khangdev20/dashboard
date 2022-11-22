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
import { PremiumTag } from "../Tag/PremiumTag";

export const CardFilm = ({
  src,
  onClick,
  onDelete,
  onDetail,
  onEdit,
  posterTitle,
  genres,
  premium,
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
        {premium ? <PremiumTag /> : ""}
        <Typography>{genres}</Typography>
        <img
          height="335px"
          width="215px"
          src={src}
          title={"Poster " + posterTitle}
        />
        <Divider />
        <div>
          <CardActions
            sx={{
              height: 50,
              justifyContent: "center",
            }}
          >
            <IconButton onClick={onDelete}>
              <DeleteIcon color="error" />
            </IconButton>
            <IconButton onClick={onEdit}>
              <EditIcon color="error" />
            </IconButton>
            <IconButton onClick={onDetail}>
              <InfoIcon color="error" />
            </IconButton>
          </CardActions>
        </div>
      </Card>
    </div>
  );
};
