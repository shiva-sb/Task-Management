import React, { useState, useCallback } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Alert,
  Avatar,
  CssBaseline,
  Grid,
  CircularProgress
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const result = await register(username.trim(), email.trim(), password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }

      setLoading(false);
    },
    [username, email, password, confirmPassword, register, navigate]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <PersonAdd />
            </Avatar>

            <Typography component="h1" variant="h5" fontWeight="bold">
              Create Account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sign up to start managing your tasks
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              margin="normal"
              label="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: "bold" }}
            >
              {loading ? <CircularProgress size={26} /> : "Create Account"}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
