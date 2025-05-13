import { createTheme } from "@mui/material/styles";

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

// Function to create the theme dynamically based on the mode
const createAppTheme = (mode: "light" | "dark") =>
  createTheme({
    breakpoints: {
      values: {
        xs: 0, // Extra small devices
        sm: 600, // Small devices (starts at 600px)
        md: 767, // Medium devices (starts at 767px)
        lg: 960, // Large devices (starts at 960px)
        xl: 1280, // Extra large devices
      },
    },
    palette: {
      mode, // Dynamically set the mode (light or dark)
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
        default: mode === "dark" ? "#121212" : "#f0f0f0",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#212121", // White text for dark mode, black for light mode
        secondary: mode === "dark" ? "#b0b0b0" : "#757575", // Lighter text for dark mode
      },
      header: {
        main: mode === "dark" ? "#333333" : "#3f51b5", // Custom header color
      },
      footer: {
        main: mode === "dark" ? "#1e1e1e" : "#2c387e", // Custom footer color
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
        textTransform: "none",
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
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

export default createAppTheme;