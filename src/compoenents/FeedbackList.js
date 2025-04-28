import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Rating,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const role = localStorage.getItem("role");

  const handleSearch = () => {
    let filtered = [...feedbacks];

    if (rating !== "") {
      filtered = filtered.filter((fb) => fb.rating >= rating);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredFeedbacks(filtered);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/getAllFeedback");
        const feedbackList = res.data.message;
        const feedbacksWithUser = await Promise.all(
          feedbackList.map(async (fb) => {
            try {
              const userRes = await axios.get(
                `http://localhost:8000/api/getUser/${fb.userId}`
              );
              
              return {
                ...fb,
                userName: userRes.data.message.userName,
                image: fb.image,
              };
            } catch (err) {
              console.error("Failed to fetch user info:", err);
              return fb;
            }
          })
        );

        setFeedbacks(feedbacksWithUser);
      } catch (error) {
        console.error(
          "Error fetching feedbacks:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const displayedFeedbacks =
    filteredFeedbacks.length > 0 ? filteredFeedbacks : feedbacks;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feedback List
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={rating}
            label="Rating"
            onChange={(e) => setRating(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
            <MenuItem value={4}>4 Stars & Up</MenuItem>
            <MenuItem value={3}>3 Stars & Up</MenuItem>
            <MenuItem value={2}>2 Stars & Up</MenuItem>
            <MenuItem value={1}>1 Star & Up</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            label="Sort By"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" size="small" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : displayedFeedbacks.length === 0 ? (
        <Typography variant="body1">No feedbacks found.</Typography>
      ) : (
        <Box>
          {displayedFeedbacks.map((fb, index) => (
            <Box sx={{ margin: "12px" }} key={index}>
              <Card
              // sx={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {fb.userName || "Anonymous"}
                  </Typography>

                  {fb.image && fb.image !== "null" ? (
                    <Box
                      sx={{
                        height: "250px",
                        width: "250px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        // height="100px"
                        // width="100px"
                        margin="0 auto" // Center horizontally
                        display="block"
                        sx={{ objectFit: "cover" }}
                        image={`http://localhost:8000/api/showImage/${fb._id}/${
                          fb.image.split("\\")[1]
                        }`}
                        alt="Feedback image"
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2">No image available</Typography>
                  )}

                  <Typography
                    variant="body1"
                    sx={{
                      overflowWrap: "break-word",
                      mt: 2,
                      flexGrow: 1,
                    }}
                     >
                    {fb.text || "No feedback text provided."}
                  </Typography>

                  <Box sx={{ marginTop: 2 }}>
                    {fb.rating ? (
                      <Rating value={fb.rating} readOnly precision={0.5} />
                    ) : (
                      <Typography variant="body2">No rating</Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.5rem" }}
                  >
                    {fb.createdAt ? fb.createdAt.split("T")[0] : "Unknown date"}
                  </Typography>
                </CardContent>

                {role === "admin" && (
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      to={`/feedback/${fb._id}`}
                    >
                      Add Comment
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default FeedbackList;
