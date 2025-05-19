import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Typography, CircularProgress, Button, Box, Paper } from "@mui/material"; // 🔷 Added Paper & Box for better structure
import { useTheme } from "@mui/material/styles"; // 🔷 Import useTheme for styling

type Resource = {
  id: number;
  title: string;
  body: string;
};

// Fetch a single resource by ID
const fetchResource = async (id: string): Promise<Resource> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch resource");
  return await response.json();
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const theme = useTheme(); // 🔷 Theme for styling
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

      {/*  Wrapped Resource Details in Paper*/}
     <Paper
  elevation={6} // 
  sx={{
    p: 4, 
    mb: 4, 
    borderRadius: "12px", // 
    boxShadow: (theme) => theme.shadows[6],  // 
  }}
>

        <Typography variant="h4" gutterBottom>{resource.title}</Typography>
        <Typography variant="body1">{resource.body}</Typography>
      </Paper>
    </Container>
  );
}
