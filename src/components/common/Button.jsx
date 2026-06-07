import { Button as MuiButton } from "@mui/material";

const Button = ({
  children,
  onClick,
  isDisabled,
  variant = "contained",
  fullWidth,
  style,
}) => {
  return (
    <MuiButton
      fullWidth={fullWidth}
      variant={variant}
      onClick={onClick}
      disabled={isDisabled}
      disableRipple
      style={style}
      sx={{
        backgroundColor: "#f59eb0",
        color: "white",
        padding: "12px 0", // MUI Button 預設有內距，稍微調整即可
        border: "none",
        borderRadius: "200px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginTop: "10px",
        boxShadow: "none", // 如果不想要陰影可以設為 none
        maxWidth: "300px", // 👈 鎖定最大寬度，不再無限拉寬
        width: fullWidth ? "100%" : "auto",
        margin: "0 auto", // 👈 讓按鈕在父容器中水平置中
        maxWidth: "350px",
        display: "flex",
        // 滑鼠移入效果
        "&:hover": {
          backgroundColor: "#e08a9c",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", // 增加一點點懸浮感
        },
        // 字母大小寫轉換 (MUI 預設會將文字轉大寫)
        textTransform: "none",
        "&.Mui-disabled": {
          backgroundColor: "#f9f9f9",
          opacity: 0.6,
        },
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
