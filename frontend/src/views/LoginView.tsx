import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../controllers/authController";
import { LoginPayload, SnackbarType } from "../models/User";
import { Box, Typography, Input, Button, Sheet, Snackbar } from "@mui/joy";
import {
  container,
  footerText,
  formStyle,
  loginBtn,
  sheetStyle,
  signupStyle,
  title,
} from "./LoginStyle";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState<SnackbarType>({
    open: false,
    message: "",
    color: "neutral",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(form);

     
      localStorage.setItem("token", data.token);

      setSnackbar({
        open: true,
        message: "Login successful",
        color: "success",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={container}>
      <Sheet sx={sheetStyle}>
        <Typography level="h2" sx={title}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <Button  
          loading={isLoading}
          disabled={!form.email || !form.password} type="submit" size="lg" sx={loginBtn}>
            Login
          </Button>
        </Box>

        <Typography sx={footerText}>
          Don't have an account?{" "}
          <Link to="/signup" style={signupStyle}>
            Sign up
          </Link>
        </Typography>
      </Sheet>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, message: '', open: false })}
        color={snackbar.color}
        variant="soft"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {snackbar.message}
      </Snackbar>
    </Box>
  );
};

export default Login;
