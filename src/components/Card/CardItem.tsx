import {Avatar, Box, IconButton, ListItem, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CardItem = ({
                      price,
                      name,
                      onClick,
                      onClickDetail,
                      action,
                      date,
                      time,
                      index,
                      quantity,
                      avatar
                  }: any) => {
    return (
        <Box
            sx={{
                borderRadius: 3,
                display: "flex",
                pl: 3,
                m: 1,
                backgroundColor: "white",
                alignItems: 'center'
            }}
        >
            <Avatar src={avatar}/>
            <ListItem>
                <Box>
                    <Typography>{index}</Typography>
                    <Box onClick={onClickDetail}>
                        <Typography sx={{
                            ":hover": {
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }
                        }
                        } fontWeight={"bold"}>{name}</Typography>
                    </Box>
                    {quantity > 0 ? (
                        <Typography>Quantity Films: {quantity}</Typography>
                    ) : null}
                    <Box className="dp-flex">
                        <Typography>{price}</Typography>
                        <Typography>{time}</Typography>
                    </Box>
                    <Typography textTransform={"lowercase"}>{date}</Typography>
                </Box>
            </ListItem>
            {action ? (
                <IconButton sx={{m: 2}} onClick={onClick}>
                    <DeleteIcon/>
                </IconButton>
            ) : (
                " "
            )}
        </Box>
    );
};

export default CardItem;
