import React from "react";
import Button from "./Button";
import OptionButton from "./OptionButton";
import styles from "../../Questionnaire.module.css";

const ConflictCard = ({
  conflictData,
  conflictChoice,
  setConflictChoice,
  onBack,
  onFinish,
  isEmbedded = false,
}) => {
  const labels = {
    BCT:
      conflictData?.reopConflict && !conflictData?.radConflict
        ? "乳房不要全部被切掉，外觀不要變太多比較重要"
        : !conflictData?.reopConflict && conflictData?.radConflict
          ? "乳房不要全部被切掉，外觀不要變太多比較重要"
          : "乳房不要全部被切掉，外觀不要變太多比較重要",

    SM:
      conflictData?.reopConflict && !conflictData?.radConflict
        ? "不用再開第二次刀比較重要"
        : !conflictData?.reopConflict && conflictData?.radConflict
          ? "不用接受放射線治療比較重要"
          : "不用再開第二次刀也不用接受放射線治療比較重要",
  };

  const handleFinish = () => {
    if (conflictChoice) {
      onFinish(conflictChoice);
    }
  };

  // 1. 將主要的內容結構提取出來
  const CardContent = (
    <div
      className={styles.conflictCard}
      style={{
        border: "2px solid #ff4d4f",
        padding: "24px", // 稍微增加內距，感覺更寬敞
        borderRadius: "16px",
        width: "95%", // 👈 在小螢幕時保持邊距
        maxWidth: "480px", // 👈 跟 Questionnaire 的影片/題目寬度對齊
        boxSizing: "border-box",
        margin: "0 auto", // 輕微淡紅色背景，增加警示感
      }}
      sx={{
        "&:hover": {
          backgroundColor: "#fdf2f5",
          borderColor: "#b9375d !important",
        },
      }}
    >
      <h3 className={styles.questionTitle}>
        💡 您的選擇似乎出現衝突，請針對您的顧慮做出最後抉擇
      </h3>

      <div
        className={styles.conflictDescription}
        style={{
          margin: "20px 0",
          lineHeight: "1.8",
          textAlign: "left",
          fontSize: "1.05rem",
          color: "#444",
        }}
      >
        {conflictData?.reopConflict && !conflictData?.radConflict && (
          <p>
            您希望<strong>盡量保留原本的乳房外觀</strong>
            ，但又不想承擔部分乳房切除後，可能有約兩成機率
            <strong>因為邊緣不足需要再開一次刀</strong>的風險。
            <br />
            這兩個願望在現實中有所衝突，因為部分乳房切除就必須承擔安全邊緣不確定性。
            <br />
            <br />
            您最在意的是：
          </p>
        )}
        {!conflictData?.reopConflict && conflictData?.radConflict && (
          <p>
            您希望<strong>盡量保留原本的乳房外觀</strong>
            ，但又不想接受部分乳房切除後幾乎必須進行的
            <strong>放射線治療</strong>。<br />
            這兩個願望在現實中有所衝突，因為部分乳房切除，如果是乳癌的情況下，就必須搭配放療。
            <br />
            <br />
            您最在意的是：
          </p>
        )}
        {conflictData?.reopConflict && conflictData?.radConflict && (
          <p>
            您希望<strong>盡量保留原本的乳房外觀</strong>
            ，但又不想承擔承擔部分乳房切除後，可能有約兩成機率
            <strong>因為邊緣不足需要再開一次刀</strong>
            的風險，也不想接受如果是乳癌的情況下，就必須搭配
            <strong>放射線治療</strong>。<br />
            這些願望在現實中有所衝突，因為部分乳房切除就必須同時承擔這些事會發生的可能。
            <br />
            <br />
            您最在意的是：
          </p>
        )}
      </div>

      <div className={styles.optionsGroup}>
        <OptionButton
          label={labels.BCT}
          isSelected={conflictChoice === "BCT"}
          onClick={() => setConflictChoice("BCT")}
        />
        <OptionButton
          label={labels.SM}
          isSelected={conflictChoice === "SM"}
          onClick={() => setConflictChoice("SM")}
        />
      </div>

      <div className={styles.actionGroup}>
        <Button variant="outline" onClick={onBack} fullWidth>
          返回修改答案
        </Button>
        <Button onClick={handleFinish} isDisabled={!conflictChoice} fullWidth>
          看最終結果
        </Button>
      </div>
    </div>
  );

  // 2. 如果是嵌入模式，直接回傳 CardContent；
  //    否則（獨立測試時）回傳帶有容器的結構。
  return isEmbedded ? (
    CardContent
  ) : (
    <div className={styles.container}>{CardContent}</div>
  );
};

export default ConflictCard;
