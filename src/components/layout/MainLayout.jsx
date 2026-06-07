// src/components/layout/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useUI } from "../../context/UIContext";
import { useSpeech } from "../../hooks/useSpeech";
import { Box } from "@mui/material";
import styles from "./MainLayout.module.css";
import eveVideo from "../../assets/eve_sdm_talk.mp4";
import helperIcon from "../../assets/helperinside.png";
import { useEffect, useRef, useState } from "react";

const MainLayout = () => {
  const {
    heroData,
    setIsSpeechPlaying,
    setHasSpeechEnded,
    hasSpeechEnded,
    isChatbotOpen,
    setIsChatbotOpen,
  } = useUI();
  const { speak, cancel, pause, resume } = useSpeech();
  const location = useLocation();
  const videoRef = useRef(null);
  const currentTextRef = useRef("");
  // Texts whose speech has been heard at least once in this route session
  const heardTextsRef = useRef(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const isQuestionnaire = location.pathname.startsWith("/questionnaire");

  const stopVideo = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };
  const startVideo = () => {
    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
  };

  // keepUnlocked: true when the user already heard this speech before
  // (replay, or navigating back to a previous question).
  // When true, onStart immediately sets hasSpeechEnded=true instead of locking.
  const doSpeak = (cleanText, keepUnlocked = false) => {
    currentTextRef.current = cleanText;
    speak({
      text: cleanText,
      onSubtitle: (text) => setSubtitle(text),
      onStart: () => {
        setIsPlaying(true); setIsPaused(false); setHasEnded(false);
        startVideo(); setIsSpeechPlaying(true);
        // If already heard: immediately mark as ended so buttons stay unlocked.
        // If new speech: lock until onEnd fires.
        setHasSpeechEnded(keepUnlocked);
      },
      onEnd: () => {
        heardTextsRef.current.add(currentTextRef.current); // remember this text was heard
        setIsPlaying(false); setIsPaused(false); setHasEnded(true);
        setSubtitle(""); stopVideo(); setIsSpeechPlaying(false); setHasSpeechEnded(true);
      },
      onError: () => {
        setIsPlaying(false); setIsPaused(false);
        setSubtitle(""); stopVideo(); setIsSpeechPlaying(false); setHasSpeechEnded(true);
      },
    });
  };

  useEffect(() => {
    cancel();
    // heardTextsRef is intentionally NOT cleared here — heard history persists
    // for the whole session so 返回介紹 → 開始評估諮詢 and 上一步 don't re-lock.
    setIsPlaying(false); setIsPaused(false); setHasEnded(false); setSubtitle("");
    setIsSpeechPlaying(false); setHasSpeechEnded(false); setIsChatbotOpen(false);
    stopVideo();
  }, [location.pathname]); // eslint-disable-line

  useEffect(() => {
    const raw = heroData?.description;
    if (!raw) return;
    const cleanText = raw.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;
    const alreadyHeard = heardTextsRef.current.has(cleanText);
    // Unlock immediately so the brief 100ms delay before speech starts never shows a locked state
    if (alreadyHeard) setHasSpeechEnded(true);
    const timer = setTimeout(() => doSpeak(cleanText, alreadyHeard), 100);
    return () => { clearTimeout(timer); cancel(); };
  }, [heroData?.description]); // eslint-disable-line

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying && !isPaused) {
      pause(); stopVideo(); setIsPaused(true);
    } else if (isPlaying && isPaused) {
      resume(); startVideo(); setIsPaused(false);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    const raw = heroData?.description;
    if (!raw) return;
    const cleanText = raw.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;
    const alreadyHeard = heardTextsRef.current.has(cleanText);
    doSpeak(cleanText, alreadyHeard);
  };

  const handleReplay = (e) => {
    e.stopPropagation();
    const text = currentTextRef.current;
    if (!text) return;
    cancel();
    setHasEnded(false); setSubtitle("");
    // Replay always keeps the unlock state — user already heard it
    setTimeout(() => doSpeak(text, true), 80);
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.phoneWrapper}>
        <div className={styles.videoSection}>
          <video ref={videoRef} src={eveVideo} loop muted playsInline className={styles.videoEl} />

          {isPlaying && !isPaused && subtitle && (
            <div className={styles.subtitleOverlay}>
              <p className={styles.subtitleText}>{subtitle}</p>
            </div>
          )}
          {isPlaying && (
            <div className={styles.audioBadge}>
              <span className={isPaused ? styles.audioDotPaused : styles.audioDot} />
              {isPaused ? "已暫停" : "說明中..."}
            </div>
          )}
          {!isPlaying && !hasEnded && heroData?.description && (
            <button className={styles.controlBtnTopRight} onClick={handlePlay}>
              ▶ 播放說明
            </button>
          )}
          {isPlaying && (
            <button className={styles.controlBtnTopRight} onClick={handleTogglePlay}>
              {isPaused ? "▶️ 繼續" : "⏸ 暫停"}
            </button>
          )}
          {!isPlaying && hasEnded && (
            <button className={styles.controlBtnTopRight} onClick={handleReplay}>
              🔁 重播
            </button>
          )}

          {/* Helper avatar — only on questionnaire pages, unlocks after speech ends */}
          {isQuestionnaire && !isChatbotOpen && (
            <div
              className={`${styles.helperBtnWrap} ${hasSpeechEnded ? styles.helperBtnActive : ""}`}
              onClick={() => hasSpeechEnded && setIsChatbotOpen(true)}
              title={hasSpeechEnded ? "點擊詢問小幫手" : "請先聆聽說明"}
            >
              <img src={helperIcon} alt="諮詢小幫手" className={styles.helperBtnImg} />
              <span className={styles.helperBtnLabel}>
                {hasSpeechEnded ? "問小幫手" : "聆聽後可詢問"}
              </span>
            </div>
          )}
        </div>

        <div className={styles.interactiveCard}>
          <Outlet />
        </div>
        {/* Portal target for questionnaire chatbot — direct child of phoneWrapper so it can cover the full container */}
        <div id="questionnaire-chatbot-root" />
      </div>

      <Box className={styles.desktopOnly}>
        <Footer />
      </Box>
    </div>
  );
};

export default MainLayout;
