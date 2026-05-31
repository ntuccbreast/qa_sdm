// src/pages/Selections.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import * as SelectionData from "../constants/selection";
import Button from "../components/common/Button";
import { useUI } from "../context/UIContext";
import styles from "../Selections.module.css";
import eveVideo from "../assets/eve_sdm_talk.mp4";
import { useSpeech } from "../hooks/useSpeech";

const Selections = () => {
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();
  const videoRef = useRef(null);
  const { speak, cancel, pause, resume } = useSpeech();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [sentences, setSentences] = useState([]);
  const [pureSpeechText, setPureSpeechText] = useState("");

  useEffect(() => {
    setHeroData(null);
    const welcomeText = `${allAnswers.userName || "您"}您好，我可以幫您什麼呢？請根據您想使用的功能選擇。`;
    setPureSpeechText(welcomeText);

    const sentenceArray = welcomeText.match(/[^。？！，、]+[。？！，、]?/g) || [welcomeText];
    let acc = 0;
    setSentences(sentenceArray.map((s) => {
      const start = acc; acc += s.length;
      return { text: s.trim(), start, end: acc };
    }));

    return () => { cancel(); if (videoRef.current) videoRef.current.pause(); };
  }, [setHeroData, allAnswers.userName]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    if (isPlaying && !isPaused) {
      pause();
      if (videoRef.current) videoRef.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      resume();
      if (videoRef.current) videoRef.current.play().catch(() => {});
      setIsPaused(false);
    } else {
      speak({
        text: pureSpeechText,
        onStart: () => {
          setIsPlaying(true); setIsPaused(false);
          if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
        },
        onBoundary: (event) => {
          const active = sentences.find((s) => event.charIndex >= s.start && event.charIndex < s.end);
          if (active) setCurrentSubtitle(active.text);
        },
        onEnd: () => {
          setIsPlaying(false); setIsPaused(false); setCurrentSubtitle("");
          if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
        },
        onError: () => {
          setIsPlaying(false); setIsPaused(false); setCurrentSubtitle("");
          if (videoRef.current) videoRef.current.pause();
        },
      });
    }
  };

  const handleConfirm = () => {
    if (!selectedId) return alert("請先選擇一個方案");
    cancel();
    const paths = { 1: "/SDM", 2: "/chatbot" };
    const targetPath = paths[selectedId];
    if (targetPath) navigate(targetPath);
  };

  const currentSelection = SelectionData.selectionList.find((s) => s.id === selectedId);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" }}>
      <div className={styles.videoSection}>
        <video ref={videoRef} src={eveVideo} playsInline webkit-playsinline="true" preload="auto" loop muted className={styles.theatreVideo} />
        {isPlaying && currentSubtitle && (
          <div className={styles.subtitleOverlay}><p className={styles.subtitleText}>{currentSubtitle}</p></div>
        )}
        {isPlaying && (
          <div className={styles.audioBadge}>
            <span className={isPaused ? styles.audioDotPaused : styles.audioDot}></span>
            {isPaused ? "已暫停" : "說明中..."}
          </div>
        )}
        <button className={styles.controlBtnTopRight} onClick={handleTogglePlay}>
          {isPlaying && !isPaused ? "⏸ 暫停" : "▶️ 播放"}
        </button>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.cardList}>
          {SelectionData.selectionList.map((item) => (
            <Card key={item.id} title={item.title} description={item.description}
              isActive={selectedId === item.id} onClick={() => setSelectedId(item.id)} />
          ))}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button onClick={handleConfirm} fullWidth>
          {selectedId ? `進入 ${currentSelection?.title} ⮕` : "⬆ 請選擇上方方案"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/")} fullWidth>⬅ 返回修改基本資料</Button>
      </div>
    </div>
  );
};

export default Selections;
