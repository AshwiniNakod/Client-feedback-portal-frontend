import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      alert("Please enter both email and password.");
      return;
    }
    loginUser();
  };
  const loginUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/logIn", {
        userName: username,
        password: password,
      });

      console.log("Login successful:", response.data);
      setMessage(response.data.message);
      if (response.statusText === "OK") {
        console.log(response.data.userDetails.JWTtoken);
        localStorage.setItem("token", response.data.userDetails.JWTtoken);
        localStorage.setItem("role", response.data.userDetails.role);
        console.log(localStorage.getItem("role"));
        if (localStorage.getItem("role") === "admin") {
          navigate("/feedbackList");
        } else {
          navigate("/feedback"); //  Redirect to feedback page
        }
      }
      // Handle token or session here
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Typography
        sx={{
          // maxWidth: 300,
          // mx: 'auto',
          mt: 10,
          mb: -5,
          // p: 4,
          borderRadius: 3,
        }}
        variant="h3"
        gutterBottom
        textAlign="center"
      >
        Client Feedback Portal
      </Typography>
      <Box
        component={Paper}
        elevation={3}
        sx={{
          maxWidth: 300,
          mx: "auto",
          mt: 10,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="USERNAME"
            size="small"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="PASSWORD"
            type="password"
            size="small"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <p>{message}</p>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
