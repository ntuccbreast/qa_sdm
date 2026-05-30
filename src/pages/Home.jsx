// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import styles from "../Home.module.css";
import eveVideo from "../assets/eve_sdm_talk.mp4";
import { introText } from "../constants/sdm";

const Home = () => {
  const navigate = useNavigate();
  const { setHeroData, setAllAnswers } = useUI();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [formData, setFormData] = useState({ userName: "", birthDate: "" });

  const [pureSpeechText, setPureSpeechText] = useState("");
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  // 🌟 用來存放切碎後的「句子清單」以及每個句子的「起始字元位置」
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    setHeroData(null); // 隱藏預設 Layout 抬頭

    // 1. 清洗 HTML 標籤
    const cleanedText = introText.replace(/<[^>]*>/g, "").trim();
    setPureSpeechText(cleanedText);

    // 2. 核心魔法：動態建立「句子與字元索引對照表」
    const sentenceArray = cleanedText.match(/[^。？！，、]+[。？！，、]?/g) || [
      cleanedText,
    ];

    let accumulatedLength = 0;
    const mappedSentences = sentenceArray.map((sentence) => {
      const startIdx = accumulatedLength;
      accumulatedLength += sentence.length;
      return {
        text: sentence.trim(),
        start: startIdx,
        end: accumulatedLength,
      };
    });

    setSentences(mappedSentences);

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [setHeroData]);

  const handlePlaySpeech = (text) => {
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

    // 💬 關鍵優化：每當語音前進，就去比對當前的 charIndex 落在落在哪個句子的範圍內
    utterance.onboundary = (event) => {
      const currentIndex = event.charIndex;

      // 找尋當前字元位置屬於哪一句話
      const activeSentence = sentences.find(
        (s) => currentIndex >= s.start && currentIndex < s.end,
      );

      if (activeSentence) {
        setCurrentSubtitle(activeSentence.text);
      }
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

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSubtitle("");
      if (videoRef.current) videoRef.current.pause();
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

  const handleStart = () => {
    if (!formData.userName || !formData.birthDate) {
      alert("請填寫完整資料後再開始");
      return;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (videoRef.current) videoRef.current.pause();

    setAllAnswers((prev) => ({
      ...prev,
      userName: formData.userName,
      birthDate: formData.birthDate,
    }));
    navigate("/selection");
  };

  /* 🌟 核心修正位置：變數必須宣告在 return 之前 */
  // 檢查姓名與生日是否其中一個是空的
  const isFormIncomplete = !formData.userName || !formData.birthDate;

  return (
    <>
      {/* 上半部影片區 (現在直接在 MainLayout 的卡片內) */}
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

      {/* 下半部內容表單 (現在會自動填入 MainLayout 的卡片下方) */}
      <div className={styles.contentSection}>
        <div className={styles.inputWrapper}>
          <Input
            label="請輸入您的姓名"
            name="userName"
            value={formData.userName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userName: e.target.value }))
            }
          />
          <Input
            label="請輸入您的出生年月日"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* 3. 按鈕區：完全移出 inputWrapper，它是獨立的區塊 */}
      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleStart}
          fullWidth
          /* 🌟 核心修正：資料未填完整時套用置灰視覺，但依然允許點擊觸發提示 */
          style={{
            pointerEvents: "auto", // 確保反灰時點擊，依然能觸發 handleStart 內原本寫好的 alert("請填寫完整資料後再開始")
            ...(isFormIncomplete
              ? {
                  opacity: 0.5 /* 半透明 */,
                  filter: "grayscale(100%)" /* 強制變灰色 */,
                  cursor: "not-allowed" /* 滑鼠移上去顯示禁止符號 */,
                }
              : {}),
          }}
        >
          開始使用
        </Button>
      </div>
    </>
  );
};

export default Home;
