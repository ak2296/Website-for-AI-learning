import { useTranslation } from "react-i18next";
import { useState, useMemo, useCallback, useEffect } from "react";
  import { useQuery } from "@tanstack/react-query";
  import {
    Container,
    Typography,
    CircularProgress,
    Button,
    Card,
    CardContent,
    CardMedia,
    useMediaQuery,
    Grid,
    Box,
  } from "@mui/material";
  import { Link } from "react-router-dom";
  import { motion } from "framer-motion";
  import { useTheme } from "@mui/material/styles";
  import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
  import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
  import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // For PDF fallback
  import VideocamIcon from "@mui/icons-material/Videocam"; // For video fallback

  type Resource = {
    id: number;
    title: string;
    description: string;
    filePath: string;
    mediaType: string;
    createdAt: string;
    updatedAt: string;
  };

  const fetchResources = async (): Promise<Resource[]> => {
    const response = await fetch("http://localhost:5000/api/resources", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    console.log("Fetch response:", {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });
    const text = await response.text();
    console.log("Response text:", text);
    if (!response.ok && response.status !== 304) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 304) {
      return [];
    }
    return text ? JSON.parse(text) : [];
  };

  const fetchTextPreview = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch text: ${response.status}`);
      const text = await response.text();
      return text.split('\n').slice(0, 2).join('\n'); // First two lines
    } catch (error) {
      console.error("Text preview fetch error:", error);
      return "";
    }
  };

  export default function Resources() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMedium = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isLarge = useMediaQuery(theme.breakpoints.between("lg", "xl"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const cardsPerRow = isMobile ? 1 : isMedium ? 2 : isLarge ? 3 : 4;
    const rowsPerPage = isMobile ? 6 : isMedium ? 3 : isLarge ? 2 : 2;
    const cardsPerPage = useMemo(
      () => cardsPerRow * rowsPerPage,
      [cardsPerRow, rowsPerPage]
    );

    const [activeStep, setActiveStep] = useState(0);
    const [textPreviews, setTextPreviews] = useState<Record<number, string>>({});

    const { data, error, isLoading } = useQuery<Resource[]>({
      queryKey: ["resources"],
      queryFn: fetchResources,
    });

    useEffect(() => {
      if (data) {
        const fetchPreviews = async () => {
          const previews: Record<number, string> = {};
          for (const resource of data) {
            const extension = resource.filePath.split('.').pop()?.toLowerCase();
            if (extension === 'txt') {
              const fileName = resource.filePath.split(/[\\/]/).pop();
              const mediaUrl = `http://localhost:5000/uploads/${fileName}`;
              previews[resource.id] = await fetchTextPreview(mediaUrl);
            }
          }
          setTextPreviews(previews);
        };
        fetchPreviews();
      }
    }, [data]);

    const groupedData = useMemo(() => {
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

    const visibleRange = isSmallScreen ? 2 : isMediumScreen ? 3 : 4;
    const dotSize = isSmallScreen ? 8 : 10;

    const renderMedia = useCallback((resource: Resource) => {
      const fileName = resource.filePath.split(/[\\/]/).pop();
      const mediaUrl = `http://localhost:5000/uploads/${fileName}`;
      const extension = fileName?.split('.').pop()?.toLowerCase();
      if (
        resource.mediaType?.replace(/^"|"$/g, "").startsWith("image/") ||
        /\.(png|jpg|jpeg|gif)$/i.test(resource.filePath)
      ) {
        return (
          <CardMedia
            component="img"
            height="100"
            image={mediaUrl}
            alt={resource.title}
            onError={() => console.log(`Image failed to load: ${mediaUrl}`)}
          />
        );
      } else if (
        resource.mediaType?.replace(/^"|"$/g, "").startsWith("video/") ||
        extension === 'mp4'
      ) {
        return (
          <Box sx={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VideocamIcon sx={{ fontSize: 60, color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.primary.main }} />
          </Box>
        );
      } else if (extension === 'txt' && textPreviews[resource.id]) {
        return (
          <Box sx={{ height: "100px", p: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
            <Typography variant="body2">{textPreviews[resource.id]}</Typography>
          </Box>
        );
      } else if (extension === 'pdf') {
        return (
          <Box sx={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PictureAsPdfIcon sx={{ fontSize: 60, color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.primary.main }} />
          </Box>
        );
      }
      return null;
    }, [theme.palette.mode, theme.palette.grey, theme.palette.primary.main, textPreviews]);

    if (isLoading) return <CircularProgress />;
    if (error instanceof Error)
      return <Typography color="error">Error: {error.message}</Typography>;

    return (
      <Container maxWidth={false} sx={{ mt: 4, px: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
            {t("resources")}
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: isMobile ? "center" : "center",
              alignItems: "stretch",
            }}
          >
            {groupedData[activeStep] &&
              groupedData[activeStep].map((resource) => (
                <Grid
                  key={resource.id}
                  component="div"
                  sx={{
                    flex: "0 0 auto",
                    width: {
                      xs: "min(90vw, 450px)",
                      sm: "calc(50% - 8px)",
                      md: "calc(50% - 8px)",
                      lg: "calc(30%)",
                      xl: "calc(30% - 12px)",
                    },
                    minWidth: {
                      xs: "min(90vw, 450px)",
                      sm: "min(45%, 350px)",
                      md: "min(45%, 350px)",
                      lg: "min(30%, 300px)",
                      xl: "min(30%, 300px)",
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
                    {resource.filePath && resource.mediaType && renderMedia(resource)}
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          maxHeight: "3em",
                        }}
                      >
                        {resource.description}
                      </Typography>
                    </CardContent>
                    <Typography
                      component={Link}
                      to={`/resources/${resource.id}`}
                      variant="body2"
                      sx={{
                        alignSelf: "flex-end",
                        mr: 2,
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
                      {t("viewmore")}
                    </Typography>
                  </Card>
                </Grid>
              ))}
          </Grid>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              marginTop: "16px",
              minHeight: "100px", // Minimum height to ensure spacing
              paddingBottom: "16px", // Additional spacing at bottom
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
              {Array.from({ length: maxSteps }).map((_, index) => {
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
                      width: dotSize,
                      height: dotSize,
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
              })}
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