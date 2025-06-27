// src/pages/dashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Grid, Button, TextField, Tabs, Tab, Card, CardContent, CardActions, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type { ChangeEvent } from "react";

// Type definitions for file inputs and file data
type FileInput = File | null;
type FileData = {
  id: number;
  imagePath?: string;
  filePath?: string;
  title?: string;
  description?: string;
  type: "resources" | "home" | "about";
  createdAt?: string;
  updatedAt?: string;
};

// Order of file types for sorting
const typeOrder: { [K in FileData["type"]]: number } = {
  resources: 1,
  home: 2,
  about: 3,
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const theme = useTheme();
  // State for managing file uploads and UI
  const [resourceFile, setResourceFile] = useState<FileInput>(null);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [homeFile, setHomeFile] = useState<FileInput>(null);
  const [homeTitle, setHomeTitle] = useState("");
  const [homeDescription, setHomeDescription] = useState("");
  const [aboutFile, setAboutFile] = useState<FileInput>(null);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all data from API on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch data from resources, home, and about APIs
  const fetchAllData = async () => {
    try {
      const [resourcesResponse, homeResponse, aboutResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/resources'),
        axios.get('http://localhost:5000/api/home').catch(() => ({ status: 404, data: [] })),
        axios.get('http://localhost:5000/api/about').catch(() => ({ status: 404, data: [] })),
      ]);
      const allFiles = [
        ...(resourcesResponse.status === 200 && (Array.isArray(resourcesResponse.data) || resourcesResponse.data) ? 
          (Array.isArray(resourcesResponse.data) ? resourcesResponse.data : [resourcesResponse.data]).map(item => ({ ...item, type: "resources" as const })) : []),
        ...(homeResponse.status === 200 && (Array.isArray(homeResponse.data) || homeResponse.data) ? 
          (Array.isArray(homeResponse.data) ? homeResponse.data : [homeResponse.data]).map(item => ({ ...item, type: "home" as const })) : []),
        ...(aboutResponse.status === 200 && (Array.isArray(aboutResponse.data) || aboutResponse.data) ? 
          (Array.isArray(aboutResponse.data) ? aboutResponse.data : [aboutResponse.data]).map(item => ({ ...item, type: "about" as const })) : []),
      ].filter(file => file.id && (file.imagePath || file.filePath))
        .sort((a, b) => {
          const aType = a.type as FileData["type"];
          const bType = b.type as FileData["type"];
          return typeOrder[aType] - typeOrder[bType] || 
                 new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime();
        })
        .reduce((unique, file) => {
          const existing = unique.find((item: FileData) => item.id === file.id && item.type === file.type);
          if (!existing) return [...unique, file];
          const existingTime = Math.max(new Date(existing.updatedAt || 0).getTime(), new Date(existing.createdAt || 0).getTime());
          const newTime = Math.max(new Date(file.updatedAt || 0).getTime(), new Date(file.createdAt || 0).getTime());
          return newTime > existingTime ? unique.map((item: FileData) => (item.id === file.id && item.type === file.type) ? file : item) : unique;
        }, [] as FileData[]);
      setFiles(allFiles);
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      setFiles([]);
    }
  };

  // Handle file input changes for upload forms
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setFile: (file: FileInput) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload to the specified type (resources, home, about)
  const handleUpload = async (type: string, file: FileInput, title: string, description: string) => {
    if (!file) return;

    const formData = new FormData();
    if (type === "resources") {
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('mediaType', file.type);
    } else {
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('mediaType', file.type);
    }

    try {
      await axios.post(`http://localhost:5000/api/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchAllData();
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error.response ? error.response.data : error.message);
    }
  };

  // Handle file deletion from the specified type
  const handleDelete = useCallback(async (file: FileData) => {
    try {
      const deleteEndpoint = `http://localhost:5000/api/${file.type}/${file.id}`;
      const response: AxiosResponse = await axios.delete(deleteEndpoint, { timeout: 10000 });
      if (response.status === 200 || response.status === 204) {
        setFiles(prevFiles => prevFiles.filter(f => !(f.id === file.id && f.type === file.type)));
        setRefreshKey(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchAllData();
      }
    } catch (error: any) {
      console.error('Delete error details:', {
        message: error.message || 'Unknown error',
        response: error.response ? error.response.data : 'No response',
        status: error.response?.status || 'No status',
      });
    }
  }, [files]);

  // Handle tab changes for navigation between sections
  const handleTabChange = (_: unknown, newValue: number) => {
    setTabValue(newValue);
  };

  // Render the dashboard UI
  return (
    <Container sx={{ padding: 3, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      {/* Header Section */}
      <Typography variant="h4" color={theme.palette.text.primary} gutterBottom sx={{ fontSize: '1.5rem' }}>Admin Dashboard</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px' }}>
        {/* Upload Form Section */}
        <Grid component="div" sx={{ flex: '1 1 100%', maxWidth: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs" sx={{ mb: 2 }}>
            <Tab label="Resources" />
            <Tab label="Home" />
            <Tab label="About" />
          </Tabs>
          {tabValue === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Resources</Typography>
                <input
                  type="file"
                  accept=".png,.jpg,.txt,.pdf,.mp4,.mov"
                  onChange={(e) => handleFileChange(e, setResourceFile)}
                />
                <TextField
                  label="Title"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Description"
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={() => handleUpload("resources", resourceFile, resourceTitle, resourceDescription)}
                  sx={{ mt: 2 }}
                  size="small"
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          )}
          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Home</Typography>
                <input
                  type="file"
                  accept=".png,.jpg"
                  onChange={(e) => handleFileChange(e, setHomeFile)}
                />
                <TextField
                  label="Title"
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Description"
                  value={homeDescription}
                  onChange={(e) => setHomeDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={() => handleUpload("home", homeFile, homeTitle, homeDescription)}
                  sx={{ mt: 2 }}
                  size="small"
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          )}
          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>About</Typography>
                <input
                  type="file"
                  accept=".png,.jpg"
                  onChange={(e) => handleFileChange(e, setAboutFile)}
                />
                <TextField
                  label="Title"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Description"
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  size="small"
                  disabled
                />
                <Button
                  variant="contained"
                  onClick={() => handleUpload("about", aboutFile, aboutTitle, aboutDescription)}
                  sx={{ mt: 2 }}
                  size="small"
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
        {/* File List Section */}
        <Grid component="div" sx={{ flex: '1 1 100%', maxWidth: '100%', mt: 6 }}>
          <Card sx={{ boxShadow: 'none', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Uploaded Files</Typography>
              <Divider sx={{ mb: 2, width: '100px' }} />
              {files.map((file: FileData) => (
                file.imagePath || file.filePath ? (
                  <Card key={`${file.id}-${file.type}-${refreshKey}`} sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                    {/* Thumbnail or File Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                      <img
                        src={`http://localhost:5000/uploads/${file.imagePath || file.filePath}?t=${Date.now()}`}
                        alt={file.title || "File"}
                        style={{ maxWidth: "40px", maxHeight: "40px" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!file.imagePath && file.filePath) {
                            const ext = file.filePath.toLowerCase().split('.').pop();
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span style="font-size: 0.9rem; color: ${theme.palette.text.secondary};">${
                              ext === 'pdf' ? '📄' : ext === 'txt' ? '📝' : ext === 'mp4' || ext === 'mov' ? '🎥' : '📁'
                            }</span>`;
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', display: 'inline' }}>
                          {file.title || "Untitled"} {file.description ? `- ${file.description}` : ""}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, display: 'inline' }}>
                          ({file.type.charAt(0).toUpperCase() + file.type.slice(1)})
                        </Typography>
                      </Box>
                    </Box>
                    {/* Delete Button Centered in Its Container */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(file)}
                        size="small"
                        sx={{ whiteSpace: 'nowrap', minWidth: 'auto', padding: '2px 6px', fontSize: '0.75rem' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                ) : null
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;