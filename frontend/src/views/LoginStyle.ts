import { SxProps } from "@mui/joy/styles/types";

export const container:SxProps = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export const sheetStyle:SxProps = {
  width: '100%',
  maxWidth: 520,
  p: 4,
  borderRadius: '20px',
  boxShadow: 'lg',
  backdropFilter: 'blur(14px)',
};

export const title:SxProps = {
  textAlign: 'center',
  mb: 2,
  fontWeight: 700,
};

export const formStyle:SxProps = {
  display: 'grid',
  gap: 2,
};

export const loginBtn:SxProps = {
  mt: 1,
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'md',
  },
};

export const footerText:SxProps = {
  textAlign: 'center',
  mt: 2,
};

export const signupStyle:React.CSSProperties= {
  color: '#5469f2',
  fontWeight: 600,
  textDecoration: 'none',
};