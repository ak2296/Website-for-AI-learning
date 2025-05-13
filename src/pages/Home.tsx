// src/pages/Home.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
        <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t('home')} {/* This displays "Home" or "Hem" depending on the language */}
      </Typography>
      <Typography variant="body1">
        {t('welcome')}
      </Typography>
      </Container>
      </motion.div>
  );
}
