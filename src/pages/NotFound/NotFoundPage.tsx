import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
      margin="auto"
      marginTop={5}
      padding={5}
      borderRadius={5}
    >
      <img
        style={{
          width: "30%",
          height: "30%",
        }}
        src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_1280.png"
      />
      <Link to={"/login"}>
        <Typography>YOU NEED LOGIN</Typography>
      </Link>
    </Box>
  );
};
