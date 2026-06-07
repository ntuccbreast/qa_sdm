import React, { useEffect, useState } from "react";
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
  const { setHeroData, allAnswers, isSpeechPlaying } = useUI();
  const { finalData, topicKey, savedDataMap, chatHistory, questionnaireSnapshot } = location.state || {};
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  const chartUrl = finalData?.flowChart || "https://sdm-5cbs.onrender.com/assets/images/default.png";

  useEffect(() => {
    if (!finalData) return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = finalData.description || "";
    const pureDescription = tempDiv.textContent || tempDiv.innerText || "";
    const userName = allAnswers.userName || "您";
    setHeroData({
      step: 3, currentStep: 3,
      imageUrl: "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
      title: "第三步驟：評估結果建議",
      description: `${userName}，我已為您整理好：${finalData.title}。${pureDescription}`,
    });
  }, [finalData, allAnswers.userName, setHeroData]);

  const handleSurveyComplete = async (finalDcsAnswers) => {
    setIsSurveyCompleted(true);
    setIsSurveyOpen(false);
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
            .filter((msg) => msg.role !== "assistant" || chatHistory.indexOf(msg) !== 0)
            .map((msg) => ({ role: msg.role === "user" ? "病人" : "機器人", content: msg.content })),
        ),
      };
      const result = await saveToSheet(logData);
      console.log("saveToSheet 回傳：", result);
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

      <div className={styles.scrollableBody}>
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

          <div className={`${styles.surveyCard} ${isSurveyCompleted ? styles.surveyCardCompleted : ""}`}>
            <p className={`${styles.surveyTitle} ${isSurveyCompleted ? styles.surveyTitleCompleted : ""}`}>
              {isSurveyCompleted ? "✅ 填寫完成！" : "最後一步：請填寫決策評估問卷"}
            </p>

            {!isSurveyCompleted && (
              <button
                onClick={() => !isSpeechPlaying && setIsSurveyOpen(true)}
                className={styles.primaryPinkButton}
                disabled={isSpeechPlaying}
                style={{
                  opacity: isSpeechPlaying ? 0.5 : 1,
                  cursor: isSpeechPlaying ? "not-allowed" : "pointer",
                }}
              >
                {isSpeechPlaying ? "請先聆聽上方說明" : "點此開始互動問卷"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footerButtonArea} style={{ display: "flex", gap: "10px" }}>
        {!isSurveyCompleted && (
          <Button
            variant="outline"
            style={{ flex: 1, height: "50px", borderRadius: "25px" }}
            onClick={() =>
              navigate(`/questionnaire/${topicKey}`, {
                state: { questionnaireSnapshot },
              })
            }
          >
            上一步
          </Button>
        )}
        <Button
          style={{ flex: 1, height: "50px", borderRadius: "25px" }}
          onClick={() => navigate("/selection")}
          isDisabled={!isSurveyCompleted}
        >
          {isSurveyCompleted ? "完成並回首頁" : "請先完成上方問卷以解鎖結束"}
        </Button>
      </div>

      {/* Survey overlay: positioned relative to phoneWrapper, covers video section too */}
      {isSurveyOpen && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 50,
          backgroundColor: "#fff",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          flexDirection: "column",
        }}>
          <DcsSurvey
            onComplete={handleSurveyComplete}
            onClose={() => setIsSurveyOpen(false)}
          />
        </div>
      )}

      {isFlowModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsFlowModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTextTitle}>您的預計治療流程</h3>
              <button onClick={() => setIsFlowModalOpen(false)} className={styles.closeButton}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <img src={chartUrl} alt="治療流程圖" />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalPrimaryButton} onClick={() => window.print()}>🖨️ 列印 / 儲存 PDF</button>
              <button className={styles.modalSecondaryButton} onClick={() => setIsFlowModalOpen(false)}>關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
