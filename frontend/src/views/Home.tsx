import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/joy";
import {
  buttonGroup,
  container,
  primaryBtn,
  secondaryBtn,
  subtitle,
  title,
  content,
} from "./HomeStyle";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <Box sx={container}>

      <Box sx={content}>
        <Typography level="h1" sx={title}>
          Welcome to PulseConnect
        </Typography>

        <Typography sx={subtitle}>
          An intelligent real-time communication platform with live user
          presence tracking.
        </Typography>

        <Box sx={buttonGroup}>
          <Button size="lg" onClick={() => navigate("/login")} sx={primaryBtn}>
            Sign In
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            sx={secondaryBtn}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
