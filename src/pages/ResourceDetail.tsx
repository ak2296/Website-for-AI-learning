import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Typography, CircularProgress, Button } from "@mui/material"; // Import Button
import { Box } from "@mui/material";

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
  const navigate = useNavigate(); // Initialize useNavigate
 const [resource, setResource] = React.useState<Resource | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("Resource ID is missing");
        }
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
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!resource) return <Typography>Resource not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Add Back Button */}
      <Button
        variant="outlined"
        onClick={handleBack}
        sx={{ mb: 2 }} // Add some margin below the button
      >
        Back to Resources
      </Button>

      <Typography variant="h4" gutterBottom>
        {resource.title}
      </Typography>
      <Typography variant="body1">{resource.body}</Typography>
    </Container>
  );
}
