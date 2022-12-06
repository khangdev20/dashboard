import React from "react";

import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";

export const ConfirmDialog = ({open, title, handleCancel, handleOk}: any) => {
    return (
        <Dialog open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogActions>
                <Button onClick={handleOk}>OK</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};
