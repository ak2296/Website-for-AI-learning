import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Routes>
      {/* Wrap your routes using MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Default (index) route */}
        <Route index element={<Home />} />
        {/* The /about route */}
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
