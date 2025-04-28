import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Typography } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function FeedbackForm() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    console.log(event.target.files[0].name);
    if (event.target.files.length > 0) {
      setImage(event.target.files[0]);
      console.log(image);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError(true);
      return;
    }
    setError(false);
    const formData = new FormData();
    formData.append("text", text);
    formData.append("rating", rating);

    if (image) {
      formData.append("image", image);
    }
    console.log(...formData);
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8000/api/createFeedback", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedback("Feedback submitted successfully!");
      navigate("/");
    } catch (err) {
      console.log(err.response.data.msg);
      if (err.response.data.msg === "unauthorized user.") {
        alert("Token is expired! Please Login!");
        navigate("/");
      }
      console.error("Failed to submit feedback:", err);
      setFeedback("Failed to submit feedback.");
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 10,
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center">
        Send Your Feedback
      </Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div style={{ margin: "16px 0" }}>
          <Rating
            name="half-rating"
            value={rating}
            // precision={0.5}
            onChange={(e, newValue) => {
              console.log("rating:", newValue);
              setRating(newValue);
            }}
          />
        </div>

        {error && (
          <Typography color="error" variant="caption">
            Rating is required
          </Typography>
        )}
        <div>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>
          {image && <p>Selected: {image.name}</p>}
        </div>

        <div style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            SUBMIT FEEDBACK
          </Button>
        </div>
      </form>

      {feedback && <p style={{ marginTop: 16, color: "green" }}>{feedback}</p>}
    </Box>
  );
}

export default FeedbackForm;
