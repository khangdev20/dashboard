import {
    Avatar,
    Box,
    Card,
    ListItem,
    Rating,
    Typography,
    IconButton,
} from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import DeleteIcon from "@mui/icons-material/Delete";

const CardComment = ({
                         created,
                         avatar,
                         name,
                         role,
                         onClick,
                         comment,
                         point,
                     }: any) => {
    return (
        <ListItem
            sx={{
                boxShadow: 2,
                mt: 0.5,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffffff",
                ":hover": {
                    cursor: "pointer",
                    borderRadius: 5,
                    boxShadow: 4,
                },
            }}
        >
            <Avatar src={avatar}/>
            <Box
                sx={{
                    pl: 2,
                    flex: 1,
                }}
            >
                <Typography fontWeight={"bold"} display="flex" alignItems={"center"}>
                    {name}
                    {role != "User" ? (
                        <GppGoodIcon fontSize="small" color="warning"/>
                    ) : (
                        ""
                    )}
                    <Rating value={point} disabled sx={{pl: 1}}/>
                </Typography>
                <Typography>{comment}</Typography>
            </Box>
            <IconButton
                sx={{
                    display: "flex",
                    textAlign: "end",
                }}
                onClick={onClick}
            >
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
};
export default CardComment;
