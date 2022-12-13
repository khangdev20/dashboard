import React from "react";
import { Button} from "@mui/material";

const ButtonOutlined = ({children, color, onClick, fullWidth}: any) => {
    return (
        <Button
            color={color}
            variant={'outlined'}
            sx={{m: 1}}
            onClick={onClick}
            fullWidth={!!fullWidth}
        >
            {children}
        </Button>
    )
};

export default ButtonOutlined;
