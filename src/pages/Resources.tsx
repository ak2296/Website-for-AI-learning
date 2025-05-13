import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  MobileStepper,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

type Resource = {
  id: number;
  title: string;
  body: string;
};

const fetchResources = async (): Promise<Resource[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) throw new Error("Failed to fetch resources");
  return await response.json();
};

export default function Resources() {
  const { data, error, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0); // Track the current step

  if (isLoading) return <CircularProgress />;
  if (error instanceof Error)
    return <Typography color="error">Error: {error.message}</Typography>;

  // ----- Calculate Cards Per Page Dynamically -----
  const cardsPerRow = isMobile ? 1 : 4; // 1 card per row on mobile, 3 on larger screens
  const cardsPerPage = cardsPerRow * 2; // Show 2 rows of cards per page

  // Group data into chunks of cardsPerPage
  const groupedData: Resource[][] = useMemo(() => {
    const groups: Resource[][] = [];
    for (let i = 0; i < (data ?? []).length; i += cardsPerPage) {
      groups.push((data ?? []).slice(i, i + cardsPerPage));
    }
    return groups;
  }, [data, cardsPerPage]);

  const maxSteps = groupedData.length; // Total number of steps

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom>
          Resources
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {groupedData[activeStep]?.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card
                sx={{
                  height: 400,
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    maxHeight: 300,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {resource.title}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/resources/group/${activeStep}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    ml: 2,
                    mb: 2,
                    ...(theme.palette.mode === "dark" && {
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }),
                  }}
                >
                  View More
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stepper for navigation */}
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px", // Add spacing between buttons and dots
    marginTop: "16px",
  }}
>
  {/* Back Button */}
  <Button
  size="small"
  onClick={handleBack}
  disabled={activeStep === 0}
  sx={{
    color: theme.palette.mode === "dark" ? "white" : theme.palette.primary.main, // Adjust color for dark mode
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)" // Subtle hover effect for dark mode
          : theme.palette.primary.light,
    },
  }}
>
  {theme.direction === "rtl" ? (
    <KeyboardArrowRight />
  ) : (
    <KeyboardArrowLeft />
  )}
  Back
</Button>

  {/* Manually Render Clickable Dots */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    }}
  >
    {Array.from({ length: maxSteps }).map((_, index) => (
      <span
        key={index}
        onClick={() => setActiveStep(index)} // Navigate to the clicked dot
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor:
            activeStep === index
            ? theme.palette.mode === "dark"
            ? "#ff9800" // Active dot color for dark mode
            : theme.palette.primary.main // Active dot color for light mode
          : theme.palette.grey[400], // Inactive dot color
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      />
    ))}
  </div>

  {/* Next Button */}
  <Button
  size="small"
  onClick={handleNext}
  disabled={activeStep === maxSteps - 1}
  sx={{
    color: theme.palette.mode === "dark" ? "white" : theme.palette.primary.main, // Adjust color for dark mode
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)" // Subtle hover effect for dark mode
          : theme.palette.primary.light,
    },
  }}
>
  Next
  {theme.direction === "rtl" ? (
    <KeyboardArrowLeft />
  ) : (
    <KeyboardArrowRight />
  )}
</Button>
</div>
      </motion.div>
    </Container>
  );
}