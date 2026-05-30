import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useUI } from "../context/UIContext";
import styles from "../Result.module.css";
import { saveToSheet } from "../components/utils/googleSheetLogger";
import DcsSurvey from "./DcsSurvey";
import Stepper from "../components/common/Stepper";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();
  const { finalData, topicKey, savedDataMap, chatHistory } =
    location.state || {};

  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  // 🚀 新增狀態：用於鎖定問卷直到語音播報結束
  const [isSpeaking, setIsSpeaking] = useState(true);

  const hasSpokenRef = useRef(false);
  const synthRef = useRef(window.speechSynthesis);

  const chartUrl =
    finalData?.flowChart ||
    "https://sdm-5cbs.onrender.com/assets/images/default.png";

  useEffect(() => {
    if (!finalData) return;

    // 如果已經播報過，則直接解除鎖定
    if (hasSpokenRef.current) {
      setIsSpeaking(false);
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = finalData.description || "";
    const pureDescription = tempDiv.textContent || tempDiv.innerText || "";
    const userName = allAnswers.userName || "您";
    const speechText = `${userName}，我已為您整理好：${finalData.title}。${pureDescription}`;

    setHeroData({
      step: 3,
      currentStep: 3,
      imageUrl:
        "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
      title: "第三步驟：評估結果建議",
      description: speechText,
    });

    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "zh-TW";

      // 🚀 播報結束後解除鎖定
      utterance.onend = () => {
        setIsSpeaking(false);
        hasSpokenRef.current = true;
      };
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [finalData, allAnswers.userName, setHeroData]);

  const handleSurveyComplete = async (finalDcsAnswers) => {
    setIsSurveyCompleted(true);
    setIsSurveyOpen(false);
    console.log("DCS 完成，準備寫入：", finalDcsAnswers);
    try {
      const logData = {
        userName: allAnswers.userName,
        birthDate: allAnswers.birthDate,
        selectedTopic: topicKey,
        answers_map: savedDataMap || [],
        dcsScore: JSON.stringify(finalDcsAnswers),
        finalResult: finalData.title,
        chatHistory: JSON.stringify(
          (chatHistory || [])
            .filter(
              (msg) =>
                msg.role !== "assistant" || chatHistory.indexOf(msg) !== 0,
            )
            .map((msg) => ({
              role: msg.role === "user" ? "病人" : "機器人",
              content: msg.content,
            })),
        ),
      };

      console.log("logData：", logData); // ← 加這行
      const result = await saveToSheet(logData);
      console.log("saveToSheet 回傳：", result); // ← 加這行
    } catch (error) {
      console.error("資料同步失敗", error);
    }
  };

  if (!finalData) return null;

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <Stepper topicKey={topicKey} currentId="FINISH" />
      </div>

      <div className={styles.spacer}></div>

      {isSurveyOpen ? (
        <div className={styles.surveyContainer}>
          <DcsSurvey
            onComplete={handleSurveyComplete}
            onClose={() => setIsSurveyOpen(false)}
          />
        </div>
      ) : (
        <>
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>{finalData.title}</h2>
            <hr className={styles.divider} />
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: finalData.description }}
            />
          </div>

          <div className={styles.interactiveGroup}>
            {chartUrl && (
              <button
                onClick={() => setIsFlowModalOpen(true)}
                className={styles.secondaryPinkButton}
                style={{ marginBottom: "20px", width: "100%" }}
              >
                🔍 查看您的預計治療流程
              </button>
            )}

            <div
              className={`${styles.surveyCard} ${isSurveyCompleted ? styles.surveyCardCompleted : ""}`}
            >
              <p
                className={`${styles.surveyTitle} ${isSurveyCompleted ? styles.surveyTitleCompleted : ""}`}
              >
                {isSurveyCompleted
                  ? "✅ 填寫完成！"
                  : "最後一步：請填寫決策評估問卷"}
              </p>
              {!isSurveyCompleted && (
                <button
                  onClick={() => !isSpeaking && setIsSurveyOpen(true)}
                  className={styles.primaryPinkButton}
                  disabled={isSpeaking}
                  style={{
                    opacity: isSpeaking ? 0.5 : 1,
                    cursor: isSpeaking ? "not-allowed" : "pointer",
                  }}
                >
                  {isSpeaking ? "正在說明中，請稍候..." : "點此開始互動問卷"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className={styles.footerButtonArea}>
        <Button
          style={{ width: "100%", height: "50px", borderRadius: "25px" }}
          onClick={() => navigate("/selection")}
          isDisabled={!isSurveyCompleted}
        >
          {isSurveyCompleted ? "完成並回首頁" : "請先完成上方問卷以解鎖結束"}
        </Button>
      </div>

      {/* 流程圖彈出視窗... (省略，保持原樣) */}
      {isFlowModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsFlowModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTextTitle}>您的預計治療流程</h3>
              <button
                onClick={() => setIsFlowModalOpen(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <img src={chartUrl} alt="治療流程圖" />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalPrimaryButton}
                onClick={() => window.print()}
              >
                🖨️ 列印 / 儲存 PDF
              </button>
              <button
                className={styles.modalSecondaryButton}
                onClick={() => setIsFlowModalOpen(false)}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
