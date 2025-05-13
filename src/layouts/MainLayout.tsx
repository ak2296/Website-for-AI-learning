import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemText,
  useMediaQuery,
  Divider,
  Paper,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7, YouTube as YouTubeIcon, Instagram as InstagramIcon } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

interface MainLayoutProps {
  toggleMode: () => void;
  mode: "light" | "dark";
}

export default function MainLayout({ toggleMode, mode }: MainLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("about"), path: "/about" },
    { label: t("resources"), path: "/resources" },
    { label: t("contact"), path: "/contact" },
  ];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar position="static"
         sx={{
          backgroundColor:
            mode === "dark"
              ? "rgba(0, 0, 0, 0.8)" // Dark mode header color
              : muiTheme.palette.primary.main, // Light mode header color
          color: "white", // Adjust text color
        }}
        >
          {isMobile ? (
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "100px",
                px: 2,
                pb: 0,
              }}
            >
              <Typography variant="h5">{t("yourWebsite")}</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src="/logo192.png"
                  alt="Logo"
                  sx={{ height: "40px" }}
                />
                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{ mt: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          ) : (
            <Toolbar
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                p: 1,
                pb: 0,
                minHeight: "220px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  pb: 1,
                }}
              >
                <Typography variant="h4">{t("yourWebsite")}</Typography>
                <Box
                  component="img"
                  src="/logo192.png"
                  alt="Logo"
                  sx={{ height: "50px" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  px: 3,
                  pb: 0,
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      mx: 1,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      color: "white",
                      pb: 0,
                      borderBottom:
                        location.pathname === link.path
                          ? "3px solid #ff9800"
                          : "3px solid transparent",
                      borderRadius: "0px",
                      "&:hover": {
                        color: "white",
                        borderBottom:
                          location.pathname === link.path
                            ? "3px solid #ff9800"
                            : "3px solid rgba(255,255,255,0.7)",
                        borderRadius: "0px",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Box
                  sx={{
                    position: "absolute",
                    right: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <IconButton color="inherit" onClick={toggleMode}>
                    {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                  <LanguageSwitcher
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover": {
                        backgroundColor:
                          mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Toolbar>
          )}
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250, position: "relative", height: "100%" }}>
            <List sx={{ pt: 8 }}>
              {navLinks.map((link) => (
                <ListItemButton
                  key={link.path}
                  component={Link}
                  to={link.path}
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}
            </List>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pb: 2,
              }}
            >
              <Divider sx={{ width: "90%", mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <LanguageSwitcher
                  sx={{
                    color: mode === "dark" ? "white" : "black",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
                <IconButton color="inherit" onClick={toggleMode}>
                  {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Drawer>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: "50px",
          }}
        >
          <Outlet />
        </Box>

        <Paper
  component="footer"
  square
  elevation={3}
  sx={{
    textAlign: "center",
    py: 3,
    bgcolor:
      mode === "dark"
        ? "rgba(0, 0, 0, 0.8)" // Dark mode footer color
        : muiTheme.palette.primary.main, // Light mode footer color
    color: "white", // Adjust text color
  }}
>
  <Typography variant="body1" sx={{ mb: 1 }}>
    © 2025 {t("yourWebsite")}
  </Typography>
  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
    {/* Facebook Icon */}
    <IconButton
      component="a"
      href="https://facebook.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <FacebookIcon />
    </IconButton>

    
    {/* Instagram Icon */}
    <IconButton
      component="a"
      href="https://instagram.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <InstagramIcon />
    </IconButton>

    {/* YouTube Icon */}
    <IconButton
      component="a"
      href="https://youtube.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <YouTubeIcon />
    </IconButton>

    {/* LinkedIn Icon */}
    <IconButton
      component="a"
      href="https://linkedin.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <LinkedInIcon />
    </IconButton>
  </Box>
</Paper>
      </Box>
    </>
  );
}