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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px–767px
  const isLargeScreen = useMediaQuery(theme.breakpoints.between(767, 960)); // 767px–959px
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.between(960, 1200)); // 960px–1199px
  const isXLScreen = useMediaQuery(theme.breakpoints.up("xl")); // ≥1200px
  const [activeStep, setActiveStep] = useState(0); // Track the current step

  if (isLoading) return <CircularProgress />;
  if (error instanceof Error)
    return <Typography color="error">Error: {error.message}</Typography>;

  // Define the number of rows per page
  // Rows per page
const rowsPerPage = isMobile
? 6
: isMediumScreen
? 4
: isLargeScreen
? 3
: isExtraLargeScreen
? 2
: 2; // ≥1200px uses 2 rows

// Cards per row
const cardsPerRow = isMobile
? 1
: isMediumScreen
? 2
: isLargeScreen
? 3
: isExtraLargeScreen
? 4
: 4; // ≥1200px uses 4 cards per ro

 // Calculate the total number of cards per page
// Memoize cardsPerPage
const cardsPerPage = useMemo(
  () => cardsPerRow * rowsPerPage,
  [cardsPerRow, rowsPerPage]
);

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

     {/* Render Cards for the Current Step */}
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: isMobile ? "center" : "flex-start", // Center for single column, left-align for multiple columns
            alignItems: "center",
            paddingLeft: isMobile ? 0 : 10, // Add left padding for more than 1 column
          }}
        >
          {groupedData[activeStep]?.map((resource) => (
           <Grid item xs={12} sm={6} md={isLargeScreen ? 4 : 3} lg={3} key={resource.id}>
              <Card
                sx={{
                  minWidth:{ xs: "90vw", sm: "30vw", md:"18vw",lg:"17vw" },
                  maxWidth: { xs: "90vw", sm: "30vw", md:"18vw",lg:"17vw" }, // Maximum width of the card
                  minHeight: {xs:100, sm: 200, md:300}, // Maximum height of the card
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  boxShadow: theme.shadows[8], // Added darker shadow
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
                      maxHeight: "4.5em", // Fallback for browsers not supporting WebkitLineClamp
                    }}
                  >
                    {resource.title}
                  </Typography>
                </CardContent>
                {/* Changed Button to Typography styled as a link */}
                <Typography
                  component={Link}
                  to={`/resources/group/${activeStep}`}
                  variant="body2" // Use a body variant for text
                  sx={{
                    alignSelf: "flex-start",
                    ml: 2,
                    mb: 2,
                    color: theme.palette.primary.main, // Use primary color for link
                    textDecoration: "none", // Add underline
                    cursor: "pointer", // Indicate it's clickable
                    "&:hover": {
                      color: theme.palette.primary.dark, // Darken color on hover
                    },
                    ...(theme.palette.mode === "dark" && {
                      color: theme.palette.info.light, // Adjust color for dark mode
                      "&:hover": {
                        color: theme.palette.info.main, // Adjust hover color for dark mode
                      },
                    }),
                  }}
                >
                  View More
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stepper for navigation */}
        <div
  style={{
    display: "flex",
    flexWrap: "wrap", // Allow wrapping on small screens
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
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem", // Smaller font size for small screens
        padding: "4px 8px", // Adjust padding
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
    flexWrap: "wrap", // Allow dots to wrap on small screens
  }}
>
  {(() => {
    // Move useMediaQuery outside the loop
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // Dynamically adjust the number of visible dots based on screen size
    const visibleRange = isSmallScreen
      ? 2 // Show 5 dots (2 before and 2 after the active step)
      : isMediumScreen
      ? 3 // Show 7 dots (3 before and 3 after the active step)
      : 4; // Show 9 dots (4 before and 4 after the active step)

    return Array.from({ length: maxSteps }).map((_, index) => {
      const isVisible =
        index === 0 || // Always show the first dot
        index === maxSteps - 1 || // Always show the last dot
        (index >= activeStep - visibleRange && index <= activeStep + visibleRange); // Show dots around the active step

      if (!isVisible) {
        // Add ellipses for hidden dots
        if (
          (index === activeStep - visibleRange - 1 && activeStep > visibleRange) || // Ellipses before visible dots
          (index === activeStep + visibleRange + 1 && activeStep < maxSteps - visibleRange - 1) // Ellipses after visible dots
        ) {
          return <span key={index}>...</span>;
        }
        return null; // Hide the dot
      }

      return (
        <span
          key={index}
          onClick={() => setActiveStep(index)} // Navigate to the clicked dot
          style={{
            width: isSmallScreen ? 8 : 10, // Smaller dots on small screens
            height: isSmallScreen ? 8 : 10,
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
      );
    });
  })()}
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
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem", // Smaller font size for small screens
      padding: "4px 8px", // Adjust padding
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
