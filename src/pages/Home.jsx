// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import styles from "../Home.module.css";
import eveVideo from "../assets/eve_sdm_talk.mp4";
import { introText } from "../constants/sdm";
import { useSpeech } from "../hooks/useSpeech";

const Home = () => {
  const navigate = useNavigate();
  const { setHeroData, setAllAnswers } = useUI();
  const videoRef = useRef(null);
  const { speak, cancel, pause, resume } = useSpeech();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [formData, setFormData] = useState({ userName: "", birthDate: "" });
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [sentences, setSentences] = useState([]);
  const [pureSpeechText, setPureSpeechText] = useState("");

  useEffect(() => {
    setHeroData(null);
    const cleanedText = introText.replace(/<[^>]*>/g, "").trim();
    setPureSpeechText(cleanedText);

    // 斷句：依標點符號切分，每句保留起始/結束的字元位置
    const sentenceArray = cleanedText.match(/[^。？！，、]+[。？！，、]?/g) || [cleanedText];
    let acc = 0;
    setSentences(
      sentenceArray.map((s) => {
        const start = acc;
        acc += s.length;
        return { text: s.trim(), start, end: acc };
      })
    );

    return () => {
      cancel();
      if (videoRef.current) videoRef.current.pause();
    };
  }, [setHeroData]);

  // ✅ 字幕更新：同時支援桌機 onboundary 與 iOS 計時器模擬
  // sentences 存在 ref 裡，避免 speak callback 拿到舊的 closure 值
  const sentencesRef = useRef([]);
  useEffect(() => {
    sentencesRef.current = sentences;
  }, [sentences]);

  const updateSubtitle = (charIndex) => {
    const active = sentencesRef.current.find(
      (s) => charIndex >= s.start && charIndex < s.end
    );
    if (active) setCurrentSubtitle(active.text);
  };

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
          setIsPlaying(true);
          setIsPaused(false);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        },
        // ✅ onBoundary 在桌機正常用、iOS 由 useSpeech 內的計時器呼叫
        onBoundary: (event) => {
          updateSubtitle(event.charIndex);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSubtitle("");
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSubtitle("");
          if (videoRef.current) videoRef.current.pause();
        },
      });
    }
  };

  const handleStart = () => {
    if (!formData.userName || !formData.birthDate) {
      alert("請填寫完整資料後再開始");
      return;
    }
    cancel();
    if (videoRef.current) videoRef.current.pause();
    setAllAnswers((prev) => ({
      ...prev,
      userName: formData.userName,
      birthDate: formData.birthDate,
    }));
    navigate("/selection");
  };

  // ✅ iOS 鍵盤彈出時，延遲將輸入框捲入視窗，避免版面卡住
  const handleInputFocus = (e) => {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  };

  const isFormIncomplete = !formData.userName || !formData.birthDate;

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.videoSection}>
        <video
          ref={videoRef}
          src={eveVideo}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          loop
          muted
          className={styles.theatreVideo}
        />
        {isPlaying && currentSubtitle && (
          <div className={styles.subtitleOverlay}>
            <p className={styles.subtitleText}>{currentSubtitle}</p>
          </div>
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
        <div className={styles.inputWrapper}>
          <Input
            label="請輸入您的姓名"
            name="userName"
            value={formData.userName}
            onFocus={handleInputFocus}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userName: e.target.value }))
            }
          />
          <Input
            label="請輸入您的出生年月日"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onFocus={handleInputFocus}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
            }
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleStart}
          fullWidth
          style={{
            pointerEvents: "auto",
            ...(isFormIncomplete
              ? { opacity: 0.5, filter: "grayscale(100%)", cursor: "not-allowed" }
              : {}),
          }}
        >
          開始使用
        </Button>
      </div>
    </div>
  );
};

export default Home;
