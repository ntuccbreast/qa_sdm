import React from "react";
import Button from "./Button";
import OptionButton from "./OptionButton";
import styles from "../../Questionnaire.module.css";

// 4 inline preference questions — must match exact labels used in decision logic
const PREFERENCE_QUESTIONS = [
  {
    id: "SM_B1_OP",
    label: "乳房外觀與重建考量",
    options: [
      "能接受外觀平整，不考慮重建",
      "能接受外觀改變，有意願考慮重建（需自費）",
      "外觀對我非常重要，希望盡量保留原本的乳房",
    ],
  },
  {
    id: "BCT_A2_MARGIN",
    label: "因為安全邊緣不夠需要再次手術的可能（部分乳房切除有兩成的人會遇到）",
    options: ["可以接受，有切除乾淨比較重要", "不想承擔還要再開一次刀的可能"],
  },
  {
    id: "BCT_A5_RADIATION",
    label: "放療排程（每天 4～8 週）",
    options: ["我可以接受並配合這樣的安排", "每天往返醫院的安排讓我感到壓力"],
  },
  {
    id: "BCT_A5_SIDEEFFECT",
    label: "放療副作用",
    options: [
      "可以接受，這些副作用在我可承受的範圍內",
      "這些副作用讓我感到顧慮，不確定能不能承受",
    ],
  },
];

const ReviewCard = ({
  localAnswers,
  onAnswerChange,
  onConfirm,
  onBack,
  isEmbedded = false,
}) => {
  const allAnswered = PREFERENCE_QUESTIONS.every((q) => !!localAnswers[q.id]);

  const CardContent = (
    <div
      style={{
        border: "2px solid #fa8c16",
        padding: "24px",
        borderRadius: "16px",
        width: "95%",
        maxWidth: "480px",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      <h3 className={styles.questionTitle} style={{ marginBottom: "8px" }}>
        📋 確認您的偏好選擇
      </h3>
      <p
        style={{
          color: "#666",
          fontSize: "0.92rem",
          marginBottom: "24px",
          lineHeight: "1.7",
        }}
      >
        以下是您在旅程中回答的四個偏好問題。可以在這裡重新調整，再進入最終建議。
      </p>

      {PREFERENCE_QUESTIONS.map((q, index) => (
        <div
          key={q.id}
          style={{
            marginBottom:
              index < PREFERENCE_QUESTIONS.length - 1 ? "24px" : "0",
            paddingBottom:
              index < PREFERENCE_QUESTIONS.length - 1 ? "20px" : "0",
            borderBottom:
              index < PREFERENCE_QUESTIONS.length - 1
                ? "1px solid #f5f5f5"
                : "none",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "#444",
              margin: "0 0 10px 0",
              fontSize: "0.95rem",
            }}
          >
            {index + 1}. {q.label}
          </p>
          <div className={styles.optionsGroup}>
            {q.options.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                isSelected={localAnswers[q.id] === opt}
                onClick={() => onAnswerChange(q.id, opt)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className={styles.actionGroup}>
        <Button variant="outline" onClick={onBack} fullWidth>
          返回修改旅程
        </Button>
        <Button onClick={onConfirm} isDisabled={!allAnswered} fullWidth>
          確認，看最終建議
        </Button>
      </div>
    </div>
  );

  return isEmbedded ? (
    CardContent
  ) : (
    <div className={styles.container}>{CardContent}</div>
  );
};

export default ReviewCard;
