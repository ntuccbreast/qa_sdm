// src/pages/Selections.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import * as SelectionData from "../constants/selection";
import Button from "../components/common/Button";
import { useUI } from "../context/UIContext";
import styles from "../Selections.module.css";
import eveVideo from "../assets/eve_sdm_talk.mp4";

const Selections = () => {
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [pureSpeechText, setPureSpeechText] = useState("");
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    setHeroData(null);

    const welcomeText = `${allAnswers.userName || "您"}您好，我可以幫您什麼呢？請根據您想使用的功能選擇。`;
    setPureSpeechText(welcomeText);

    const sentenceArray = welcomeText.match(/[^。？！，、]+[。？！，、]?/g) || [
      welcomeText,
    ];
    let accumulatedLength = 0;
    const mappedSentences = sentenceArray.map((sentence) => {
      const startIdx = accumulatedLength;
      accumulatedLength += sentence.length;
      return { text: sentence.trim(), start: startIdx, end: accumulatedLength };
    });

    setSentences(mappedSentences);
    handlePlaySpeech(welcomeText, mappedSentences);

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [setHeroData, allAnswers.userName]);

  const handlePlaySpeech = (text, currentSentences = sentences) => {
    if (!window.speechSynthesis || !videoRef.current || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-TW";
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch((err) => console.log(err));
      }
    };

    utterance.onboundary = (event) => {
      const currentIndex = event.charIndex;
      const activeSentence = currentSentences.find(
        (s) => currentIndex >= s.start && currentIndex < s.end,
      );
      if (activeSentence) setCurrentSubtitle(activeSentence.text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSubtitle("");
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      if (videoRef.current) videoRef.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      if (videoRef.current)
        videoRef.current.play().catch((err) => console.log(err));
      setIsPaused(false);
    } else {
      handlePlaySpeech(pureSpeechText);
    }
  };

  const handleConfirm = () => {
    if (!selectedId) return alert("請先選擇一個方案");
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const paths = { 1: "/SDM", 2: "/chatbot" };
    const targetPath = paths[selectedId];
    if (targetPath) navigate(targetPath);
  };

  const currentSelection = SelectionData.selectionList.find(
    (s) => s.id === selectedId,
  );

  return (
    <>
      <div className={styles.videoSection}>
        <video
          ref={videoRef}
          src={eveVideo}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          loop
          className={styles.theatreVideo}
        />
        {isPlaying && currentSubtitle && (
          <div className={styles.subtitleOverlay}>
            <p className={styles.subtitleText}>{currentSubtitle}</p>
          </div>
        )}
        {isPlaying && (
          <div className={styles.audioBadge}>
            <span
              className={isPaused ? styles.audioDotPaused : styles.audioDot}
            ></span>
            {isPaused ? "已暫停" : "說明中..."}
          </div>
        )}
        <button
          className={styles.controlBtnTopRight}
          onClick={handleTogglePlay}
        >
          {isPlaying && !isPaused ? "⏸ 暫停" : "▶️ 播放"}
        </button>
      </div>

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
          {selectedId
            ? `進入 ${currentSelection?.title} ⮕`
            : "⬆ 請選擇上方方案"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/")} fullWidth>
          ⬅ 返回修改基本資料
        </Button>
      </div>
    </>
  );
};

export default Selections;
