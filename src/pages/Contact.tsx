// src/pages/Contact.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography, Box, TextField, Button } from "@mui/material";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t("contact")}
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField label={t("name", "Your Name")} variant="outlined" fullWidth />
        <TextField label={t("email", "Your Email")} variant="outlined" type="email" fullWidth />
        <TextField
          label={t("message", "Your Message")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />
        <Button variant="contained" color="primary">
          {t("send", "Send Message")}
        </Button>
      </Box>
    </Container>
  );
}
