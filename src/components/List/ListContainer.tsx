import {List} from "@mui/material";
import React from "react";

const ListContainer = ({children}: any) => {
    return (
        <List
            sx={{
                p: 1,
                ml: 0.5,
                mr: 0.5,
                maxHeight: 300,
                minHeight: 300,
                minWidth: 440,
                maxWidth: 440,
                overflowY: "scroll",
            }}
        >
            {children}
        </List>
    );
};

export default ListContainer;
