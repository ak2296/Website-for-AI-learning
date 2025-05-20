import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  Grid,
} from "@mui/material";
import type { GridProps } from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

// Define the Resource type matching your backend API response
type Resource = {
  id: number;
  title: string;
  body: string;
};

// Update this function to call your actual API endpoint.
// For example, if your API is hosted on localhost:5000, you might use "http://localhost:5000/api/resources".
const fetchResources = async (): Promise<Resource[]> => {
  const response = await fetch("http://localhost:5000/api/resources");
  if (!response.ok) throw new Error("Failed to fetch resources");
  return await response.json();
};

export default function Resources() {
  // Use react-query to fetch data from the API.
  const { data, error, isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isLarge = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  const [activeStep, setActiveStep] = useState(0);

  if (isLoading) return <CircularProgress />;
  if (error instanceof Error)
    return <Typography color="error">Error: {error.message}</Typography>;

  // Determine how many cards per row and rows per page based on screen size.
  const cardsPerRow = isMobile
    ? 1
    : isMedium
    ? 2
    : isLarge
    ? 3
    : 4;

  const rowsPerPage = isMobile ? 6 : isMedium ? 3 : isLarge ? 2 : 2;

  // Calculate the total cards per page.
  const cardsPerPage = useMemo(
    () => cardsPerRow * rowsPerPage,
    [cardsPerRow, rowsPerPage]
  );

  // Group the fetched data (resources) into pages.
  const groupedData: Resource[][] = useMemo(() => {
    const groups: Resource[][] = [];
    for (let i = 0; i < (data ?? []).length; i += cardsPerPage) {
      groups.push((data ?? []).slice(i, i + cardsPerPage));
    }
    return groups;
  }, [data, cardsPerPage]);

  const maxSteps = groupedData.length;

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: 0 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
          Resources
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "stretch",
          }}
        >
          {groupedData[activeStep] &&
            groupedData[activeStep].map((resource) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={3}
                key={resource.id}
                component="div"
                {...({ item: true } as GridProps)}
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: "min(90vw, 450px)",
                    sm: "calc(50% - 8px)",
                    md: "calc(50% - 8px)",
                    lg: "calc(33.3333% - 10.6666px)",
                    xl: "calc(25% - 12px)",
                  },
                  minWidth: {
                    xs: "min(90vw, 450px)",
                    sm: "min(45%, 350px)",
                    md: "min(45%, 350px)",
                    lg: "min(30%, 300px)",
                    xl: "min(22%, 300px)",
                  },
                  display: "flex",
                  justifyContent: "center",
                  margin: isMobile ? "0 auto" : undefined,
                  boxSizing: "border-box",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    minWidth: {
                      xs: "min(90vw, 450px)",
                      sm: "min(45%, 350px)",
                      md: "min(45%, 350px)",
                      lg: "min(30%, 300px)",
                      xl: "min(22%, 300px)",
                    },
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    boxSizing: "border-box",
                    boxShadow: theme.shadows[8],
                  }}
                >
                  <CardContent
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      flex: 1,
                      flexShrink: 0,
                      overflow: "hidden",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        flexShrink: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        maxHeight: "4.5em",
                        boxSizing: "border-box",
                      }}
                    >
                      {resource.title}
                    </Typography>
                  </CardContent>
                  <Typography
                    component={Link}
                    to={`/resources/${resource.id}`}
                    variant="body2"
                    sx={{
                      alignSelf: "flex-start",
                      ml: 2,
                      mb: 2,
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": {
                        color: theme.palette.primary.dark,
                      },
                      ...(theme.palette.mode === "dark" && {
                        color: theme.palette.info.light,
                        "&:hover": {
                          color: theme.palette.info.main,
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

        {/* Pagination Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "white"
                  : theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : theme.palette.primary.light,
                color: "white",
              },
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                padding: "4px 8px",
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {(() => {
              const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
              const isMediumScreen = useMediaQuery(
                theme.breakpoints.between("sm", "md")
              );
              const visibleRange = isSmallScreen ? 2 : isMediumScreen ? 3 : 4;

              return Array.from({ length: maxSteps }).map((_, index) => {
                const isVisible =
                  index === 0 ||
                  index === maxSteps - 1 ||
                  (index >= activeStep - visibleRange &&
                    index <= activeStep + visibleRange);

                if (!isVisible) {
                  if (
                    (index === activeStep - visibleRange - 1 &&
                      activeStep > visibleRange) ||
                    (index === activeStep + visibleRange + 1 &&
                      activeStep < maxSteps - visibleRange - 1)
                  ) {
                    return <span key={index}>...</span>;
                  }
                  return null;
                }

                return (
                  <span
                    key={index}
                    onClick={() => setActiveStep(index)}
                    style={{
                      width: isSmallScreen ? 8 : 10,
                      height: isSmallScreen ? 8 : 10,
                      borderRadius: "50%",
                      backgroundColor:
                        activeStep === index
                          ? theme.palette.mode === "dark"
                            ? "#ff9800"
                            : theme.palette.primary.main
                          : theme.palette.grey[400],
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                  />
                );
              });
            })()}
          </div>

          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "white"
                  : theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : theme.palette.primary.light,
                color: "white",
              },
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                padding: "4px 8px",
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
