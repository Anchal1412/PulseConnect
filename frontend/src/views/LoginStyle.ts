export const container = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export const sheetStyle = {
  width: '100%',
  maxWidth: 520,
  p: 4,
  borderRadius: '20px',
  boxShadow: 'lg',
  backdropFilter: 'blur(14px)',
};

export const title = {
  textAlign: 'center',
  mb: 2,
  fontWeight: 700,
};

export const formStyle = {
  display: 'grid',
  gap: 2,
};

export const loginBtn = {
  mt: 1,
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'md',
  },
};

export const footerText = {
  textAlign: 'center',
  mt: 2,
};

export const signupStyle = {
  color: '#5469f2',
  fontWeight: 600,
  textDecoration: 'none',
};