import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import createAppTheme from "./theme"; // Import the dynamic theme creation function
import MainLayout from "./layouts/MainLayout";


// Import your pages
import Home from "./pages/Home";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import ResourceDetail from "./pages/ResourceDetail";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const location = useLocation();

  // ----- Dark/Light Mode State & Toggle -----
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // ----- Create Material UI Theme -----
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<MainLayout toggleMode={toggleMode} mode={mode} />}
          >
            <Route index element={<Home />} />
            <Route path="about" 
            element={<About />} />
            <Route
              path="resources"
              element={
                <ErrorBoundary>
                  <Resources />
                </ErrorBoundary>
              }
            />
            <Route
              path="/resources/:id" 
              element={<ResourceDetail />}
              
            />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<AdminPanel />} /> 
            <Route path="/admin/dashboard" element={<Dashboard />} /> 
          </Route>
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}