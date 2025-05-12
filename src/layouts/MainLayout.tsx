// src/layouts/MainLayout.tsx
import React, { useState, useMemo, Fragment } from "react";
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
  useTheme,
  Divider
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Paper from "@mui/material/Paper";

export default function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  // ----- Dark/Light Mode State & Toggle -----
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // ----- Create Material UI Theme -----
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" }
        }
      }),
    [mode]
  );

  // ----- Responsive Detection -----
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // ----- Drawer (Mobile Navigation) State & Toggle -----
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  // ----- Define Navigation Links -----
  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("about"), path: "/about" },
    { label: t("resources"), path: "/resources" },
    { label: t("contact"), path: "/contact" }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ===================== HEADER SECTION ===================== */}
      <AppBar position="static">
        {isMobile ? (
          // ----- Mobile Header -----
          // A single-row header with the site name on the left 
          // and a vertical stack (logo on top, hamburger below) on the right.
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "100px",
              px: 2,
              pb: 0 // Override default bottom padding to 0.
            }}
          >
            <Typography variant="h5">{t("yourWebsite")}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
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
          // ----- Desktop Header -----
          // Three rows within a vertical Toolbar.
          <Toolbar
            sx={{
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              p: 1,
              pb: 0, // Remove extra bottom padding.
              minHeight: "220px"
            }}
          >
            {/* Row 1: Site Name & Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                pb: 1
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

            {/* Row 2: Empty */}
            <Box sx={{ px: 3, pb: 1 }}></Box>

            {/* Row 3: Navigation Menu + Dark Mode & Language Selector */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                px: 3,
                pb: 0 // Reduced bottom padding so the underline is nearly flush with header's bottom edge.
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
                    pb: 0, // Minimal bottom padding for active underline.
                    // Active indicator: bottom border (change color here as desired).
                    borderBottom:
                      location.pathname === link.path
                        ? "3px solid #ff9800" // Active underline color.
                        : "3px solid transparent",
                        borderRadius: "0px",
                    "&:hover": {
                      color: "white", // Keep text white on hover.
                      borderBottom:
                        location.pathname === link.path
                          ? "3px solid #ff9800"
                          : "3px solid rgba(255,255,255,0.7)",
                          borderRadius: "0px",
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
              {/* Right-side container: Dark Mode Toggle and Language Selector */}
              <Box
                sx={{
                  position: "absolute",
                  right: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1 // Gap between the dark mode button and the language selector.
                }}
              >
                <IconButton color="inherit" onClick={toggleMode}>
                  {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <LanguageSwitcher
                sx={{
                  
              
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Completely remove the border
                  },
                  "&:hover": {
                    backgroundColor: mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)" // Bright hover for dark mode
                      : "rgba(0, 0, 0, 0.1)", // Dark hover for light mode
                  },
                }}
                 />
              </Box>
            </Box>
          </Toolbar>
        )}
      </AppBar>

      {/* ===================== DRAWER (MOBILE NAVIGATION) SECTION ===================== */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: { xs: "50vw", sm: "40vw" }, // Drawer width set as a percentage of the viewport.
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Navigation List */}
          <Box sx={{ flexGrow: 1 }}>
            <List>
              {navLinks.map((link) => (
                <ListItemButton
                key={link.path}
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  color: mode === "dark" ? "white" : "black", // Keep text color consistent
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)" // Bright hover for dark mode
                    : "rgba(0, 0, 0, 0.04)", // Dark hover for light mode
                    color: "inherit", // **Prevents text color from changing on hover**
                  }
                  }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
              
              ))}
            </List>
          </Box>

          {/* Divider Above Bottom Controls */}
          <Divider />

          {/* Bottom Row in Drawer: Language Selector and Dark Mode Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              px: 2,
              py: 1
            }}
          >
            <LanguageSwitcher drawer
             sx={{
              color: mode === "dark" ? "white" : "black", // Dynamically set text color
              "& .MuiSelect-select": {
                color: mode === "dark" ? "white" : "black", // Ensure the selected text is also styled
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // Completely remove the border
              },
              "&:hover": {
                backgroundColor: mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)" // Bright hover for dark mode
                  : "rgba(0, 0, 0, 0.04)", // Dark hover for light mode
              },
            }}
            />
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <Box sx={{ p: 2, minHeight: "calc(100vh - 240px)" }}>
        <Outlet />
      </Box>

      {/* ===================== FOOTER SECTION ===================== */}
<Paper
  component="footer"
  square
  elevation={3} // Adds a subtle shadow
  sx={{
    textAlign: "center",
    py: 3,
    bgcolor: mode === "dark" ? "rgba(0, 0, 0, 0.8)" : theme.palette.primary.main, // Dynamic background color
    color: mode === "dark" ? "white" : "inherit", // Dynamic text color
    position: "absolute", // Attach footer to the bottom
    bottom: 0,
    left: 0,
    right: 0,
  }}
    >
  <Typography variant="body1" sx={{ mb: 1 }}>
    © 2025 {t("yourWebsite")}
  </Typography>
  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
    <IconButton
      component="a"
      href="https://facebook.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <FacebookIcon />
    </IconButton>
    <IconButton
      component="a"
      href="https://twitter.com"
      target="_blank"
      sx={{ color: "white" }}
    >
      <TwitterIcon />
    </IconButton>
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
    </ThemeProvider>
  );
}
