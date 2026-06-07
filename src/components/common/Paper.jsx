import React from "react";
import Paper from "@mui/material/Paper";

const ContentPaper = ({ children, elevation = 2 }) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        padding: "24px",
        marginBottom: "20px",
        textAlign: "left",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto 20px auto", // 置中且底部留白
        borderRadius: "16px", // 稍微圓潤一點更有現代感
        lineHeight: 1.8, // 增加行高方便閱讀長文
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        // 針對 HTML 內容的微調樣式
        "& img": { maxWidth: "100%", height: "auto" },
        "& p": { marginBottom: "12px" },
      }}
    >
      {children}
    </Paper>
  );
};

export default ContentPaper;
