import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { BorderColor, Logout, PersonRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Account_service } from "../../services/account_service";
import React from "react";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const theme = useTheme();
  let navigate = useNavigate();

  const logout = () => {
    Account_service.logout();
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openP = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const [notif, setNotif] = React.useState(null);
  const openNotif = Boolean(notif);
  const handleClickNotif = (event) => {
    setNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setNotif(null);
  };

  const [notifications, setNotifications] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  // useEffect(() => {
  //   const socket = io('http://localhost:8086');
  
  //   socket.on('notification', (notification) => {
  //     console.log('Nouvelle notification:', notification);
  //     // Incrémentez le nombre de nouvelles notifications
  //     setNewNotificationsCount(prevCount => prevCount + 1);
  //     // Ajoutez la notification à la liste des notifications
  //     setNotifications(prevNotifications => [...prevNotifications, notification]);
  //   });
  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  
  const handleOpenNotifications = () => {
    // Réinitialisez le compteur de nouvelles notifications
    setNewNotificationsCount(0);
    // Ouvrez le menu des notifications
    handleClickNotif();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#000000",
      }}
      // @ts-ignore
      open={open}
    >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,

            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box flexGrow={1} />

        <Stack direction={"row"}>
          {theme.palette.mode === "light" ? (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
            >
              <LightModeOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <DarkModeOutlinedIcon />
            </IconButton>
          )}

          <div>
            <Button
              id="basic-button"
              aria-controls={openNotif ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotif ? "true" : undefined}
              onClick={handleClickNotif}
            >
              <StyledBadge
                badgeContent={newNotificationsCount}
                color="error"
                max={99}
                sx={{ mr: 3 }}
              >
                <IconButton aria-label="cart" onClick={handleOpenNotifications}>
                  <NotificationsNoneOutlinedIcon />
                </IconButton>
              </StyledBadge>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={notif}
              open={openNotif}
              onClose={handleCloseNotif}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {notifications.map((notification, index) => (
                <MenuItem key={index} onClick={handleCloseNotif}>
                  {notification}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Stack direction="row" spacing={2}>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </Stack>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openP}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose} component={Link} to="profile">
                <IconButton color="inherit">
                  <PersonRounded />
                </IconButton>
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <IconButton color="inherit">
                  <BorderColor />
                </IconButton>
                Modifier Compte
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                <IconButton color="inherit">
                  <Logout />
                </IconButton>
                Déconnecter
              </MenuItem>
            </Menu>
          </div>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
