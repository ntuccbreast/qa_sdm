// src/pages/Questionnaire.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import OptionButton from "../components/common/OptionButton";
import ConflictCard from "../components/common/ConflictCard";
import Stepper from "../components/common/Stepper";
import helperIcon from "../assets/helperinside.png";
import { useUI } from "../context/UIContext";
import {
  questionsDCIS,
  questionsBctSm,
  getBctSmResult,
  topicDescriptions,
} from "../constants/sdm";
import styles from "../Questionnaire.module.css";
import { saveToSheet } from "../components/utils/googleSheetLogger";
import {
  checkBctSmConflict,
  getBctSmFinalResult,
} from "../components/utils/decisionLogic";

const PHASE = {
  READY: "READY",
  SPEAKING: "SPEAKING",
};

const Questionnaire = () => {
  const { topicKey } = useParams();
  const navigate = useNavigate();
  const { setHeroData, allAnswers, setAllAnswers } = useUI();

  // 🛠️ 核心宣告：自動偵測是否為本地開發環境 (localhost:3000)
  const isDev =
    window.location.hostname === "localhost" ||
    process.env.NODE_ENV === "development";

  const questionSet = useMemo(
    () => (topicKey === "dcis" ? questionsDCIS : questionsBctSm),
    [topicKey],
  );

  const [currentId, setCurrentId] = useState(questionSet[0].id);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [viewedPages, setViewedPages] = useState(new Set());
  const [viewedCases, setViewedCases] = useState(new Set());
  const [completedRoutes, setCompletedRoutes] = useState(new Set());
  const [isConflictMode, setIsConflictMode] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [conflictChoice, setConflictChoice] = useState(null);

  // 🎯 新增：控制問卷頁面「下滑看更多」提示的狀態與 Ref
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollableContentRef = useRef(null);

  // 🎯 新增：智慧偵測問卷內容是否過長且尚未滑到底
  const checkCanScroll = () => {
    const el = scrollableContentRef.current;
    if (el) {
      const canScrollDown = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 15;
      setShowScrollHint(canScrollDown && !isAtBottom);
    }
  };

  // 互動狀態控制 (Chatbot 專用)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [phase, setPhase] = useState(PHASE.READY);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `${
        allAnswers.userName ? `${allAnswers.userName}，` : ""
      }您好！根據稍早看過的內容，您有什麼問題想詢問嗎？`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Chatbot 專用的 Refs
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef(null);
  const prevMsgCount = useRef(messages.length);
  const isAutoScrolling = useRef(false);
  const chatbotRef = useRef(null);

  // ✅ iOS 鍵盤彈出時，用 visualViewport 動態調整 chatbot 視窗高度
  useEffect(() => {
    if (!isChatbotOpen) return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      if (chatbotRef.current) {
        chatbotRef.current.style.height = `${viewport.height}px`;
        chatbotRef.current.style.top = `${viewport.offsetTop}px`;
        chatbotRef.current.style.left = `${viewport.offsetLeft}px`;
        chatbotRef.current.style.width = `${viewport.width}px`;
      }
    };

    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleResize);
      if (chatbotRef.current) {
        chatbotRef.current.style.height = "";
        chatbotRef.current.style.top = "";
        chatbotRef.current.style.left = "";
        chatbotRef.current.style.width = "";
      }
    };
  }, [isChatbotOpen]);

  // 智慧自動捲動對話框邏輯
  useEffect(() => {
    if (!isChatbotOpen) return;

    const currentCount = messages.length;
    const oldCount = prevMsgCount.current;
    prevMsgCount.current = currentCount;

    if (currentCount <= oldCount || currentCount <= 1) return;

    isAutoScrolling.current = true;
    const lastMsg = messages[currentCount - 1];

    if (lastMsg.role === "user") {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "auto",
      });
      isAutoScrolling.current = false;
    } else {
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [messages.length, isChatbotOpen]);

  // API 發送訊息函式
  const handleSend = async (manualInput = "") => {
    const currentInput = manualInput || input.trim();
    if (!currentInput || isLoading) return;

    setInput("");
    if (inputRef.current) inputRef.current.value = "";

    const userMsg = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_URL = "https://web-production-fbb7b.up.railway.app/ask/sdm";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentInput,
          ui_language: "zh",
          sdm_context: {
            current_topic: currentQ?.topic || "",
            decision_type: topicKey, // "dcis" 或 "bctsm"，來自 useParams
          },
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      }
    } catch (error) {
      console.error("API 請求失敗:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，系統連線失敗。" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const currentQ = questionSet.find((q) => q.id === currentId);

  useEffect(() => {
    setAllAnswers((prev) => ({
      ...prev,
      answers: {},
      selectedTopic: topicKey, // topicKey 在 mount 時已經確定，直接讀就好
    }));
    setAnswers({});
    setHistory([]);
    setIsChatbotOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🎯 當切換題目、或是切換衝突模式時，重新計算是否需要顯示下滑提示
  useEffect(() => {
    const timer = setTimeout(checkCanScroll, 300);
    return () => clearTimeout(timer);
  }, [currentId, isConflictMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroData({
      imageUrl:
        "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
      title: topicDescriptions[topicKey]?.label || "問卷評估",
      description: isConflictMode
        ? "請針對您的顧慮做出最後權衡。"
        : "請詳閱說明再做出選擇或點擊下一步。",
    });
  }, [currentId, isConflictMode, topicKey, setHeroData]);

  // 🔊 背景引導語音 (TTS)
  useEffect(() => {
    if (isConflictMode || !currentQ) return;

    if (synthRef.current) {
      synthRef.current.cancel();
    }

    const scriptText = currentQ.assistantScript || currentQ.descriptionText;

    if (!scriptText) {
      setPhase(PHASE.READY);
      return;
    }

    setPhase(PHASE.SPEAKING);
    const cleanText = scriptText.replace(/<[^>]*>/g, "");

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "zh-TW";
      utterance.rate = 1.0;

      // ✅ 修正：明確挑選中文語音，修正 iOS 系統語言為英文時 fallback 的問題
      const voices = window.speechSynthesis.getVoices();
      const zhVoice =
        voices.find((v) => v.lang === "zh-TW") ||
        voices.find((v) => v.lang === "zh-HK") ||
        voices.find((v) => v.lang.startsWith("zh"));
      if (zhVoice) utterance.voice = zhVoice;

      utterance.onend = () => setPhase(PHASE.READY);
      utterance.onerror = () => setPhase(PHASE.READY);

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    };

    // ✅ 修正：iOS Safari 的 getVoices() 是非同步的，需等 onvoiceschanged 觸發
    if (window.speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [currentId, isConflictMode, currentQ]);

  useEffect(() => {
    const caseIds = ["SM_CASE_1_RAD", "SM_CASE_2", "SM_CASE_3", "SM_CASE_4"];
    if (caseIds.includes(currentId))
      setViewedCases((prev) => new Set(prev).add(currentId));
    if (currentId === "BCT_A7_FINISH")
      setCompletedRoutes((prev) => new Set(prev).add("BCT"));
    if (currentId === "SM_B6_FINISH")
      setCompletedRoutes((prev) => new Set(prev).add("SM"));
  }, [currentId]);

  // 🎥 YouTube IFrame Player API
  const ytPlayerRef = useRef(null);

  // 載入 YouTube IFrame API script（只載入一次）
  useEffect(() => {
    if (!window.YT && !document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // 每次切換節點時初始化/重建播放器
  useEffect(() => {
    // 先同步已看過的狀態
    setIsVideoFinished(
      viewedPages.has(currentId) || answers[currentId] !== undefined,
    );

    const videoId = currentQ?.videoUrl?.match(
      /(?:v=|\/embed\/|youtu\.be\/)([^"&?\/\s]{11})/,
    )?.[1];

    if (!videoId) return;

    // 銷毀舊播放器
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch (e) {}
      ytPlayerRef.current = null;
    }

    const markFinished = () => {
      setIsVideoFinished(true);
      setViewedPages((prev) => new Set(prev).add(currentId));
    };

    const initPlayer = () => {
      console.log(
        "initPlayer called, div exists:",
        !!document.getElementById(`yt-player-${currentId}`),
      );

      if (!document.getElementById(`yt-player-${currentId}`)) return;
      console.log("creating YT.Player...");
      ytPlayerRef.current = new window.YT.Player(`yt-player-${currentId}`, {
        videoId,
        playerVars: { rel: 0, origin: window.location.origin },
        events: {
          onStateChange: (event) => {
            console.log("YT onStateChange:", event.data);
            // 0 = ended
            if (event.data === 0) {
              markFinished();
              return;
            }
            // 剩餘時間 ≤ 3 秒也算看完
            if (event.data === 1) {
              try {
                const duration = event.target.getDuration();
                const current = event.target.getCurrentTime();
                if (duration > 0 && duration - current <= 3) {
                  markFinished();
                }
              } catch (e) {}
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      console.log("YT already loaded, calling initPlayer");
      initPlayer();
    } else {
      console.log("YT not loaded yet, setting onYouTubeIframeAPIReady");
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }

    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [currentId, currentQ]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAllCasesViewed = viewedCases.size >= 4;
  const isBothRoutesViewed =
    completedRoutes.has("BCT") && completedRoutes.has("SM");

  const handleBack = () => {
    if (isConflictMode) return setIsConflictMode(false);
    if (history.length > 0) {
      const lastId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentId(lastId);
    } else {
      navigate(`/SDM?step=INTRO&topic=${topicKey}`);
    }
  };

  // 在 Questionnaire.jsx 中修改 finishAssessment
  const finishAssessment = (finalAnswers, ultimateChoice = null) => {
    let result;
    if (topicKey === "bctsm") {
      result = ultimateChoice
        ? getBctSmFinalResult(ultimateChoice, finalAnswers)
        : getBctSmResult(finalAnswers);
    } else {
      const selected = currentQ?.options?.find(
        (opt) => opt.label === finalAnswers[currentId],
      );
      result = {
        title: selected?.resultTitle || "評估完成",
        description: selected?.resultDescription || "請與醫師討論",
        type: selected?.type || "",
        flowChart: selected?.flowChart || null,
      };
    }

    // 1. 計算要保存的資料陣列
    const dataToSave = Object.keys(finalAnswers)
      .filter((id) => {
        const qDef = questionSet.find((q) => q.id === id);
        const excludedIds = [
          "BCTSM_START",
          "BCT_A7_FINISH",
          "SM_B6_FINISH",
          "SM_B3_TREATMENT_MATRIX",
        ];
        return qDef && qDef.options?.length >= 2 && !excludedIds.includes(id);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((id) => finalAnswers[id]);

    if (topicKey === "bctsm") {
      dataToSave.push(ultimateChoice || "無衝突");
    }

    // 2. 移除 saveToSheet，改為透過導航傳遞資料
    navigate("/result", {
      state: {
        finalData: result,
        topicKey: topicKey,
        savedDataMap: dataToSave, // 將處理好的陣列帶過去
        chatHistory: messages,
      },
    });
  };

  const isLockedByVideoVisual = currentQ?.videoUrl && !isVideoFinished;
  const isLockedByVideoLogical = isLockedByVideoVisual && !isDev;

  const handleNext = () => {
    if (isLockedByVideoVisual) {
      return alert("請完整觀看上方影片，才能進入下一步喔！");
    }

    const currentChoice = answers[currentId];
    if (currentQ.options?.length > 0 && !currentChoice)
      return alert("請先點選一個選項");

    const latestAnswers = {
      ...allAnswers.answers,
      ...answers,
      [currentId]: currentChoice || "下一步",
    };
    setAllAnswers((prev) => ({ ...prev, answers: latestAnswers }));

    const selectedOpt = currentQ.options?.find(
      (opt) => opt.label === currentChoice,
    );

    if (currentQ.isFinal || selectedOpt?.isFinal) {
      if (topicKey === "bctsm") {
        const conflict = checkBctSmConflict(latestAnswers);
        if (conflict.hasConflict) {
          setConflictData(conflict);
          setIsConflictMode(true);
          return;
        }
      }
      finishAssessment(latestAnswers);
    } else {
      const nextId = selectedOpt?.nextId || currentQ.nextId;
      setHistory([...history, currentId]);
      setCurrentId(nextId);
    }
  };

  const getRouteInfo = () => {
    if (isConflictMode) return { label: "解決選擇衝突", color: "#ff4d4f" };
    if (currentId.startsWith("BCT_"))
      return {
        label: "體驗中：部分乳房切除合併前哨淋巴結切片流程",
        color: "#ff7875",
      };
    if (currentId.startsWith("SM_"))
      return {
        label: "體驗中：全乳房切除合併前哨淋巴結切片流程",
        color: "#52c41a",
      };
    if (currentId.startsWith("Q_"))
      return { label: "正在釐清您的偏好", color: "#fa8c16" };
    if (currentId === "BCTSM_START")
      return { label: "請選擇想要體驗的流程", color: "#722ed1" };
    if (currentId === "DCIS_Q1")
      return { label: "請選擇手術方式", color: "#722ed1" };
    if (currentId.includes("DCIS_") && currentId.includes("_BCT"))
      return { label: "目前選擇：部分乳房切除", color: "#ff7875" };
    if (currentId.includes("DCIS_") && currentId.includes("_SLN"))
      return {
        label: "目前選擇：部分切除合併前哨淋巴結切片",
        color: "#13c2c2",
      };
    return null;
  };

  const routeInfo = getRouteInfo();
  if (!currentQ && !isConflictMode)
    return <div className={styles.container}>正在生成結果...</div>;

  const videoId = currentQ?.videoUrl?.match(
    /(?:v=|\/embed\/|youtu\.be\/)([^"&?\/\s]{11})/,
  )?.[1];

  return (
    <div className={styles.container}>
      {/* 🎯 動態注入燈泡發光與下滑提示的全域 CSS 樣式 */}
      <style>{`
        @keyframes hint-glow {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 2px 6px rgba(244, 162, 180, 0.4);
            opacity: 0.85;
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 2px 12px rgba(244, 162, 180, 0.7);
            opacity: 1;
          }
        }
        .pulsing-hint {
          animation: hint-glow 2s infinite ease-in-out;
        }

        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .scroll-down-tip {
          position: sticky;
          bottom: 12px;
          left: 0;
          right: 0;
          margin: 16px auto 0 auto;
          width: max-content;
          background-color: rgba(244, 162, 180, 0.95);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: bounce-down 1.6s infinite ease-in-out;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      {/* 頂部進度條與狀態 */}
      <div className={styles.stickyHeader}>
        <Stepper
          topicKey={topicKey}
          currentId={currentId}
          isConflictMode={isConflictMode}
        />
        {routeInfo && (
          <div className={styles.routeHeader}>
            <span
              className={styles.routeBadge}
              style={{ backgroundColor: routeInfo.color }}
            >
              {routeInfo.label}
            </span>
          </div>
        )}
      </div>

      {/* 主內容滾動區 (掛載 Ref 與滾動接聽) */}
      <div
        ref={scrollableContentRef}
        onScroll={checkCanScroll}
        className={styles.scrollableContent}
      >
        {isConflictMode ? (
          <ConflictCard
            conflictData={conflictData}
            conflictChoice={conflictChoice}
            setConflictChoice={setConflictChoice}
            onBack={() => setIsConflictMode(false)}
            onFinish={(txt) => finishAssessment(allAnswers.answers, txt)}
            isEmbedded={true}
          />
        ) : (
          <>
            {/* 🛠️ 開發者專用沙盒控制面板 */}
            {isDev && (
              <div
                style={{
                  background: "#fff2e8",
                  border: "1px dashed #fa8c16",
                  padding: "10px 14px",
                  margin: "0 0 12px 0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#d46b08",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <span>
                  🛠️ <b>開發模式</b>
                </span>
                <button
                  onClick={() => {
                    const nextState = !isVideoFinished;
                    setIsVideoFinished(nextState);
                    if (nextState) {
                      setViewedPages((prev) => new Set(prev).add(currentId));
                    } else {
                      setViewedPages((prev) => {
                        const updated = new Set(prev);
                        updated.delete(currentId);
                        return updated;
                      });
                    }
                  }}
                  style={{
                    background: isVideoFinished ? "#52c41a" : "#fa8c16",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {isVideoFinished ? "切換為：未看完" : "切換為：已看完"}
                </button>
              </div>
            )}

            {/* 1. 常駐 YouTube 影片舞台 */}
            {currentQ?.videoUrl && (
              <div className={styles.topVideoStage}>
                <div
                  id={`yt-player-${currentId}`}
                  className={styles.stageIframe}
                />
              </div>
            )}
            {/* 2. 重點提示說明盒子 + 機器人 Icon */}
            <div
              className={`${styles.infoDocumentBox} ${isLockedByVideoVisual ? styles.lockedBox : ""}`}
            >
              <div className={styles.infoBoxHeader}>
                <h4 className={styles.infoBoxTitle}>
                  💡 重點提示 (有問題請隨時呼叫我 👉)
                </h4>

                {/* 🤖 Chatbot 觸發按鈕 */}
                <div
                  onClick={() => {
                    if (isLockedByVideoVisual) {
                      alert("請完整觀看完上方影片再詢問問題喔！");
                    } else {
                      setIsChatbotOpen(true);
                    }
                  }}
                  className={styles.imageChatbotTrigger}
                  title={
                    isLockedByVideoVisual
                      ? "看完影片才能問問題"
                      : "點擊詢問智慧小幫手"
                  }
                  style={
                    isLockedByVideoVisual
                      ? { animation: "none", cursor: "not-allowed" }
                      : {}
                  }
                >
                  <img src={helperIcon} alt="問小幫手" />
                </div>
              </div>

              <p className={styles.infoBoxDesc}>
                {currentQ.descriptionText ||
                  "請仔細觀看上方醫療說明影片，並依據您的實際感受與生活偏好做出選擇。"}
              </p>

              {/* 影片狀態 Tag */}
              {videoId &&
                (isVideoFinished ? (
                  <div
                    className={`${styles.videoStatusTag} ${styles.videoStatusFinished}`}
                  >
                    ✓ 狀態：本頁影片已完整觀看完畢
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsVideoFinished(true);
                      setViewedPages((prev) => new Set(prev).add(currentId));
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "8px 18px",
                      backgroundColor: "#e89abe",
                      color: "#fff",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    ✅ 我已看完影片，繼續填寫
                  </button>
                ))}
            </div>

            {/* 3. 題目 */}
            <h3
              className={styles.questionTitle}
              dangerouslySetInnerHTML={{
                __html: currentQ.question || currentQ.topic,
              }}
            />

            {/* 4. 選項群組 */}
            <div
              className={`${styles.optionsGroup} ${isLockedByVideoVisual ? styles.lockedBox : ""}`}
            >
              {currentQ.options?.map((opt, index) => {
                const isSMMatrix = currentId === "SM_B3_TREATMENT_MATRIX";
                const isFinished =
                  (isSMMatrix &&
                    viewedCases.has(
                      opt.nextId === "SM_CASE_1" ? "SM_CASE_1_RAD" : opt.nextId,
                    )) ||
                  (opt.nextId === "BCT_A1_OP" && completedRoutes.has("BCT")) ||
                  (opt.nextId === "SM_B1_OP" && completedRoutes.has("SM"));

                const isDisabledVideoLock = isLockedByVideoLogical;

                const isDisabledBusinessLock =
                  !isDev &&
                  ((isSMMatrix &&
                    opt.nextId === "SM_B6_FINISH" &&
                    !isAllCasesViewed) ||
                    (opt.nextId === "Q_APPEARANCE" && !isBothRoutesViewed));

                const isDisabled =
                  isDisabledVideoLock || isDisabledBusinessLock;

                return (
                  <OptionButton
                    key={`${currentId}-${index}`}
                    label={`${isFinished ? "✓ " : ""}${opt.label}`}
                    isSelected={answers[currentId] === opt.label}
                    isDisabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      setAnswers({ ...answers, [currentId]: opt.label });
                    }}
                    style={
                      isFinished
                        ? { borderColor: "#52c41a", color: "#52c41a" }
                        : {}
                    }
                  />
                );
              })}
            </div>
          </>
        )}

        {/* 🎯 貼心黏性下滑提示字條：滾動到底自動隱藏，絕不卡版面 */}
        {showScrollHint && !isConflictMode && (
          <div className="scroll-down-tip">下滑還有內容喔 👇</div>
        )}
      </div>

      {/* 5. 底部絕對固定操作列 */}
      {!isConflictMode && (
        <div className={styles.fixedActionFooter}>
          <Button variant="outline" onClick={handleBack} style={{ flex: 1 }}>
            {history.length === 0 ? "返回介紹" : "上一步"}
          </Button>

          <Button
            onClick={handleNext}
            style={{
              flex: 1,
              pointerEvents: "auto",
              ...(isLockedByVideoVisual
                ? {
                    opacity: 0.5,
                    filter: "grayscale(100%)",
                    cursor: "not-allowed",
                  }
                : {}),
            }}
          >
            {currentQ.isFinal ? "查看結果" : "下一步"}
          </Button>
        </div>
      )}

      {/* 🤖 滿版覆蓋式 Chatbot 容器 */}
      {isChatbotOpen && (
        <div className={styles.chatbotOverlayWindow} ref={chatbotRef}>
          {/* 頂部導覽列 */}
          <div className={styles.chatbotHeader}>
            <div className={styles.headerTitleZone}>
              <img src={helperIcon} alt="AI" className={styles.avatar} />
              <span>乳房外科小幫手</span>
            </div>
            <button
              className={styles.closeChatbotCross}
              onClick={() => setIsChatbotOpen(false)}
            >
              ✕ 結束詢問
            </button>
          </div>

          <div className={styles.warningBanner}>
            ⚠免責聲明：醫療資訊僅供衛教參考，我也無法替代您的醫師為您安排相關療程或診斷。有緊急狀況請立即就醫。
          </div>

          {/* 對話區 */}
          <div className={styles.chatBox} ref={scrollRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`${styles.messageWrapper} ${msg.role === "user" ? styles.userWrapper : styles.aiWrapper}`}
              >
                {msg.role === "assistant" && (
                  <img src={helperIcon} alt="AI" className={styles.avatar} />
                )}
                <div
                  className={styles.bubble}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
                <img src={helperIcon} alt="AI" className={styles.avatar} />
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* 底部輸入框 */}
          <div className={styles.inputArea}>
            <textarea
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="請輸入您的問題..."
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const trimmedInput = input.trim();
                  if (!isLoading && trimmedInput) {
                    e.target.blur();
                    handleSend(trimmedInput);
                    setTimeout(() => {
                      setInput("");
                      if (inputRef.current) inputRef.current.value = "";
                    }, 0);
                  }
                }
              }}
            />
            <button
              className={styles.askButton}
              onClick={() => handleSend(input.trim())}
              disabled={isLoading}
            >
              詢問
            </button>
          </div>

          <div className={styles.chatbotExitArea}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsChatbotOpen(false)}
            >
              結束詢問，返回繼續評估
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
