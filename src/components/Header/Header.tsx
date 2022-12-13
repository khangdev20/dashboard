import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {Link} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import {useState, useEffect, useCallback, createContext} from "react";
import {useApi} from "../../hooks/useApi";
import {UserEntity} from "../../models/UserEntity";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useNavigate} from "react-router-dom";
import {ConfirmDialog} from "../Dialog/ConfirmDialog";
import {CustomMenu} from "../Menu/CustomMenu";
import SideBar from "../Sider/SideBar";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LogoutIcon from "@mui/icons-material/Logout";

export const OpenDrawer = createContext(false);

function Header() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElNoti, setAnchorElNoti] = useState<null | HTMLElement>(null);
    const {callApi} = useApi();
    const [data, setData] = useState<UserEntity>();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [onConfirmLogout, setOnConfirmLogout] = useState(false);
    const handleOnConfirmLogout = () => setOnConfirmLogout(true);
    const handleLogout = () => {
        sessionStorage.removeItem("jwt");
        navigate("/login");
        window.location.reload();
    };
    const getProfile = useCallback(() => {
        console.log("get profile")
        callApi<UserEntity>(REQUEST_TYPE.GET, "api/users/profile")
            .then((res) => {
                if (res.data.role !== "Administrator") {
                    console.log(res.data.role);
                    navigate("/notfound");
                    window.close();
                } else {
                    setData(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    useEffect(() => {
        return () => {
            getProfile();
        };
    }, [getProfile]);


    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleOpenNotiMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNoti(event.currentTarget);
    };
    const handleCloseNotiMenu = () => {
        setAnchorElNoti(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <OpenDrawer.Provider value={mobileOpen}>
            <Box>
                <AppBar
                    position="fixed"
                    sx={{
                        width: {sm: `calc(100% - ${200}px)`},
                        ml: {sm: `${200}px`},
                        background: "rgb(255,255,255)",
                    }}
                >
                    <Toolbar>
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            sx={{display: {sm: "none"}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Box display={"flex"} flexGrow={1}>
                            <Link to={"/dashboard"}>
                                <img
                                    style={{
                                        maxHeight: 60,
                                        marginLeft: 20,
                                        margin: -5,
                                    }}
                                    alt="LOGO"
                                    src="https://cdn.discordapp.com/attachments/1019968445418319914/1033082905985028226/codeflix-logo.png"
                                />
                            </Link>
                        </Box>
                        <IconButton>
                            <Badge badgeContent={4} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton sx={{marginLeft: 3}} onClick={handleOpenNotiMenu}>
                            <Badge badgeContent={10} color="error">
                                <EmailIcon/>
                            </Badge>
                        </IconButton>
                        <Tooltip
                            style={{marginRight: 10, marginLeft: 20}}
                            title="Open settings"
                        >
                            <IconButton onClick={handleOpenUserMenu}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={
                                        data?.avatar !== ""
                                            ? data?.avatar
                                            : "https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg"
                                    }
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: "45px"}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <PersonIcon/>
                                <Typography onClick={() => navigate("/profile")} marginLeft={2} textAlign="center">
                                    {data?.name}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <AdminPanelSettingsIcon/>
                                <Typography marginLeft={2} textAlign="center">
                                    {data?.role}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <LocalPhoneIcon/>
                                <Typography marginLeft={2} textAlign="center">
                                    {data?.phone}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleOnConfirmLogout}>
                                <LogoutIcon/>
                                <Typography marginLeft={2} textAlign="center">
                                    Logout
                                </Typography>
                            </MenuItem>
                            <ConfirmDialog
                                open={onConfirmLogout}
                                handleOk={handleLogout}
                                handleCancel={() => {
                                    setOnConfirmLogout(false);
                                    handleCloseUserMenu();
                                }}
                                title="Do you want to sign out?"
                            />
                        </Menu>
                        <CustomMenu
                            anchorEl={anchorElNoti}
                            open={Boolean(anchorElNoti)}
                            onClose={handleCloseNotiMenu}
                            horizontal="right"
                        >
                            <MenuItem>
                                <Typography>HIHI</Typography>
                            </MenuItem>
                        </CustomMenu>
                    </Toolbar>
                </AppBar>
                <SideBar handleCloseDrawer={() => setMobileOpen(!mobileOpen)}/>
            </Box>
        </OpenDrawer.Provider>
    );
}

export default Header;
