import {
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FeedbackDetails() {
  const [feedback, setFeedback] = useState({});
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/getFeedbackById/${id}`
      );
      setFeedback(res.data.message);
      console.log("Fetched feedback:", res.data);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };
  const handleCancel = () => {
    navigate("/feedbackList");
  };
  const handleSave = async () => {
    try {
      console.log("Comment saved:", comment);
      const res = await axios.put(
        `http://localhost:8000/api/commentOnFeedback/${id}`,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      setSuccessMessage("Comment added successfully!");
      setTimeout(() => {
        navigate("/feedbackList");
      }, 2000);
    } catch (error) {
      console.log(error.response.data.msg);
      if (error.response.data.msg === "unauthorized user.") {
        alert("Token is expired! Please Login!");
        navigate("/");
      }
    }
  };

  return (
    <>
      <Typography
        sx={{
          mt: 10,
        }}
        variant="h5"
        gutterBottom
        textAlign="center"
      >
        Feedback Details
      </Typography>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "left",
          p: "5",
          borderRadius: 3,
          marginRight: "30px",
          marginLeft: "30px",
        }}
      >
        {feedback.imageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={feedback.imageUrl}
            alt="Uploaded Feedback Image"
          />
        )}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {feedback.text}
          </Typography>
          <Typography>
            <Rating
              name="read-only"
              value={Number(feedback.rating) || 0}
              precision={0.5}
              readOnly
            />
          </Typography>
          <TextField
            label="write comment here"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Box sx={{ display: "flex", gap: "8px", m: "10px" }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
      {successMessage && (
        <Typography
          variant="h6"
          color="success.main"
          align="center"
          sx={{ mt: 2 }}
        >
          {successMessage}
        </Typography>
      )}
    </>
  );
}

export default FeedbackDetails;
