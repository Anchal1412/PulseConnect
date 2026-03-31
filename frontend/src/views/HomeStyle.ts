import { SxProps } from "@mui/joy/styles/types";

export const container: SxProps = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
  overflow: "hidden",
};

export const bgAnimation: SxProps = {
  position: "absolute",
  top: "-50%",
  right: "-50%",
  width: "100%",
  height: "100%",
  background:
    "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
  backgroundSize: "50px 50px",
  animation: "moveBg 20s linear infinite",
};
export const content: SxProps = {
  maxWidth: 800,
  textAlign: "center",
  zIndex: 10,
  animation: "fadeIn 0.8s ease-out",
};

export const title: SxProps = {
  fontSize: { xs: "2.5rem", md: "3.5rem" },
  fontWeight: 800,
  color: "#fff",
  mb: 2,
  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

export const subtitle: SxProps = {
  fontSize: { xs: "1.1rem", md: "1.4rem" },
  color: "rgba(255,255,255,0.9)",
  mb: 4,
  textShadow: "0 1px 5px rgba(0,0,0,0.1)",
};

export const buttonGroup: SxProps = {
  display: "flex",
  gap: 2,
  justifyContent: "center",
  flexWrap: "wrap",
};

export const primaryBtn: SxProps = {
  px: 4,
  py: 1.5,
  fontWeight: 600,
  borderRadius: "12px",
  background: "#fff",
  color: "#667eea",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
  },
};

export const secondaryBtn: SxProps = {
  px: 4,
  py: 1.5,
  fontWeight: 600,
  borderRadius: "12px",
  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 15px 40px rgba(245,87,108,0.4)",
  },
};
