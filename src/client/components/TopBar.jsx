import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { BorderColor, Logout, PersonRounded } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Account_service } from "../../services/account_service";
import React from "react";
import Avatar from "@mui/material/Avatar";

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

const topBar = ({ open, setMode }) => {
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

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#0e7190" : "#000000",
      }}
      // @ts-ignore
      open={open}
    >
      <Toolbar>
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" fontSize={30} noWrap sx={{ flexGrow: 1 }}>
        Interventix 
        </Typography>
        <Button color="inherit" onClick={() => navigate("accueil")}>
          Accueil
        </Button>
        {/* Ticket Creation Link */}
        <Button color="inherit" onClick={() => navigate("creer-ticket")}>
          Créer Ticket
        </Button>
        {/* Ticket Consultation Link */}
        <Button color="inherit" onClick={() => navigate("consulter_tickets")}>
          Consulter Tickets
        </Button>
        {/* Feedback Link */}
        <Button color="inherit" onClick={() => navigate("feedback")}>
          Avis
        </Button>
        {/* Ticket History Link */}
        <Button color="inherit" onClick={() => navigate("historique")}>
          Historique des Tickets
        </Button>
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
              color="inherit"
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

          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>

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
          <div></div>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default topBar;
