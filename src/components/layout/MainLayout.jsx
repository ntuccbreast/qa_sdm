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
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "transparent",
          width: "100%",
        }}
      >
        <div className={styles.interactiveCard}>
          <Outlet />
        </div>
      </Box>

      {/* Footer: 電腦版顯示，手機版透過 CSS 隱藏 */}
      <Box className={styles.desktopOnly}>
        <Footer />
      </Box>
    </div>
  );
};

export default MainLayout;
