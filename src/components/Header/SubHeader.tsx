import {
  IconButton,
  InputBase,
  styled,
  TextField,
  Toolbar,
} from "@mui/material";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { text } from "stream/consumers";
import { useState } from "react";

export const SubHeader = ({
  addButton,
  refreshButton,
  onChange,
  value,
}: any) => {
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 5,
    border: "1px solid red",
    "&:hover": {
      backgroundColor: "#f9f9f9",
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 3, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "30ch",
        },
      },
    },
  }));

  return (
    <Toolbar
      sx={{
        height: 100,
      }}
    >
      <IconButton onClick={addButton}>
        <AddToQueueIcon color="error" fontSize="medium" />
      </IconButton>
      <Search>
        <SearchIconWrapper>
          <SearchIcon color="error" fontSize="medium" />
        </SearchIconWrapper>
        <StyledInputBase placeholder="Search…" />
      </Search>
      <IconButton onClick={refreshButton}>
        <RefreshIcon color="error" fontSize="medium" />
      </IconButton>
    </Toolbar>
  );
};
