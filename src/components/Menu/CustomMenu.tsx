import {Menu, MenuItem, Typography} from "@mui/material";
import React from "react";

export const CustomMenu = ({
                               anchorEl,
                               onClose,
                               children,
                               horizontal,
                           }: any) => {
    return (
        <Menu
            sx={{mt: "45px"}}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: horizontal,
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: horizontal,
            }}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            {children}
        </Menu>
    );
};
