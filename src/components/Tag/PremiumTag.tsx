import React from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {Box} from "@mui/material";

export const PremiumTag = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                p: 1
            }}
        >
            <BookmarkIcon fontSize="large" color="warning"/>
        </Box>
    );
};
