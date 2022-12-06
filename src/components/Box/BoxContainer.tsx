import {Box, Typography} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const BoxContainer = ({quantity, label, children}: any) => {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Box
                sx={{
                    backgroundColor: "white",
                    borderRadius: 3,
                    flex: 1,
                    boxShadow: 5,
                    m: 2,
                    background: '#4444',
                }}
            >
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        background: '#6666',
                        borderRadius: 3,
                        boxShadow: 5,
                        p: 1,
                        pl: 2,
                    }}
                >
                    <Typography fontWeight={"bold"} fontSize={15} color="black">
                        {label}
                    </Typography>
                    <KeyboardArrowDownIcon sx={{m: 1, color: "#000"}}/>
                    <Typography fontSize={15} color="#000">
                        {quantity}
                    </Typography>
                </Box>
                {children}
            </Box>
        </form>

    );
};

export default BoxContainer;
