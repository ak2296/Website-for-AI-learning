// src/main.tsx
import "./index.css";
import "./i18n";
import React from "react";
import { useState } from "react"; // Import useState for mode management
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createAppTheme from "./theme"; // Import the function
import { Helmet } from "react-helmet";

const queryClient = new QueryClient();

function Root() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createAppTheme(mode); // Create Theme object

  return (
    <React.StrictMode>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Root />);