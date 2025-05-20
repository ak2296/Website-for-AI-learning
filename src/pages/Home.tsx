// src/pages/Home.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
// Import some Material UI icons for feature illustrations
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";

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
        {/* Page Title */}
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
         
        </Typography>

        {/* Hero Section: Image on left, text on right, vertically centered */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center", // Vertical centering for medium/large screens
            justifyContent: "center",
            mb: 6,
          }}
        >
           <Box
            sx={{
              mr: { xs: 0, md: 4 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t("Motto")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", mb: 2 }}>
              {t("MottoDescription")}
            </Typography>
          </Box>
          
          {/* Image on the right */}
          <Box
            component="img"
            src="https://bing.com/th/id/BCO.9230329a-290d-445b-bb3c-ef9dd1a937de.png"
            alt="AI and Technology Illustration"
            sx={{
              width: { xs: "80%", md: "40%" },
              maxWidth: 500,
              borderRadius: 2,
              boxShadow: 3,
              mb: { xs: 2, md: 0 },
            }}
          />
         
        </Box>

       {/* Feature Boxes Section */}
        <Grid
          container
          spacing={4}
          sx={{
            mb: 6,
            justifyContent: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Feature Box 1 */}
          <Grid item sx={{ width: { xs: "100%", md: "32vw" } }}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                height: "100%",
              }}
            >
              <CodeIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t("CuttingEdge")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("CuttingEdgeDescription")}
              </Typography>
            </Box>
          </Grid>

          {/* Feature Box 2 */}
          <Grid item sx={{ width: { xs: "100%", md: "32vw" } }}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                height: "100%",
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t("ExpertTutorials")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("ExpertTutorialsDescription")}
              </Typography>
            </Box>
          </Grid>

          {/* Feature Box 3 */}
          <Grid item sx={{ width: { xs: "100%", md: "32vw" } }}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                height: "100%",
              }}
            >
              <PeopleIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t("CommunitySupport")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("CommunitySupportDescription")}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Call-to-Action Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            component="a"
            href="/resources"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            {t("exploreResources")}
          </Button>
        </Box>
      </Container>
    </motion.div>
  );
}