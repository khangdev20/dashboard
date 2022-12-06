import React from "react";
import {Box, Typography} from "@mui/material";

const StatisticBox = ({color, name, statistic}: any) => {
    return (
        <Box
            sx={{
                backgroundColor: color,
                width: 600,
                height: 300,
                borderRadius: 5,
                display: "flex",
                m: 2,
            }}
        >
            <Typography padding={2} textTransform={"uppercase"} fontSize={20}>
                {name}
            </Typography>
            <Typography display={"flex"} alignContent={"center"}>
                {statistic}
            </Typography>
        </Box>
    );
};

export default StatisticBox;
