import React from "react";
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Box,
  styled,
} from "@mui/material";

// 自定義 StepLabel 字體大小
const StyledStepLabel = styled(StepLabel)({
  "& .MuiStepLabel-label": {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#999",
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#f59eb0",
    fontWeight: "bold",
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#666",
  },
});

const Stepper = ({ topicKey, currentId, topic = "", isConflictMode, isReviewMode }) => {
  // 1. 定義不同主題的步驟
  const THEME_STEPS = {
    dcis: ["知識說明", "價值觀評估", "決策建議"],
    bctsm: ["準備體驗", "治療體驗", "確認選擇", "決策建議"],
    //stvab: ["方案說明", "偏好釐清", "建議結果"],
    //reconstruction: ["時間評估", "需求分析", "建議結果"]
  };

  const steps = THEME_STEPS[topicKey] || ["進行中"];

  // 2. 根據 currentId / topic 關鍵字 判斷目前在哪一個 index (ActiveStep)
  //
  // DCIS 關鍵字規則：
  //   topic 含 "路線" → 價值觀評估 (step 1)  ← 所有情境模擬問題
  //   currentId === "DCIS_Q1" → 價值觀評估 (step 1)  ← 手術選擇入口
  //   其餘 DCIS → 知識說明 (step 0)  ← INTRO_* / FLOWMAP / KNOW_*
  //   FINISH → 決策建議 (最後一步)
  const getActiveStep = () => {
    if (isConflictMode) return steps.length - 1;
    if (isReviewMode) return 2;
    if (currentId === "FINISH") return steps.length - 1;

    if (topicKey === "bctsm") {
      if (currentId === "BCTSM_START") return 0;
      if (
        currentId.startsWith("BCT_") ||
        currentId.startsWith("SM_") ||
        currentId.includes("CASE")
      )
        return 1;
      if (currentId.startsWith("Q_")) return 2;
    }

    if (topicKey === "dcis") {
      if (topic.includes("路線") || currentId === "DCIS_Q1") return 1;
      return 0;
    }

    return 0;
  };

  const activeStep = getActiveStep();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto", // 👈 左右 auto 達成置中，mb: 4 換成 32px
        boxSizing: "border-box",
      }}
    >
      <MuiStepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepIcon-root": {
            color: "#eee", // 未開始的圓圈顏色
            fontSize: "1.5rem",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "#f59eb0", // 進行中的圓圈顏色 (您的主色)
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#f59eb0", // 已完成的圓圈顏色
          },
          "& .MuiStepConnector-line": {
            borderColor: "#eee", // 線條預設顏色
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
            borderColor: "#f59eb0", // 進行中/已完成的線條顏色
          },
          "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
            borderColor: "#f59eb0",
          },
        }}
      >
        {steps.map((stepName) => (
          <Step key={stepName}>
            <StyledStepLabel>{stepName}</StyledStepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
};

export default Stepper;
