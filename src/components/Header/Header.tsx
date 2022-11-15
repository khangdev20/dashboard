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
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import { useState, useEffect, useCallback, createContext } from "react";
import { useApi } from "../../hooks/useApi";
import { UserEntity } from "../../models/UserEntity";
import { REQUEST_TYPE } from "../../Enums/RequestType";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../Dialog/ConfirmDialog";
import { CustomMenu } from "../Menu/CustomMenu";
import SiderBar from "../Sider/SideBar";

export const OpenDrawer = createContext(false);

export default function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNoti, setAnchorElNoti] = useState<null | HTMLElement>(null);
  const { callApi } = useApi();
  const [data, setData] = useState<UserEntity>();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [onConfirmLogout, setOnConfirmLogout] = useState(false);

  const handleOnConfirmLogout = () => setOnConfirmLogout(true);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    navigate("/login");
  };
  useEffect(() => {
    const getNewToken = setInterval(() => {
      callApi<string>(REQUEST_TYPE.GET, "api/users/getNewToken")
        .then((res) => {
          const response = res.data;
          console.log(response);
          sessionStorage.setItem("jwt", response);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 1200000);
    return () => clearInterval(getNewToken);
  }, []);

  const getProfile = useCallback(() => {
    callApi<UserEntity>(REQUEST_TYPE.GET, "api/users/profile")
      .then((res) => {
        if (res) setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  useEffect(() => {
    getProfile();
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
            width: { sm: `calc(100% - ${200}px)` },
            ml: { sm: `${200}px` },
            background: "#FFF",
          }}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
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
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ marginLeft: 3 }} onClick={handleOpenNotiMenu}>
              <Badge badgeContent={10} color="error">
                <EmailIcon />
              </Badge>
            </IconButton>
            <Tooltip
              style={{ marginRight: 10, marginLeft: 20 }}
              title="Open settings"
            >
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://cdnnews.mogi.vn/news/wp-content/uploads/2022/04/meo-vao-nha-la-diem-gi-1.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
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
                <Typography marginLeft={2} textAlign="center">
                  Name:
                  {data?.name}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography marginLeft={2} textAlign="center">
                  Role:
                  {data?.role}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography marginLeft={2} textAlign="center">
                  Phone:
                  {data?.phone}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleOnConfirmLogout}>
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
        <SiderBar handleCloseDrawer={() => setMobileOpen(!mobileOpen)} />
      </Box>
    </OpenDrawer.Provider>
  );
}
