import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Box, IconButton, Tooltip } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

export const CustomCard = ({
  name,
  showAvatar,
  onUploadAvatar,
  email,
  phone,
  handleDelete,
  handleEdit,
  handleDetail,
  created,
  children,
  views,
  role,
  price,
  avatar,
}: any) => {
  return (
    <div>
      <Card
        sx={{
          margin: 1.5,
          minWidth: 250,
          maxWidth: 300,
          minHeight: 180,
          borderRadius: 5,
          boxShadow: 5,
          ":hover": {
            boxShadow: 20,
            cursor: "pointer",
          },
        }}
      >
        <CardContent
          style={{
            height: 120,
          }}
        >
          <Badge badgeContent={views} color="error"></Badge>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              {name}
            </Typography>
            {showAvatar ? (
              <div onClick={onUploadAvatar}>
                <Avatar
                  sx={{
                    textAlign: "end",
                    width: 50,
                    height: 50,
                    ":hover": {
                      boxShadow: 4,
                    },
                  }}
                  title={name}
                  src={
                    avatar != ""
                      ? avatar
                      : "https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg"
                  }
                />
              </div>
            ) : null}
          </Box>
          <Typography>{email}</Typography>
          <Typography>{price != null ? price + " VND" : null} </Typography>
          <Typography>{created}</Typography>
          <Typography>{phone}</Typography>
          <Typography>{role}</Typography>
        </CardContent>
        <div>
          <CardActions
            sx={{
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
      {children}
    </div>
  );
};
