// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Grid, Button, TextField, Tabs, Tab, Card, CardContent, Box, Divider, Dialog, DialogContent, DialogContentText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ChangeEvent } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom"; // Ensure this import is present

// Define types for file inputs and file data
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

// Set order for sorting file types
const typeOrder: { [K in FileData["type"]]: number } = {
  resources: 1,
  home: 2,
  about: 3,
};

// Main Dashboard Component with logout functionality
const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize navigate
  // State for managing file uploads, UI, and logout
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
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogIcon, setDialogIcon] = useState<React.ReactNode>(null);

  // Fetch all data from APIs when the component loads
  useEffect(() => {
    fetchAllData().catch(err => {
      setError("Failed to load data. Check console for details.");
    });
  }, []);

  // Get data from resources, home, and about APIs
  const fetchAllData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";
      const [resourcesResponse, homeResponse, aboutResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/resources`).catch(err => ({ status: 404, data: [] })),
        axios.get(`${apiUrl}/api/home`).catch(err => ({ status: 404, data: [] })),
        axios.get(`${apiUrl}/api/about`).catch(err => ({ status: 404, data: [] })),
      ]);

      const allFiles = [
        ...(resourcesResponse.status === 200 && resourcesResponse.data ? 
          (Array.isArray(resourcesResponse.data) ? resourcesResponse.data : [resourcesResponse.data]).map(item => ({ ...item, type: "resources" as const })) : []),
        ...(homeResponse.status === 200 && homeResponse.data ? 
          (Array.isArray(homeResponse.data) ? homeResponse.data : [homeResponse.data]).map(item => ({ ...item, type: "home" as const })) : []),
        ...(aboutResponse.status === 200 && aboutResponse.data ? 
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
      setError(null);
    } catch (error: unknown) {
      setError("An unexpected error occurred. Check console for details.");
    }
  };

  // Handle changes when selecting a file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setFile: (file: FileInput) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Upload a file to the specified type (resources, home, about)
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
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileName = file.name;
      setDialogMessage(`${fileName} successfully uploaded`);
      setDialogIcon(<CheckCircleIcon sx={{ color: 'green', fontSize: 40 }} />);
      setOpenDialog(true);
      await fetchAllData();
    } catch (error: any) {
      setError(`Upload failed for ${type}: ${error.message}`);
    }
  };

  // Delete a file from the specified type
  const handleDelete = useCallback(async (file: FileData) => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";
      const deleteEndpoint = `${apiUrl}/api/${file.type}/${file.id}`;
      const response: AxiosResponse = await axios.delete(deleteEndpoint, { timeout: 10000 });
      if (response.status === 200 || response.status === 204) {
        setFiles(prevFiles => prevFiles.filter(f => !(f.id === file.id && f.type === file.type)));
        setDialogMessage(`${file.title || "File"} successfully deleted`);
        setDialogIcon(<DeleteIcon sx={{ color: 'red', fontSize: 40 }} />);
        setOpenDialog(true);
        setRefreshKey(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchAllData();
      }
    } catch (error: any) {
      setError(`Delete failed: ${error.message}`);
    }
  }, [files]);

  // Switch between tabs for different sections
  const handleTabChange = (_: unknown, newValue: number) => {
    setTabValue(newValue);
  };

  // Close the success/error dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/admin"); // Navigate back to admin login
  };

  // Display the dashboard UI
  return (
    <Container sx={{ padding: 3, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" color={theme.palette.text.primary} gutterBottom sx={{ fontSize: '1.5rem' }}>
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ px: 2, py: 0.5, borderRadius: "8px" }}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px' }}>
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
        <Grid component="div" sx={{ flex: '1 1 100%', maxWidth: '100%', mt: 6 }}>
          <Card sx={{ boxShadow: 'none', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Uploaded Files</Typography>
              <Divider sx={{ mb: 2, width: '100px' }} />
              {error ? (
                <Typography sx={{ color: theme.palette.error.main }}>{error}</Typography>
              ) : files.length > 0 ? (
                files.map((file: FileData) => (
                  file.imagePath || file.filePath ? (
                    <Card key={`${file.id}-${file.type}-${refreshKey}`} sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                        <Box sx={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {file.imagePath && (file.imagePath.toLowerCase().endsWith('.png') || file.imagePath.toLowerCase().endsWith('.jpg')) ? (
                            <img
                              src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${file.imagePath}?t=${Date.now()}`}
                              alt={file.title || "File"}
                              style={{ maxWidth: "40px", maxHeight: "40px" }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : file.filePath ? (
                            <span style={{ fontSize: '1.5em', color: theme.palette.text.secondary }}>
                              {file.filePath.toLowerCase().endsWith('.pdf') ? '📄' : 
                               file.filePath.toLowerCase().endsWith('.txt') ? '📝' : 
                               file.filePath.toLowerCase().endsWith('.mp4') || file.filePath.toLowerCase().endsWith('.mov') ? '🎥' : '📁'}
                            </span>
                          ) : null}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', display: 'inline' }}>
                            {file.title || "Untitled"} {file.description ? `- ${file.description}` : ""}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, display: 'inline' }}>
                            ({file.type.charAt(0).toUpperCase() + file.type.slice(1)})
                          </Typography>
                        </Box>
                      </Box>
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
                ))
              ) : (
                <Typography sx={{ color: theme.palette.text.secondary }}>No files uploaded.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Box>
      {/* Dialog for showing upload/delete success */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 12,
            padding: 20,
          },
        }}
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {dialogIcon}
            <DialogContentText sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
              {dialogMessage}
            </DialogContentText>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;