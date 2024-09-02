import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, TextField, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { UploadFile, Search, Folder, InsertDriveFile, Image, VideoFile, AudioFile, Archive, Download } from '@mui/icons-material';
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
  size: number;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as ArrayBuffer;
      try {
        const result = await backend.addFile(
          file.name,
          file.type,
          file.size,
          'My Files',
          new Uint8Array(content)
        );
        if ('ok' in result) {
          await fetchFiles();
        } else {
          console.error('Error adding file:', result.err);
        }
      } catch (error) {
        console.error('Error adding file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const content = await backend.getFileContent(fileId);
      if (content) {
        const blob = new Blob([content]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
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
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
              <Button
                variant="contained"
                startIcon={<UploadFile />}
                onClick={() => fileInputRef.current?.click()}
              >
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
                  <Box ml={2} flexGrow={1}>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${(file.size / 1024).toFixed(2)} KB`}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDownload(file.id, file.name)}>
                    <Download />
                  </IconButton>
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
