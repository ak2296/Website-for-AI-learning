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
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
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
              input: { backgroundColor: "white" },
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: (theme) => theme.palette.primary.light }, // ✅ Changes hover border color to primary.light
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
              input: { backgroundColor: "white" },
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: (theme) => theme.palette.primary.light }, // ✅ Fixes black hover border issue
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
                padding: "0",
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: (theme) => theme.palette.primary.light }, // ✅ Ensures textarea hover border follows primary.light
              },
              "& .MuiOutlinedInput-input": { backgroundColor: "white", padding: "0" },
              "& textarea": { backgroundColor: "white", padding: "0" },
            }}
          />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: "inline-flex", width: "fit-content" }} // 
        >
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: (theme) => theme.shadows[4],
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
                transform: "scale(1.05)",
              },
              transition: "0.3s ease-in-out",
            }}
          >
            {t("send", "Send Message")}
          </Button>
        </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
}
