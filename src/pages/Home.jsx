// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import styles from "../Home.module.css";
import { introText } from "../constants/sdm";

const Home = () => {
  const navigate = useNavigate();
  const { setHeroData, setAllAnswers } = useUI();
  const [formData, setFormData] = useState({ userName: "", birthDate: "" });

  useEffect(() => {
    // ✅ 把 introText 交給 MainLayout 統一播放 TTS + 字幕
    setHeroData({
      description: introText,
    });
  }, [setHeroData]);

  const handleStart = () => {
    if (!formData.userName || !formData.birthDate) {
      alert("請填寫完整資料後再開始");
      return;
    }
    setAllAnswers((prev) => ({
      ...prev,
      userName: formData.userName,
      birthDate: formData.birthDate,
    }));
    navigate("/selection");
  };

  // ✅ iOS 鍵盤彈出時，延遲將輸入框捲入視窗，避免版面卡住
  const handleInputFocus = (e) => {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  };

  const isFormIncomplete = !formData.userName || !formData.birthDate;

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.contentSection}>
        <div className={styles.inputWrapper}>
          <Input
            label="請輸入您的姓名"
            name="userName"
            value={formData.userName}
            onFocus={handleInputFocus}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userName: e.target.value }))
            }
          />
          <Input
            label="請輸入您的出生年月日"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onFocus={handleInputFocus}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
            }
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleStart}
          fullWidth
          style={{
            pointerEvents: "auto",
            ...(isFormIncomplete
              ? { opacity: 0.5, filter: "grayscale(100%)", cursor: "not-allowed" }
              : {}),
          }}
        >
          開始使用
        </Button>
      </div>
    </div>
  );
};

export default Home;
