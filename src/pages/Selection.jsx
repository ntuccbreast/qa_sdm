// src/pages/Selections.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import * as SelectionData from "../constants/selection";
import Button from "../components/common/Button";
import { useUI } from "../context/UIContext";
import styles from "../Selections.module.css";

const Selections = () => {
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // ✅ 交給 MainLayout 統一播放 TTS
    const welcomeText = `${allAnswers.userName || ""}您好，我可以幫您什麼呢？請根據您想使用的功能選擇。`;
    setHeroData({ description: welcomeText });
  }, [allAnswers.userName, setHeroData]);

  const handleConfirm = () => {
    if (!selectedId) return alert("請先選擇一個方案");
    const paths = { 1: "/SDM", 2: "/chatbot" };
    const targetPath = paths[selectedId];
    if (targetPath) navigate(targetPath);
  };

  const currentSelection = SelectionData.selectionList.find((s) => s.id === selectedId);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentSection}>
        <div className={styles.cardList}>
          {SelectionData.selectionList.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              isActive={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button onClick={handleConfirm} fullWidth>
          {selectedId ? `進入 ${currentSelection?.title} ⮕` : "⬆ 請選擇上方方案"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/")} fullWidth>
          ⬅ 返回修改基本資料
        </Button>
      </div>
    </div>
  );
};

export default Selections;
