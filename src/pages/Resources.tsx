// src/pages/Resources.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

export default function Resources() {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {t("resources")}
      </Typography>
      <Typography variant="body1">
        {t("resourcesDescription", "Here are some resources to help you.")}
      </Typography>
    </div>
  );
}
