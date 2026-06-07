import {
  Card as MuiCard,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

const Card = ({ title, description, onClick, isActive }) => {
  return (
    <MuiCard
      sx={{
        width: "100%", // 在手機上填滿
        maxWidth: "480px", // 👈 稍微比按鈕 (300px) 寬一點，視覺更平衡
        margin: "0 auto 12px auto", // 👈 置中並給下方間距 (取代 mb)
        borderRadius: "10px",
        // 1. 統一邊框邏輯：選取時顏色加深，未選取時淡粉色
        border: `2px solid ${isActive ? "#b9375d" : "#f59eb0"}`,
        transition: "all 0.2s ease-in-out",
        backgroundColor: isActive ? "#f59eb0" : "white",
        boxShadow: isActive ? "0 4px 12px rgba(245, 158, 176, 0.4)" : "none",
        overflow: "hidden",
        "&:hover": {
          // 2. 懸停時，只有在非選取狀態才變深邊框
          borderColor: "#b9375d",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        disableRipple
        // 3. 移除點擊時出現的灰色遮罩
        sx={{
          "& .MuiCardActionArea-focusHighlight": {
            backgroundColor: "transparent",
          },
          "&:hover": {
            // 只有未選中時才給一點點背景變色，避免選中狀態變色怪異
            backgroundColor: isActive ? "transparent" : "#fdf2f5",
          },
        }}
      >
        <CardContent sx={{ padding: "20px" }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              mb: "8px",
              color: isActive ? "white" : "#f59eb0",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.05rem",
              color: isActive ? "rgba(255,255,255,0.9)" : "#666",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
