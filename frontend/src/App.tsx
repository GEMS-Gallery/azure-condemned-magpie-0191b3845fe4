import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { UploadFile, Search, Folder, InsertDriveFile, Image, VideoFile, AudioFile, Archive } from '@mui/icons-material';
import { backend } from 'declarations/backend';

const Sidebar = styled(Box)(({ theme }) => ({
  width: 250,
  backgroundColor: theme.palette.secondary.main,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const MainContent = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const FileItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface File {
  id: number;
  name: string;
  fileType: string;
  size: string | null;
  category: string;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'folder':
      return <Folder />;
    case 'image':
      return <Image />;
    case 'video':
      return <VideoFile />;
    case 'audio':
      return <AudioFile />;
    case 'archive':
      return <Archive />;
    default:
      return <InsertDriveFile />;
  }
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const result = await backend.getFiles();
      setFiles(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // Simulating file upload for MVP
    const newFile = {
      name: `File ${files.length + 1}`,
      fileType: 'document',
      size: '1 MB',
      category: 'My Files',
    };

    try {
      const result = await backend.addFile(newFile.name, newFile.fileType, newFile.size, newFile.category);
      if ('ok' in result) {
        await fetchFiles();
      } else {
        console.error('Error adding file:', result.err);
      }
    } catch (error) {
      console.error('Error adding file:', error);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar>
        <Typography variant="h6" gutterBottom>
          Files
        </Typography>
        <Button startIcon={<Folder />} fullWidth>
          My Files
        </Button>
        <Button startIcon={<Folder />} fullWidth>
          Shared
        </Button>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Categories
        </Typography>
        <Button startIcon={<Image />} fullWidth>
          Photos
        </Button>
        <Button startIcon={<VideoFile />} fullWidth>
          Videos
        </Button>
        <Button startIcon={<InsertDriveFile />} fullWidth>
          Documents
        </Button>
        <Button startIcon={<AudioFile />} fullWidth>
          Audio
        </Button>
      </Sidebar>
      <MainContent>
        <Header>
          <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">FileBox</Typography>
              <Button variant="contained" startIcon={<UploadFile />} onClick={handleUpload}>
                Upload
              </Button>
            </Box>
          </Container>
        </Header>
        <Container sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search files and folders"
            InputProps={{
              startAdornment: <Search />,
            }}
            sx={{ mb: 2 }}
          />
          <Box className="files-container">
            <Box className="files-header">
              <Typography variant="h6">My Files</Typography>
            </Box>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            ) : (
              files.map((file) => (
                <FileItem key={file.id}>
                  {getFileIcon(file.fileType)}
                  <Box ml={2}>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.size || 'N/A'}
                    </Typography>
                  </Box>
                </FileItem>
              ))
            )}
          </Box>
        </Container>
      </MainContent>
    </Box>
  );
}

export default App;
