// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Import your pages (create these if they don't exist)
import Home from "./pages/Home";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      {/* Parent route using MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Index route renders Home */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="resources" element={<Resources />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
