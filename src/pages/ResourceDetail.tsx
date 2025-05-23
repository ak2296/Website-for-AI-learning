import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, Button, Box, Paper, CardMedia } from "@mui/material";
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
  const response = await fetch(`/api/resources/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch resource: ${response.status}`);
  return await response.json();
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [resource, setResource] = React.useState<Resource | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Resource ID is missing");
        const fetchedResource = await fetchResource(id);
        setResource(fetchedResource);
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
          ⬅ Back to Resources
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
       {resource.mediaType.startsWith('image/') && (
  <CardMedia
    component="img"
    height="300"
    image={`/uploads/${resource.filePath.split(/[\\/]/).pop()}`}
    alt={resource.title}
    sx={{ marginBottom: 2 }}
    onError={() => console.log(`Image failed to load: /uploads/${resource.filePath.split(/[\\/]/).pop()}`)}
  />
)}
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
      </Paper>
    </Container>
  );
}