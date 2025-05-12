// src/pages/About.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {t("about")}
      </Typography>
      <Typography variant="body1">
        {t("aboutDescription", "This page gives you information about our website.")}
      </Typography>
    </div>
  );
}
