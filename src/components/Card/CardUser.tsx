import {Avatar, Box, Typography} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import PaidIcon from "@mui/icons-material/Paid";
import Divider from "@mui/material/Divider";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import Male from "@mui/icons-material/Male";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const CardUser = ({
                      premium,
                      avatar,
                      name,
                      sex,
                      phone,
                      money,
                      role,
                      date,
                      email,
                      iconNone
                  }: any) => {
    const mo = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(money);
    return (
        <Box
            sx={{
                display: "flex",
                p: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {premium ? <WorkspacePremiumIcon color="warning" fontSize="large"/> : ""}
            <Avatar
                sx={{
                    textAlign: "end",
                    width: 200,
                    m: 2,
                    height: 200,
                    ":hover": {
                        boxShadow: 4,
                    },
                }}
                src={avatar != "" ? avatar : ""}
            />
            <Box
                sx={{
                    ml: 4,
                    alignItems: "center",
                    display: "flex",
                    borderRadius: 5,
                }}
            >
                <Box>
                    <Box className="dp-flex-height" margin={2}>
                        {iconNone ?
                            null :
                            <PersonIcon sx={{mr: 2}}/>
                        }
                        <Typography
                            fontSize={20}
                            textTransform={"uppercase"}
                            fontWeight="bold"
                        >
                            {name}
                        </Typography>
                        {sex ? (
                            <Male sx={{ml: 1}} fontSize="large" color="primary"/>
                        ) : (
                            <FemaleIcon sx={{ml: 1}} fontSize="large" color="secondary"/>
                        )}
                    </Box>
                    {email ? <Box className="dp-flex-height" margin={2}>
                        <EmailIcon sx={{mr: 2}}/>
                        <Typography fontSize={20}>{email}</Typography>
                    </Box> : null}
                    {phone ? <Box className="dp-flex-height" margin={2}>
                        <LocalPhoneIcon sx={{mr: 2}}/>
                        <Typography fontSize={20}>{phone}</Typography>
                    </Box> : null}
                    {role ? <Box className="dp-flex-height" margin={2}>
                        <AdminPanelSettingsIcon sx={{mr: 2}}/>
                        <Typography fontSize={20}>{role}</Typography>
                    </Box> : null}
                    {money ? <Box className="dp-flex-height" margin={2}>
                        <LocalAtmIcon sx={{mr: 2}}/>
                        <Typography fontSize={20}>{mo}</Typography>
                    </Box> : null}
                    {date ? <Box className="dp-flex-height" margin={2}>
                        <DateRangeIcon sx={{mr: 2}}/>
                        <Typography fontSize={20}>{date}</Typography>
                    </Box> : null
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default CardUser;
