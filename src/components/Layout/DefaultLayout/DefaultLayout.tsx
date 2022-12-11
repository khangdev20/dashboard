import {Box, Toolbar} from "@mui/material";
import {memo} from "react";
import Header from "../../Header/Header";

const DefaultLayout = ({children}: any) => {
    return (
        <Box sx={{display: "flex"}}>
            <Header/>
            <Box
                sx={{
                    overflowX: 'auto',
                    flexGrow: 1,
                    p: 1,
                    width: {sm: `calc(100% - ${200}px)`, flexShrink: {sm: 0}},
                }}
            >
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
};

export default memo(DefaultLayout);
