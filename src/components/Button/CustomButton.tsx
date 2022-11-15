import { Button } from "@mui/material";
import React from "react";

export default function CustomButton({ onClick, color, text, type }: any) {
  return (
    <Button
      onClick={onClick}
      sx={{
        height: 45,
        margin: 1,
      }}
      fullWidth
      variant="contained"
      color={color}
    >
      {text}
    </Button>
  );
}
