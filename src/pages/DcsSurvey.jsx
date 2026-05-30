import React, { useState } from "react";
import { DCS_QUESTIONS, DCS_OPTIONS, DCS_CITATION } from "../constants/dcs";
import styles from "../DcsSurvey.module.css";

const DcsSurvey = ({ onComplete, onClose }) => {
  const [currentDcsIndex, setCurrentDcsIndex] = useState(0);
  const [dcsAnswers, setDcsAnswers] = useState({});

  const handleDcsSelect = (value) => {
    const currentQuestion = DCS_QUESTIONS[currentDcsIndex];
    const updatedAnswers = { ...dcsAnswers, [currentQuestion.id]: value };
    setDcsAnswers(updatedAnswers);

    if (currentDcsIndex < DCS_QUESTIONS.length - 1) {
      setCurrentDcsIndex(currentDcsIndex + 1);
    } else {
      onComplete(updatedAnswers);
    }
  };

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.content}>
        <div className={styles.closeHeader}>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.citationHeader}>
          <span className={styles.citationTitle}>{DCS_CITATION.title}</span>
          <small className={styles.citationSource}>{DCS_CITATION.source}</small>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((currentDcsIndex + 1) / DCS_QUESTIONS.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className={styles.progressText}>
            進度：{currentDcsIndex + 1} / {DCS_QUESTIONS.length}
          </span>
        </div>

        <div className={styles.questionZone}>
          <p className={styles.questionText}>
            {DCS_QUESTIONS[currentDcsIndex].text}
          </p>
        </div>

        <div className={styles.optionsGroup}>
          {DCS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleDcsSelect(opt.value)}
              className={styles.dcsOptionButton}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {currentDcsIndex > 0 && (
          <button
            onClick={() => setCurrentDcsIndex(currentDcsIndex - 1)}
            className={styles.backQuestionButton}
          >
            ← 返回上一題
          </button>
        )}
      </div>
    </div>
  );
};

export default DcsSurvey;
