import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/material";

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

export default function ResourceGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchResources();
        const startIndex = Number(groupId) * 5;
        const group = data.slice(startIndex, startIndex + 5);
        setResources(group);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resource 
      </Typography>
      {resources.map((resource) => (
        <Box key={resource.id} sx={{ mb: 3 }}>
          <Typography variant="h6">{resource.title}</Typography>
          <Typography variant="body1">{resource.body}</Typography>
        </Box>
      ))}
    </Container>
  );
}