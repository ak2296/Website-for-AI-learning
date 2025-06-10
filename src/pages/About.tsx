import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Container, Typography, Box, Divider, Grid, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import type { GridProps } from "@mui/material/Grid";

interface AboutEntry {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
}

const fetchAbout = async (): Promise<AboutEntry> => {
  const response = await fetch("http://localhost:5000/api/about", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch about data");
  const data = await response.json();
  return data || {};
};

export default function About() {
  const { t } = useTranslation();

  const { data: entry, error, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: fetchAbout,
  });

  // Log screen width for debugging
  console.log("Window width:", window.innerWidth);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {(error as Error).message}</Typography>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth={false} sx={{ mt: 4, mb: 6, px: { xs: 2, md: 4 } }}>
        {/* Mission & Vision Section */}
        <Grid
          container
          spacing={4}
          sx={{
            my: 4,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between", // Align items to the top
          }}
        >
          {/* Left Column: Mission and Vision */}
          <Grid
            item
            xs={12}
            md={6}
            component="div"
            {...({ item: true } as GridProps)}
            sx={{ pr: { md: 4 } }} // Padding-right to separate text from image
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {entry?.id && entry.title ? entry.title : t("ourMission", "Our Mission")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry?.id && entry.content ? entry.content : t("ourMissionDescription", "Empowering companies to harness AI through innovative training and modern technology.")}
              </Typography>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {t("ourVision", "Our Vision")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("ourVisionDescription", "Fostering a tech-forward workforce equipped with the skills and insights needed to thrive in a digital age.")}
              </Typography>
            </Box>
          </Grid>
          {/* Right Column: Image */}
          {entry?.imagePath && (
            <Grid
              item
              xs={12}
              md={6}
              component="div"
              {...({ item: true } as GridProps)}
              sx={{ pl: 0, pr: 1}} // Remove padding to control spacing manually
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center", // Center the image within the Grid item
                }}
              >
                <Box
                  component="img"
                  src={`http://localhost:5000/uploads/${entry.imagePath}?t=${new Date().getTime()}`}
                  alt={entry?.title || "About Image"}
                  sx={{
                    width: "100%", // Full width of the Grid item
                    height: "auto", // Maintain aspect ratio
                    maxHeight: "300px", // Limit vertical size
                    borderRadius: 2,
                    boxShadow: "none",
                    ml: 1,
                    
                  }}
                  onError={(e) => console.log(`Image failed to load: http://localhost:5000/uploads/${entry.imagePath}`)}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Core Values Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t("OurValues", "Our Values")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("ourValuesDescription", "We value innovation, collaboration, and continuous learning. Our commitment is to make AI accessible, actionable, and impactful.")}
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