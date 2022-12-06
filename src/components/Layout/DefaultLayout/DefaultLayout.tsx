import {Box, Toolbar} from "@mui/material";
import {memo} from "react";
import Header from "../../Header/Header";
import PopupChat from "../../PopupChat/PopupChat";

const DefaultLayout = ({children}: any) => {
    return (
        <Box sx={{display: "flex", overflow: 'auto'}}>
            <Header/>
            <Box
                sx={{
                    flexGrow: 1,
                    pl: 1,
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
