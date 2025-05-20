// src/pages/About.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography,  Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";

import { motion } from "framer-motion";

export default function About() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        {/* Header */}

        {/* Mission & Vision Section */}
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid item xs={12} md={12}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {t("ourMission", "Our Mission")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  "ourMissionDescription",
                  "Empowering companies to harness AI through innovative training and modern technology."
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {t("ourVision", "Our Vision")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  "ourVisionDescription",
                  "Fostering a tech-forward workforce equipped with the skills and insights needed to thrive in a digital age."

                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Core Values Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t("OurValues", "Our Values")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              "ourValuesDescription",
              "We value innovation, collaboration, and continuous learning. Our commitment is to make AI accessible, actionable, and impactful."
            )}
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 AI Learning. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
}

