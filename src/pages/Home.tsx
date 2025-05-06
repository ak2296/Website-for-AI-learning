// src/pages/Home.tsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Welcome to Your AI Learning Platform</h1>
      <p>This is the home page.</p>
    </motion.div>
  );
}
