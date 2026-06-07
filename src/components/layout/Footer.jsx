import { Box, Typography, Container, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: "auto", // 如果使用 Flexbox 佈局，這會將 Footer 推到底部
        backgroundColor: "transparent",
      }}
    >
      <Divider sx={{ mb: 3, borderColor: "rgba(245, 158, 176, 0.3)" }} />
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{
          letterSpacing: "1px",
          color: "#999",
          fontWeight: 400,
        }}
      >
        © 2025 台大癌醫乳房外科 ‧ 版權所有
      </Typography>
    </Box>
  );
};

export default Footer;
