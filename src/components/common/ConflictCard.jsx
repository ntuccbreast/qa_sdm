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
      onFinish(labels[conflictChoice]);
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
          textAlign: "left", // 👈 配合置左需求
          fontSize: "1.05rem",
          color: "#444",
        }}
      >
        {conflictData?.reopConflict && !conflictData?.radConflict && (
          <p>
            您希望
            <strong>選擇部分乳房切除手術就是為了盡量維持原本乳房外觀</strong>
            ，但又不希望因為邊緣不乾淨<strong>有再次手術的可能</strong>。<br />
            但在醫療現實中，選擇部分乳房切除手術，就必須承擔有可能因為邊緣不乾淨而需要再次手術的風險。
            <br />
            <strong>提醒您：如果很在意外觀改變都可以考慮搭配重建喔！</strong>
            <br />
            您最在意的是：
          </p>
        )}
        {!conflictData?.reopConflict && conflictData?.radConflict && (
          <p>
            您希望
            <strong>選擇部分乳房切除手術就是為了盡量維持原本乳房外觀</strong>
            ，但又不希望<strong>接受放射線治療</strong>。<br />
            但在醫療現實中，選擇部分乳房切除手術，就必須搭配放療。
            <br />
            <strong>提醒您：如果很在意外觀改變都可以考慮搭配重建喔！</strong>
            <br />
            您最在意的是：
          </p>
        )}
        {conflictData?.reopConflict && conflictData?.radConflict && (
          <p>
            您希望
            <strong>選擇部分乳房切除手術就是為了盡量維持原本乳房外觀</strong>
            ，但又不希望因為邊緣不乾淨
            <strong>有再次手術的可能，也不想接受放療</strong>。<br />
            但在醫療現實中，選擇部分乳房切除手術，就必須承擔有可能因為邊緣不乾淨而需要再次手術的風險，也必須搭配放療。
            <br />
            <strong>提醒您：如果很在意外觀改變都可以考慮搭配重建喔！</strong>
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
