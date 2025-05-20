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
  alpha,
} from "@mui/material";
import type { Theme } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Brightness4,
  Brightness7,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
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

  // Debug: Log theme values
  React.useEffect(() => {
    console.log("Theme mode:", mode);
    console.log("Header color:", muiTheme.palette.header.main);
    console.log("Background default:", muiTheme.palette.background.default);
  }, [mode, muiTheme]);

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
          
          width: "100vw",
          margin: 0,
          backgroundColor: muiTheme.palette.background.default,
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: (theme: Theme) => theme.palette.header.main,
            color: (theme: Theme) => theme.palette.text.primary,
            boxShadow: "none",
            borderBottom: (theme: Theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.3)"
                : `1px solid ${theme.palette.divider}`,
            padding: 0,
            margin: 0,
            "& .MuiToolbar-root": {
              backgroundColor: "inherit",
            },
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
                backgroundColor: "inherit",
              }}
            >
              <Typography variant="h5" component={Link}
                  to="/" sx={{
                    textDecoration: "none",
                    color: (theme: Theme) => theme.palette.text.primary, 
                    fontWeight: "bold", 
                   
                  }}>
                    {t("yourWebsite")}
                    </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "inherit",
                }}
              >
                <Box
                  component="img"
                  src="./Pics/Logo.png"
                  alt="Logo"
                  sx={{ height: "70px" }}
                />
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    mt: 1,
                    color: (theme: Theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.primary.light
                        : theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: (theme: Theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.2)",
                    },
                    transition: "background-color 0.3s",
                  }}
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
                padding: 3,
                pb: 0,
                minHeight: "220px",
                backgroundColor: "inherit",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  pb: 1,
                  backgroundColor: "inherit",
                }}
              >
                <Typography
                  component={Link}
                  to="/"
                  variant="h4"
                  sx={{
                    textDecoration: "none",
                    color: (theme: Theme) => theme.palette.text.primary, 
                    fontWeight: "bold", 
                   
                  }}
                >
                    {t("yourWebsite")}
                </Typography>

                <Box
                  component="img"
                  src="./Pics/Logo.png"
                  alt="Logo"
                  sx={{ height: "70px" }}
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
                  backgroundColor: "inherit",
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      mx: 1,
                      px: 1,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      color:
                        mode === "dark" ? "white" : muiTheme.palette.text.primary,
                      pb: 0,
                      borderBottom:
                        location.pathname === link.path
                          ? "3px solid #ff9800"
                          : "3px solid transparent",
                      borderRadius: "0px",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color:
                          mode === "dark"
                            ? "white"
                            : muiTheme.palette.primary.main,
                        borderBottom:
                          location.pathname === link.path
                            ? "3px solid #ff9800"
                            : `3px solid ${muiTheme.palette.primary.main}`,
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        transform: "scale(1.1)",
                      },
                      transition: "transform 0.2s, color 0.2s, border-bottom 0.2s",
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
                    backgroundColor: "inherit",
                  }}
                >
                  <IconButton
                    onClick={toggleMode}
                    sx={{
                      px: 1,
                      borderRadius: "50%",
                      color: (theme: Theme) =>
                        theme.palette.mode === "light"
                          ? theme.palette.primary.light
                          : "white",
                      "&:hover": {
                        backgroundColor: (theme: Theme) =>
                          alpha(theme.palette.primary.light, 0.2),
                      },
                      transition: "background-color 0.3s",
                    }}
                  >
                    {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                  <LanguageSwitcher
                    mode={mode}
                    sx={{
                      px: 0,
                      py: 0,
                      "&:hover": {
                        backgroundColor: (theme: Theme) =>
                          theme.palette.mode === "light"
                            ? alpha(theme.palette.primary.light, 0.2)
                            : theme.palette.action.hover,
                      },
                      transition: "background-color 0.3s",
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
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme: Theme) =>
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.primary.light, 0.2)
                          : theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <span
                        style={{
                          display: "inline-block",
                          transition: "transform 0.2s",
                        }}
                        className="nav-text"
                      >
                        {link.label}
                      </span>
                    }
                    sx={{
                      "&:hover .nav-text": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
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
                  drawer
                  mode={mode}
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme: Theme) =>
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.primary.light, 0.2)
                          : theme.palette.action.hover,
                    },
                    transition: "background-color 0.3s",
                  }}
                />
                <IconButton
                  onClick={toggleMode}
                  sx={{
                    px: 1,
                    color: (theme: Theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.primary.light
                        : "white",
                    "&:hover": {
                      backgroundColor: (theme: Theme) =>
                        alpha(theme.palette.primary.light, 0.2),
                    },
                    transition: "background-color 0.3s",
                  }}
                >
                  <Brightness7 />
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
            backgroundColor: muiTheme.palette.background.default,
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
            bgcolor: muiTheme.palette.footer.main,
            color: muiTheme.palette.primary.contrastText,
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
              href="https://instagram.com"
              target="_blank"
              sx={{ color: "white" }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://youtube.com"
              target="_blank"
              sx={{ color: "white" }}
            >
              <YouTubeIcon />
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
      </Box>
    </>
  );
}