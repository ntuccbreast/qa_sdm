// src/pages/Questionnaire.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

const Questionnaire = () => {
  const { topicKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setHeroData, allAnswers, setAllAnswers, isChatbotOpen, setIsChatbotOpen, hasSpeechEnded, setHasSpeechEnded } = useUI();
  // snapshot is present when the user navigates back from the Result page
  const snapshot = location.state?.questionnaireSnapshot ?? null;

  // 🛠️ 核心宣告：自動偵測是否為本地開發環境 (localhost:3000)
  const isDev =
    window.location.hostname === "localhost" ||
    process.env.NODE_ENV === "development";

  const questionSet = useMemo(
    () => (topicKey === "dcis" ? questionsDCIS : questionsBctSm),
    [topicKey],
  );

  const [currentId, setCurrentId] = useState(() => snapshot?.currentId ?? questionSet[0].id);
  const [history, setHistory] = useState(() => snapshot?.history ?? []);
  const [answers, setAnswers] = useState(() => snapshot?.answers ?? {});
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  // Sets are serialised as arrays in router state — convert back on restore
  const [viewedPages, setViewedPages] = useState(() => new Set(snapshot?.viewedPages ?? []));
  const [viewedCases, setViewedCases] = useState(() => new Set(snapshot?.viewedCases ?? []));
  const [completedRoutes, setCompletedRoutes] = useState(() => new Set(snapshot?.completedRoutes ?? []));
  const [isConflictMode, setIsConflictMode] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [conflictChoice, setConflictChoice] = useState(null);

  // 🎯 新增：控制問卷頁面「下滑看更多」提示的狀態與 Ref
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollableContentRef = useRef(null);
  const hintBackdropRef = useRef(null);
  const hintScrollRef = useRef(null);

  // 🎯 新增：智慧偵測問卷內容是否過長且尚未滑到底
  const checkCanScroll = () => {
    const el = scrollableContentRef.current;
    if (el) {
      const canScrollDown = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 15;
      setShowScrollHint(canScrollDown && !isAtBottom);
    }
  };

  // 互動狀態控制 (Chatbot 專用) — isChatbotOpen/setIsChatbotOpen 由 UIContext 提供
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
  // 只在手機（有 touch 支援）才啟動，桌機讓 CSS height:100% 自己處理
  useEffect(() => {
    if (!isChatbotOpen) return;
    const isTouchDevice = navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      if (chatbotRef.current) {
        // Only adjust height — left/width are CSS-controlled inside phoneWrapper.
        // viewport.height shrinks when the keyboard opens on iOS.
        chatbotRef.current.style.height = `${viewport.height}px`;
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

  const currentQ = questionSet.find((q) => q.id === currentId);

  useEffect(() => {
    if (snapshot) {
      // Returning from Result — restore allAnswers to match the snapshot
      setAllAnswers((prev) => ({ ...prev, answers: snapshot.answers, selectedTopic: topicKey }));
    } else {
      // Fresh start — reset everything
      setAllAnswers((prev) => ({ ...prev, answers: {}, selectedTopic: topicKey }));
      setAnswers({});
      setHistory([]);
    }
    setIsChatbotOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🎯 當切換題目、或是切換衝突模式時，重新計算是否需要顯示下滑提示
  useEffect(() => {
    const timer = setTimeout(checkCanScroll, 300);
    return () => clearTimeout(timer);
  }, [currentId, isConflictMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // ✅ 把每題的 assistantScript 放進 description，讓 MainLayout 統一播放 TTS
    const scriptText = isConflictMode
      ? "請針對您的顧慮做出最後權衡。"
      : (currentQ?.assistantScript || currentQ?.descriptionText || "請詳閱說明再做出選擇或點擊下一步。");
    setHeroData({
      imageUrl:
        "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
      title: topicDescriptions[topicKey]?.label || "問卷評估",
      description: scriptText,
    });
  }, [currentId, isConflictMode, topicKey, currentQ, setHeroData]);



  useEffect(() => {
    const caseIds = ["SM_CASE_1_RAD", "SM_CASE_2", "SM_CASE_3", "SM_CASE_4"];
    if (caseIds.includes(currentId))
      setViewedCases((prev) => new Set(prev).add(currentId));
    if (currentId === "BCT_A7_FINISH")
      setCompletedRoutes((prev) => new Set(prev).add("BCT"));
    if (currentId === "SM_B5_FINISH")
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
          "SM_B5_FINISH",
        ];
        return qDef && qDef.options?.length >= 2 && !excludedIds.includes(id);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((id) => finalAnswers[id]);

    if (topicKey === "bctsm") {
      dataToSave.push(ultimateChoice || "無衝突");
    }

    navigate("/result", {
      state: {
        finalData: result,
        topicKey: topicKey,
        savedDataMap: dataToSave,
        chatHistory: messages,
        // Snapshot so Result's 上一步 can return to the exact question state
        questionnaireSnapshot: {
          currentId,
          history,
          answers: finalAnswers,
          viewedPages: [...viewedPages],
          viewedCases: [...viewedCases],
          completedRoutes: [...completedRoutes],
        },
      },
    });
  };

  const isLockedByVideoVisual = currentQ?.videoUrl && !isVideoFinished;
  const isLockedByVideoLogical = isLockedByVideoVisual && !isDev;
  const isLockedBySpeech = !hasSpeechEnded;

  // Inline shortcodes: {{yt:VIDEO_ID}} and {{ytkey:KEY}} → clickable YT icon
  // Hint bubbles: <span class="hint-trigger" data-hint-id="KEY"> → image/text modal
  const [ytModalVideoId, setYtModalVideoId] = useState(null);
  const [hintModalData, setHintModalData] = useState(null);
  const [hintAtBottom, setHintAtBottom] = useState(false);
  const [zoomedSrc, setZoomedSrc] = useState(null);

  // iOS-safe modal scroll lock — must be AFTER hintModalData useState.
  // Uses a non-passive native touchmove listener on the backdrop so e.preventDefault()
  // actually works on iOS. Checks e.target to allow scroll inside the modal container.
  // Does NOT set touchAction:none on body — that would block the modal scroll too.
  useEffect(() => {
    if (!hintModalData) return;
    document.body.style.overflow = "hidden";

    const backdrop = hintBackdropRef.current;
    const scrollEl = hintScrollRef.current;
    const preventOuterScroll = (e) => {
      if (scrollEl && scrollEl.contains(e.target)) return;
      e.preventDefault();
    };
    backdrop?.addEventListener("touchmove", preventOuterScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      backdrop?.removeEventListener("touchmove", preventOuterScroll);
    };
  }, [hintModalData]);

  const YT_ICON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#FF0000" style="vertical-align:middle;cursor:pointer;flex-shrink:0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;

  // Extract 11-char YouTube ID from either a bare ID or any YouTube URL form
  const extractYtId = (input = "") =>
    /^[a-zA-Z0-9_-]{11}$/.test(input)
      ? input
      : (input.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? "");

  // {{yt:ID}}       — embed raw YouTube ID directly
  // {{ytkey:KEY}}   — look up ID from question.videos[KEY].videoId (keeps URLs in data layer)
  const parseQuestion = (html = "", videos = {}) =>
    html
      .replace(/\{\{yt:([^}]+)\}\}/g, (_, raw) => {
        const id = extractYtId(raw);
        if (!id) return "";
        return `<span class="yt-inline-trigger" data-video-id="${id}" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;vertical-align:middle;">${YT_ICON_SVG}</span>`;
      })
      .replace(/\{\{ytkey:([^}]+)\}\}/g, (_, key) => {
        const vid = videos?.[key];
        const id = extractYtId(vid?.videoId ?? "");
        if (!id) return "";
        return `<span class="yt-inline-trigger" data-video-id="${id}" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;vertical-align:middle;">${YT_ICON_SVG}</span>`;
      });

  const handleQuestionClick = (e) => {
    const ytTrigger = e.target.closest(".yt-inline-trigger");
    if (ytTrigger) {
      const id = ytTrigger.getAttribute("data-video-id");
      if (id) setYtModalVideoId(id);
      return;
    }
    const hintTrigger = e.target.closest(".hint-trigger");
    if (hintTrigger) {
      const id = hintTrigger.getAttribute("data-hint-id");
      const hint = currentQ?.hints?.[id];
      if (hint) {
        if (hint.type === "image") setZoomedSrc(hint.src);
        else setHintModalData(hint);
      }
    }
  };

  const handleNext = () => {
    if (isLockedBySpeech) {
      return alert("請先聆聽完說明，再繼續下一步喔！");
    }
    if (isLockedByVideoVisual) {
      return alert("請完整觀看補充影片，才能進入下一步喔！");
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
    if (currentId.startsWith("DCIS_BCT_"))
      return { label: "目前選擇：部分乳房切除", color: "#ff7875" };
    if (currentId.startsWith("DCIS_SLNB_"))
      return { label: "目前選擇：部分切除合併前哨淋巴結切片", color: "#13c2c2" };
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
        .modal-scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(244, 162, 180, 0.95);
          color: white;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: bold;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 10px rgba(244, 162, 180, 0.5);
          animation: bounce-down 1.6s infinite ease-in-out;
          pointer-events: none;
        }
      `}</style>

      {/* ── 頂部固定：進度條與狀態 ── */}
      <div className={styles.stickyHeader}>
        <Stepper
          topicKey={topicKey}
          currentId={currentId}
          topic={currentQ?.topic ?? ""}
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

      {/* 主內容滾動區 */}
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
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ marginRight: "auto" }}>🛠️ <b>開發模式</b></span>
                <button
                  onClick={() => setHasSpeechEnded(true)}
                  style={{
                    background: hasSpeechEnded ? "#52c41a" : "#1890ff",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {hasSpeechEnded ? "✓ 語音已解鎖" : "跳過語音鎖定"}
                </button>
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



            {/* 1. 題目（含 {{yt:ID}} / {{ytkey:KEY}} shortcode 解析，以及 hint-trigger 點擊） */}
            <h3
              className={styles.questionTitle}
              onClick={handleQuestionClick}
              dangerouslySetInnerHTML={{
                __html: parseQuestion(currentQ.question || currentQ.topic, currentQ.videos),
              }}
            />

            {/* 3. 選項群組 */}
            <div className={`${styles.optionsGroup} ${isLockedByVideoVisual ? styles.lockedBox : ""}`}>
              {currentQ.options?.map((opt, index) => {
                const isFinished =
                  (opt.nextId === "BCT_A1_OP" && completedRoutes.has("BCT")) ||
                  (opt.nextId === "SM_B1_OP" && completedRoutes.has("SM"));

                const isDisabledVideoLock = isLockedByVideoLogical;
                const isDisabledBusinessLock =
                  !isDev &&
                  (opt.isFinal &&
                    (currentId === "BCT_A7_FINISH" || currentId === "SM_B5_FINISH") &&
                    !isBothRoutesViewed);
                const isDisabled = isDisabledVideoLock || isDisabledBusinessLock;

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
                    style={isFinished ? { borderColor: "#52c41a", color: "#52c41a" } : {}}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* 下滑提示 */}
        {showScrollHint && !isConflictMode && (
          <div className="scroll-down-tip">下滑還有內容喔 👇</div>
        )}
      </div>

      {/* 底部固定操作列 */}
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
              ...((isLockedByVideoVisual || isLockedBySpeech)
                ? { opacity: 0.5, filter: "grayscale(100%)", cursor: "not-allowed" }
                : {}),
            }}
          >
            {currentQ.isFinal ? "查看結果" : "下一步"}
          </Button>
        </div>
      )}

      {/* 💡 Hint Modal — 由 hint-trigger 觸發，顯示圖片或文字說明 */}
      {hintModalData && (
        <div
          ref={hintBackdropRef}
          style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",backgroundColor:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,padding:"16px",boxSizing:"border-box" }}
          onClick={() => { setHintModalData(null); setHintAtBottom(false); }}
        >
          <div style={{ position:"relative",maxWidth:"750px",width:"100%" }} onClick={(e) => e.stopPropagation()}>
            <div
              ref={hintScrollRef}
              style={{ backgroundColor:"#fff",borderRadius:"20px",maxHeight:"88dvh",overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",boxShadow:"0 12px 36px rgba(0,0,0,0.25)" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                setHintAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 8);
              }}
            >
              <div style={{ position:"sticky",top:0,display:"flex",justifyContent:"flex-end",padding:"10px 12px",backgroundColor:"#fff",borderRadius:"20px 20px 0 0",zIndex:1 }}>
                <button
                  onClick={() => { setHintModalData(null); setHintAtBottom(false); }}
                  style={{ width:"32px",height:"32px",borderRadius:"50%",backgroundColor:"#f4a2b4",color:"#fff",border:"none",fontSize:"18px",fontWeight:"bold",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.15)",lineHeight:1 }}
                >✕</button>
              </div>
              <div style={{ padding:"0 16px 20px" }}>
                {hintModalData.type === "image" && (
                  <div style={{ position:"relative",cursor:"zoom-in" }} onClick={() => setZoomedSrc(hintModalData.src)}>
                    <img
                      src={hintModalData.src}
                      alt={hintModalData.alt || "說明圖片"}
                      draggable={false}
                      style={{ width:"100%",height:"auto",borderRadius:"12px",display:"block",WebkitUserDrag:"none",userSelect:"none" }}
                    />
                    <div style={{ position:"absolute",bottom:"8px",right:"8px",background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:"8px",padding:"3px 8px",fontSize:"0.72rem",fontWeight:"bold",pointerEvents:"none",letterSpacing:"0.3px" }}>
                      點擊放大 🔍
                    </div>
                  </div>
                )}
                {hintModalData.type === "text" && (
                  <>
                    <h3 style={{ marginTop:0,color:"#e91e63" }}>{hintModalData.title}</h3>
                    <p style={{ color:"#333",lineHeight:"1.6",margin:0 }}>{hintModalData.content}</p>
                  </>
                )}
              </div>
            </div>
            {!hintAtBottom && (
              <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"80px",background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.97))",pointerEvents:"none",borderRadius:"0 0 20px 20px",display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:"12px" }}>
                <div className="modal-scroll-hint">下滑查看更多 ▾</div>
              </div>
            )}
          </div>
        </div>
      )}

      {zoomedSrc && (
        <div
          style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",background:"rgba(0,0,0,0.93)",zIndex:10001,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",boxSizing:"border-box",padding:"52px 12px 36px",touchAction:"pan-x pan-y pinch-zoom" }}
          onClick={() => setZoomedSrc(null)}
        >
          <button
            style={{ position:"fixed",top:"12px",right:"16px",width:"36px",height:"36px",borderRadius:"50%",background:"#f4a2b4",color:"#fff",border:"none",fontSize:"20px",fontWeight:"bold",cursor:"pointer",zIndex:10002,display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}
            onClick={(e) => { e.stopPropagation(); setZoomedSrc(null); }}
          >✕</button>
          <img
            src={zoomedSrc}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            style={{ display:"block",maxWidth:"100%",maxHeight:"calc(100dvh - 100px)",width:"auto",height:"auto",objectFit:"contain",WebkitUserDrag:"none",userSelect:"none",borderRadius:"8px",touchAction:"pan-x pan-y pinch-zoom" }}
          />
          <p style={{ textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.76rem",margin:"12px 0 0",letterSpacing:"0.3px",flexShrink:0 }}>點擊空白處關閉</p>
        </div>
      )}

      {/* YT 影片 Modal — fixed 蓋住全頁，由 {{yt:ID}} shortcode 觸發 */}
      {ytModalVideoId && (
        <div
          className={styles.ytModalOverlay}
          onClick={() => setYtModalVideoId(null)}
        >
          <div
            className={styles.ytModalWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.ytModalClose}
              onClick={() => setYtModalVideoId(null)}
            >✕</button>
            <div className={styles.ytModalContent}>
              {/* autoplay=0 avoids triggering YouTube's autoplay-block error */}
              <iframe
                className={styles.ytModalPlayer}
                src={`https://www.youtube-nocookie.com/embed/${ytModalVideoId}?rel=0&autoplay=0`}
                title="補充說明影片"
                frameBorder="0"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 🤖 Chatbot overlay — rendered via portal into phoneWrapper so it covers the video section too */}
      {isChatbotOpen && document.getElementById("questionnaire-chatbot-root") && createPortal(
        <div className={styles.chatbotOverlayWindow} ref={chatbotRef}>
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
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputPill}>
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
          </div>

          <div className={styles.chatbotExitArea}>
            <Button variant="outline" fullWidth onClick={() => setIsChatbotOpen(false)}>
              結束詢問，返回繼續評估
            </Button>
          </div>
        </div>,
        document.getElementById("questionnaire-chatbot-root")
      )}
    </div>
  );
};

export default Questionnaire;
