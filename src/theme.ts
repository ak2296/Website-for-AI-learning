// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // Default mode, can be dynamically changed
    primary: {
      main: "#1976d2", // Default primary color (blue)
      contrastText: "#ffffff", // Ensures readable text on primary backgrounds
    },
    secondary: {
      main: "#dc004e", // Default secondary color (red-pink)
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f4f4", // Light gray for subtle background contrast
      paper: "#ffffff", // Card/paper elements maintain white backgrounds
    },
    text: {
      primary: "#212121", // Standard readable text in light mode
      secondary: "#757575", // Slightly lighter secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.75rem", fontWeight: 500 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 300 },
    button: {
      textTransform: "none", // Prevents all-uppercase button text
    },
  },
  spacing: 8, // Base spacing unit (modify as needed)
  shape: {
    borderRadius: 8, // Standardized rounded corners for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
          padding: "10px 20px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default theme;
