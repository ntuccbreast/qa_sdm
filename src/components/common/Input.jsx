import { TextField, Box, Typography } from "@mui/material";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
}) => {
  return (
    <Box
      sx={{
        mb: 4,
        width: "100%", // 確保在父容器內可伸縮
        maxWidth: "300px", // 👈 鎖定 300px，跟按鈕一樣
        margin: "0 auto 24px auto", // 👈 置中並維持下方間距
        textAlign: "center",
      }}
    >
      {/* 標題部分 */}
      {label && (
        <Typography variant="h6" component="h2" sx={{ mb: 1, color: "#333" }}>
          {label}
        </Typography>
      )}

      <TextField
        fullWidth
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined" // 使用外框模式
        // 利用 inputProps 控制內層 input 元素的樣式
        inputProps={{
          style: { textAlign: "center" }, // 文字居中
        }}
        sx={{
          // 外框與圓角
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "1rem",
            color: "#666",
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#f0b4c0", // 預設粉色邊框
            },
            "&:hover fieldset": {
              borderColor: "#e08a9c", // 滑鼠移入更深的粉色
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e08a9c", // 點擊選中時的顏色
            },
          },
        }}
      />
    </Box>
  );
};

export default Input;
