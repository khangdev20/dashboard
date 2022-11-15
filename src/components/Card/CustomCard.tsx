import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Box, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

export const CustomCard = ({
  name,
  img,
  hideAvatar,
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
            {hideAvatar ? (
              <Avatar
                sx={{
                  mr: 1,
                  textAlign: "end",
                }}
                alt={"avata" + name}
                src={
                  avatar != null
                    ? avatar
                    : "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png"
                }
              />
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
