    import { useTranslation } from "react-i18next";
    import React, { useEffect, useState } from "react";
    import { useParams, useNavigate } from "react-router-dom";
    import { Container, Typography, CircularProgress, Button, Box, Paper } from "@mui/material";
    import { useTheme } from "@mui/material/styles";

    type Resource = {
      id: number;
      title: string;
      description: string;
      filePath: string;
      mediaType: string;
      createdAt: string;
      updatedAt: string;
    };

    const fetchResource = async (id: string): Promise<Resource> => {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch resource: ${response.status}`);
      return await response.json();
    };

    const fetchFileContent = async (url: string): Promise<string> => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch file content: ${response.status}`);
      return await response.text();
    };

    export default function ResourceDetail() {
      const { id } = useParams<{ id: string }>();
      const { t } = useTranslation();
      const navigate = useNavigate();
      const theme = useTheme();
      const [resource, setResource] = useState<Resource | null>(null);
      const [fileContent, setFileContent] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            if (!id) throw new Error("Resource ID is missing");
            const fetchedResource = await fetchResource(id);
            setResource(fetchedResource);

            // Fetch content for text files
            const fileName = fetchedResource.filePath.split(/[\\/]/).pop();
            const mediaUrl = `http://localhost:5000/uploads/${fileName}`;
            const extension = fileName?.split('.').pop()?.toLowerCase();
            if (extension === 'txt') {
              const content = await fetchFileContent(mediaUrl);
              setFileContent(content);
            }
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [id]);

      const handleBack = () => {
        navigate(-1);
      };

      if (loading) return <CircularProgress />;
      if (error) return <Typography color="error">Error: {error}</Typography>;
      if (!resource) return <Typography>Resource not found</Typography>;

      const fileName = resource.filePath.split(/[\\/]/).pop();
      const mediaUrl = `http://localhost:5000/uploads/${fileName}`;
      const extension = fileName?.split('.').pop()?.toLowerCase();

      const renderMedia = () => {
        if (
          resource.mediaType?.replace(/^"|"$/g, "").startsWith("image/") ||
          /\.(png|jpg|jpeg|gif)$/i.test(resource.filePath)
        ) {
          return (
            <Box
              component="img"
              src={mediaUrl}
              alt={resource.title}
              sx={{ maxWidth: "100%", borderRadius: 2, mt: 2 }}
              onError={() => console.log(`Image failed to load: ${mediaUrl}`)}
            />
          );
        } else if (
          resource.mediaType?.replace(/^"|"$/g, "").startsWith("video/") ||
          extension === 'mp4'
        ) {
          return (
            <Box
              component="video"
              controls
              
              sx={{ maxWidth: "100%", borderRadius: 2, mt: 2 }}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </Box>
          );
        } else if (extension === 'txt' && fileContent) {
          return (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, whiteSpace: 'pre-wrap' }}>
              <Typography variant="body1">{fileContent}</Typography>
            </Box>
          );
        } else if (extension === 'pdf') {
          return (
            <Box sx={{ mt: 2 }}>
              <iframe
                src={mediaUrl}
                title={resource.title}
                style={{ width: '100%', height: '500px', border: 'none' }}
              />
            </Box>
          );
        }
        return null;
      };

      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "scale(1.05)",
                },
                transition: "0.3s ease-in-out",
              }}
            >
              ⬅  {t("goback")}
            </Button>
          </Box>

          <Paper
            elevation={6}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: "12px",
              boxShadow: (theme) => theme.shadows[6],
            }}
          >
            <Typography variant="h4" gutterBottom>{resource.title}</Typography>
            <Typography variant="body1" paragraph>{resource.description}</Typography>
            <Typography variant="body2" color="textSecondary">
              Media Type: {resource.mediaType}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Created At: {new Date(resource.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Updated At: {new Date(resource.updatedAt).toLocaleString()}
            </Typography>
            {renderMedia()}
          </Paper>
        </Container>
      );
    }