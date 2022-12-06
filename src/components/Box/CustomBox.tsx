import { Box } from "@mui/material";

export default function CustomBox(props: any) {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      maxWidth={400}
      alignItems="center"
      justifyContent={"center"}
      margin="auto"
      marginTop={10}
      padding={5}
      borderRadius={5}
      boxShadow={"5px 5px 10px #ccc"}
      sx={{
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      {props.children}
    </Box>
  );
}
