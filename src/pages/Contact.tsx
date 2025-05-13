// src/pages/Contact.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from '@mui/icons-material/Send';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          {t("contact")}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField 
            label={t("name", "Your Name")} 
            variant="outlined" 
            fullWidth 
            aria-label="Name Input"
            sx={{
              input: {
                backgroundColor: "white", // Set the input field background to white
              },
            }}
          />
          <TextField 
            label={t("email", "Your Email")} 
            variant="outlined" 
            type="email" 
            fullWidth 
            aria-label="Email Input"
            sx={{
              input: {
                backgroundColor: "white", // Set the input field background to white
              },
            }}
          />
          <TextField
            label={t("message", "Your Message")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            aria-label="Message Input"
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "0", // Remove padding inside the outlined input
              },
              "& .MuiOutlinedInput-input": {
                backgroundColor: "white", // Set the textarea background to white
                padding: "0", // Remove padding inside the textarea
              },
              "& textarea": {
                backgroundColor: "white", // Ensure the textarea itself has a white background
                padding: "0", // Remove padding inside the textarea
              },
            }}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="contained" color="primary" endIcon={<SendIcon />}>
              {t("send", "Send Message")}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
}
