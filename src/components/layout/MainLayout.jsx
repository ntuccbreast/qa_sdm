// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Hero from "./Hero";
import Footer from "./Footer";
import { useUI } from "../../context/UIContext";
import { Box } from "@mui/material";
import styles from "./MainLayout.module.css"; // 確保此處引入了樣式檔

const MainLayout = () => {
  const { heroData } = useUI();

  return (
    <div className={styles.layoutWrapper}>
      <Hero {...heroData} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "transparent", // 必須透明，才會露出外層的灰底
        }}
      >
        {/* 這就是你的手機比例卡片 */}
        <div className={styles.interactiveCard}>
          <Outlet />
        </div>
      </Box>

      <Footer />
    </div>
  );
};

export default MainLayout;
