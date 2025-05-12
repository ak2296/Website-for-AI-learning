// src/pages/Home.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {t('home')} {/* This displays "Home" or "Hem" depending on the language */}
      </Typography>
      <Typography variant="body1">
        {t('welcome')}
      </Typography>
    </div>
  );
}
