import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../controllers/authController";
import { Room, SignupPayload, SnackbarType } from "../models/User";
import { Box, Typography, Input, Button, Sheet, Snackbar } from "@mui/joy";
import {
  container,
  footerText,
  formStyle,
  sheetStyle,
  signupStyle,
  title,
  loginBtn,
} from "./LoginStyle";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form, setForm] = useState<SignupPayload>({
    name: "",
    email: "",
    password: "",
    roomId: Room.Room1,
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
      await signup(form);
      setSnackbar({
        open: true,
        message: "Signup successful. You can now log in.",
        color: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Signup failed",
        color: "danger",
      });
    }
  };

  return (
    <Box sx={container}>
      <Sheet sx={sheetStyle}>
        <Typography level="h2" sx={title}>
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
          <Input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label htmlFor="roomId">Choose your room</label>
            <select
              id="roomId"
              name="roomId"
              value={form.roomId}
              onChange={(e) =>
                setForm({
                  ...form,
                  roomId: e.target.value as Room,
                })
              }
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
              required
            >
              <option value={Room.Room1}>Room 1</option>
              <option value={Room.Room2}>Room 2</option>
              <option value={Room.Room3}>Room 3</option>
            </select>
          </Box>

          <Button 
            loading={isLoading}
            disabled={!form.email || !form.password || !form.name || !form.roomId}
            type="submit"
            size="lg"
            sx={loginBtn}
          >
            Signup
          </Button>
        </Box>

        <Typography sx={footerText}>
          Already have an account?{" "}
          <Link  to="/login" style={signupStyle}>
            Login
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

export default Signup;
