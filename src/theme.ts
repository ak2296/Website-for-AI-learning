// src/theme.ts (unchanged)
import { createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    header: {
      main: string;
    };
    footer: {
      main: string;
    };
  }
  interface PaletteOptions {
    header?: {
      main: string;
    };
    footer?: {
      main: string;
    };
  }
}

const createAppTheme = (mode: "light" | "dark") => {
  const defaultShadows = createTheme({ palette: { mode: "dark" } }).shadows;

  const palette = {
    mode,
    primary: {
      light: "#6573c3",
      main: "#3f51b5",
      dark: "#2c387e",
      contrastText: "#fff",
    },
    secondary: {
      light: "#dd33fa",
      main: "#d500f9",
      dark: "#9500ae",
      contrastText: "#000",
    },
    background: {
      default: mode === "dark" ? "#121212" : "#fff",
      paper: mode === "dark" ? "#1e1e1e" : "#fff",
    },
    text: {
      primary: mode === "dark" ? "#ffffff" : "#212121",
      secondary: mode === "dark" ? "#b0b0b0" : "#757575",
    },
    header: {
      main: mode === "dark" ? "#121212" : "#fff",
    },
    footer: {
      main: mode === "dark" ? "#1e1e1e" : "#2c387e",
    },
  };

  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette,
    typography: {
      fontFamily: "'Inter', 'Poppins', 'Roboto', sans-serif",
      h1: { fontSize: "2.5rem", fontWeight: 700 },
      h2: { fontSize: "2rem", fontWeight: 600 },
      h3: { fontSize: "1.75rem", fontWeight: 500 },
      body1: { fontSize: "1rem", fontWeight: 400 },
      body2: { fontSize: "0.875rem", fontWeight: 300 },
      button: { textTransform: "none" },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
    },
    shadows: mode === "light"
      ? new Array(25).fill("0px 8px 16px rgba(101, 115, 195, 0.5)") as Shadows
      : defaultShadows,
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
            boxShadow: mode === "light"
              ? "0px 4px 10px rgba(101, 115, 195, 0.5)"
              : "none",
          },
        },
      },
    },
  });
};

export default createAppTheme;