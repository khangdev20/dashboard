import {
    Box,
    Fab,
    Popper,
} from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import {useState} from "react";
import BoxContainer from "../Box/BoxContainer";
import CardComment from "../Card/CardComment";

const PopupChat = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const id = Boolean(anchorEl) ? "simple-popper" : undefined;

    const listMessage = [
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
        },
        {
            name: "Khang",
            message: "Nhin cai gi",
            created: "1h",
        },
    ];

    return (
        <Box display={"flex"} flex={1}>
            <Fab
                color="error"
                sx={{
                    position: "fixed",
                    right: 40,
                    bottom: 40,
                }}
                onClick={handleClick}
            >
                <SmsIcon/>
            </Fab>
            <Popper
                placement="left-end"
                id={id}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
            >
                <BoxContainer label="Admin Group">
                    <Box
                        sx={{
                            overflowY: "auto",
                            height: 300,
                            width: 400,
                            pl: 2,
                            pr: 2,
                            borderRadius: 5,
                        }}
                    >
                        {listMessage.map((value, key) => (
                            <CardComment
                                key={key}
                                name={value.name}
                                comment={value.message}
                            />
                        ))}
                    </Box>
                    <input/>
                </BoxContainer>
            </Popper>
        </Box>
    );
};

export default PopupChat;
