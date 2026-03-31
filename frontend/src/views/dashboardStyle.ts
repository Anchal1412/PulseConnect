import { SxProps } from "@mui/joy/styles/types";

export const container:SxProps= {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};


export const sheetStyle:SxProps= {
  maxWidth: 1200,
  mx: 'auto',
  p: 3,
  borderRadius: '20px',
  boxShadow: 'lg',
  position: 'relative',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
};

export const header:SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
  flexWrap: 'wrap',
  gap: 2,
};

export const headerButtons:SxProps = {
  display: 'flex',
  gap: 2,
};

export const contentWrapper:SxProps = {
  position: 'relative',
  minHeight: 0,
  flex: 1,
};

export const dashboardContent = (isChatMode: boolean):SxProps => ({
  visibility: isChatMode ? 'hidden' : 'visible',
  height: '100%',
});

export const emptyState:SxProps = {
  textAlign: 'center',
  py: 5,
};

export const tableContainer:SxProps = {
  overflow: 'auto',
  height: '100%',
};

export const statusStyle = (isOnline: boolean): SxProps => ({
  display: 'inline-block',
  px: 1.5,
  py: 0.5,
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: 600,
  bgcolor: isOnline ? '#d4edda' : '#f8d7da',
  color: isOnline ? '#155724' : '#721c24',
});

