import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Container, Box, Typography, Grid, Button, Card, CardContent, useTheme, CircularProgress } from "@mui/material";
import type { GridProps } from "@mui/material/Grid";
import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";

interface HomeEntry {
  id?: number;
  title: string | null;
  description: string | null;
  imagePath?: string | null;
}

const fetchHome = async (): Promise<HomeEntry> => {
  const response = await fetch("http://localhost:5000/api/home");
  if (!response.ok && response.status === 404) {
    return { title: null, description: null, imagePath: null }; // Match HomeEntry type
  }
  if (!response.ok) throw new Error("Failed to fetch home data");
  return response.json();
};

export default function Home() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: entry, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [heroImageLoaded, setHeroImageLoaded] = useState(true); // Start with true to avoid flash
  const [brainImageLoaded, setBrainImageLoaded] = useState(true); // Start with true to avoid flash

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "row" },
            alignItems: "center",
            justifyContent: { xs: "center", sm: "space-between", md: "space-between" },
            mb: 6,
          }}
        >
          <Box sx={{ flex: 1, pr: { md: 4 } }}>
            <Typography variant="h2" component="h1" gutterBottom>
              {entry?.title || t("Motto")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", mb: 2 }}>
              {entry?.description || t("MottoDescription")}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {t("experienceTheSeamlessIntegration")}
            </Typography>
            <Button variant="contained" size="large">
              {t("exploreResources")}
            </Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              component="img"
              src={entry?.imagePath ? `http://localhost:5000/uploads/${entry.imagePath}` : "/Pics/AI-1.webp"}
              alt="AI and Technology Illustration"
              onError={(e) => {
                console.log("Hero image failed to load", {
                  attemptedPath: entry?.imagePath ? `http://localhost:5000/uploads/${entry.imagePath}` : "/Pics/AI-1.webp",
                  error: e.nativeEvent,
                });
                setHeroImageLoaded(true);
              }}
              onLoad={() => {
                console.log("Hero image loaded successfully");
                setHeroImageLoaded(true);
              }}
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: "none",
                mt: { xs: 4, sm: 0, md: 0 },
                ml: { sm: 5 },
                display: heroImageLoaded ? "block" : "none",
              }}
            />
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {t("OurFeatures")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            {t("discoverCuttingEdgeTools")}
          </Typography>
          <Grid container spacing={2}>
            <Grid
              item
              sx={{ width: { xs: "100%", sm: "28vw", md: "30vw" } }}
              component="div"
              {...({ item: true } as GridProps)}
            >
              <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: theme.palette.background.paper, textAlign: "center", height: "100%" }}>
                <CodeIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t("CuttingEdge")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Leverage the latest technology to stay ahead in your field.")}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              sx={{ width: { xs: "100%", sm: "28vw", md: "30vw" } }}
              component="div"
              {...({ item: true } as GridProps)}
            >
              <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: theme.palette.background.paper, textAlign: "center", height: "100%" }}>
                <SchoolIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t("ExpertTutorials")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("ExpertTutorialsDescription")}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              sx={{ width: { xs: "100%", sm: "28vw", md: "30vw" } }}
              component="div"
              {...({ item: true } as GridProps)}
            >
              <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: theme.palette.background.paper, textAlign: "center", height: "100%" }}>
                <PeopleIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t("CommunitySupport")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("CommunitySupportDescription")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Impact/Metrics Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              component="img"
              src="/Pics/Brain-1.png"
              alt="AI Brain"
              onError={(e) => {
                console.log("Metrics image failed to load", {
                  attemptedPath: "/Pics/Brain-1.png",
                  error: e.nativeEvent,
                });
              }}
              onLoad={() => {
                console.log("Metrics image loaded successfully");
                setBrainImageLoaded(true);
              }}
              sx={{
                width: "10%",
                borderRadius: 2,
                boxShadow: "none",
                display: brainImageLoaded ? "block" : "block", // Always visible
              }}
            />
          </Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t("OurImpact")}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} component="div" {...({ item: true } as GridProps)}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" color={theme.palette.primary.main}>
                  500+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("CompaniesTrained")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} component="div" {...({ item: true } as GridProps)}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" color={theme.palette.primary.main}>
                  3000+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("StaffEmpowered")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} component="div" {...({ item: true } as GridProps)}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" color={theme.palette.primary.main}>
                  50+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("ExpertInstructors")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {t("Testimonials")}
          </Typography>
          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} md={6} component="div" {...({ item: true } as GridProps)}>
              <Card sx={{ boxShadow: 0.5, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    "{t("TestimonialsDescription1")}"
                  </Typography>
                  <Typography variant="subtitle1">
                    - Jane Doe, {t("TechManager")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} component="div" {...({ item: true } as GridProps)}>
              <Card sx={{ boxShadow: 0.5, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    "{t("TestimonialsDescription2")}"
                  </Typography>
                  <Typography variant="subtitle1">
                    - John Smith, {t("HRDirector")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            {t("ReadyTo")}
          </Typography>
          <Button variant="contained" size="large">
            {t("GetStarted")}
          </Button>
        </Box>
      </Container>
    </motion.div>
  );
}