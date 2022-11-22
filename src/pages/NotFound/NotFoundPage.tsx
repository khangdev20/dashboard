import { Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
    >
      <img
        style={{
          width: "45%",
          height: "45%",
        }}
        src="https://www.psdstamps.com/wp-content/uploads/2019/12/warning-stamp-png.png"
      />
      <div
        onClick={() => {
          sessionStorage.removeItem("jwt");
          navigate("/login");
          window.location.reload();
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
            color: "red",
            fontWeight: "bold",
            fontSize: 20,
            ":hover": {
              cursor: "pointer",
              color: "#333",
            },
          }}
          title="move login page"
        >
          This page is for admins
        </Typography>
      </div>
    </Box>
  );
};
