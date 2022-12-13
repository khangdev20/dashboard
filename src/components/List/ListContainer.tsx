import {List} from "@mui/material";
import React from "react";

const ListContainer = ({children}: any) => {
    return (
        <List
            sx={{
                p: 1,
                ml: 0.5,
                mr: 0.5,
                minHeight: 300,
                maxHeight: 300,
                minWidth: 450,
                maxWidth: 400,
                overflowY: "auto",
            }}
        >
            {children}
        </List>
    );
};

export default ListContainer;
