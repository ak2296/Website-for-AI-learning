// src/components/Contact.tsx
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";

type FormData = {
  name: string;
  email: string;
  message: string;
};

// Contact form component for submitting inquiries
export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        {success && <Alert severity="success" sx={{ mb: 1, boxShadow: "none" }}>{t("messageSent")}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 1, boxShadow: "none" }}>{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label={t("name", "Your Name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            aria-label="Name Input"
            sx={{
              input: { backgroundColor: "white" },
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.light,
                },
              },
            }}
          />
          <TextField
            label={t("email", "Your Email")}
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            type="email"
            fullWidth
            required
            aria-label="Email Input"
            sx={{
              input: { backgroundColor: "white" },
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.light,
                },
              },
            }}
          />
          <TextField
            label={t("message", "Your Message")}
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            required
            aria-label="Message Input"
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "1",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.light,
                },
              },
              "& .MuiOutlinedInput-input": { backgroundColor: "white", padding: "0" },
              "& textarea": { backgroundColor: "white", padding: "0" },
            }}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-flex", width: "fit-content" }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={loading}
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
              {loading ? <CircularProgress size={24} /> : t("send", "Send Message")}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
}