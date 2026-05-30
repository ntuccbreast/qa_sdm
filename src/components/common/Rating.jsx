import React from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const RatingComponent = ({ value, children, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography component="legend" sx={{ fontSize: "1rem", color: "#666" }}>
        {children}
      </Typography>
      <Rating
        name="chat-rating"
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        size="large"
        sx={{
          "& .MuiRating-iconFilled": {
            color: "#e08a9c", // 已選中的星星顏色
          },
          "& .MuiRating-iconHover": {
            color: "#e08a9c", // 滑鼠懸停時的顏色（深一點點更直觀）
          },
        }}
      />
    </Box>
  );
};

export default RatingComponent;
