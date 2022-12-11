import React from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {Box} from "@mui/material";

export const PremiumTag = () => {
    return (
        <Box
            position={'absolute'}
        >
            <BookmarkIcon fontSize="large" color="warning"/>
        </Box>
    );
};
