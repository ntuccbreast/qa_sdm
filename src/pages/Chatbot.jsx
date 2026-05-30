import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Button from "../components/common/Button";
import RatingComponent from "../components/common/Rating";
import styles from "../Chatbot.module.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const { setHeroData, allAnswers } = useUI();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `${
        allAnswers.userName ? `${allAnswers.userName}，` : ""
      }您好！我是乳房外科小幫手。我可以為您提供住院資訊、傷口照護等衛教建議。請問今天有什麼可以幫您的嗎？`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef(null);
  // 🚀 關鍵：記錄上一次的訊息數量，防止非對話產生的重新渲染導致畫面跳動
  const prevMsgCount = useRef(messages.length);
  const isAutoScrolling = useRef(false);

  // 1. 同步 Hero 資訊 (僅執行一次)
  useEffect(() => {
    setHeroData({
      imageUrl:
        "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
      title: "衛教諮詢",
      description:
        "由 AI 技術驅動，提供乳房外科住院資訊，以及乳房治療相關的衛教、副作用處理、傷口照護。",
    });
  }, []);

  // 2. 智慧捲動邏輯
  useEffect(() => {
    const currentCount = messages.length;
    const oldCount = prevMsgCount.current;
    prevMsgCount.current = currentCount;

    // 更新計數器
    prevMsgCount.current = currentCount;

    // 🚀 核心邏輯：只有在訊息「真的變多」時才執行捲動
    // 這樣手動滑動頁面觸發重新渲染時，就不會執行捲動
    if (currentCount <= oldCount || currentCount <= 1) return;

    isAutoScrolling.current = true;

    const lastMsg = messages[currentCount - 1];

    if (lastMsg.role === "user") {
      // 使用者發問時，捲動到底部
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "auto",
      });
      isAutoScrolling.current = false;
    } else {
      // AI 回覆時，對齊到該則回覆的「頂部」
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [messages.length]);

  // 3. 處理發送訊息
  const handleSend = async (manualInput = "") => {
    const currentInput = manualInput || input.trim();
    if (!currentInput || isLoading) return;

    setInput("");
    if (inputRef.current) inputRef.current.value = "";

    const userMsg = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_URL = "https://web-production-fbb7b.up.railway.app/ask";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: allAnswers.userName,
          question: currentInput,
          ui_language: "zh",
          rating: "",
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

  const handleExit = () => {
    if (userRating > 0) {
      const API_URL = "https://web-production-fbb7b.up.railway.app/ask";
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: allAnswers.userName,
          question: "--- 使用者提交總結評分 ---",
          answer: "對話結束",
          rating: userRating,
        }),
      }).catch((e) => console.error("評分失敗", e));
    }
    navigate("/selection");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.warningBanner}>
          ⚠
          請注意：我無法查詢或安排個人的醫療事項(如門診預約、住院預約等)，也無法替代醫師診斷，我所提供的資訊僅供衛教參考，如果您有治療相關問題，或遇到緊急狀況請立即就醫。
        </div>

        <div className={styles.chatBox} ref={scrollRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`${styles.messageWrapper} ${
                msg.role === "user" ? styles.userWrapper : styles.aiWrapper
              }`}
            >
              {msg.role === "assistant" && (
                <img
                  src="https://web-production-fbb7b.up.railway.app/static/helperinside.png"
                  alt="AI"
                  className={styles.avatar}
                />
              )}
              <div
                className={styles.bubble}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
              <img
                src="https://web-production-fbb7b.up.railway.app/static/helperinside.png"
                alt="AI"
                className={styles.avatar}
              />
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入您的問題..."
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
          <Button onClick={() => handleSend(input.trim())} disabled={isLoading}>
            詢問
          </Button>
        </div>
      </div>

      <div className={styles.exitArea}>
        {messages.length > 1 && (
          <div className={styles.ratingBoxOuter}>
            <RatingComponent value={userRating} onChange={setUserRating}>
              結束使用前，請先為這次的回覆進行評分
            </RatingComponent>
          </div>
        )}
        <Button
          variant={
            messages.length <= 1 || userRating > 0 ? "outline" : "disabled"
          }
          fullWidth
          onClick={handleExit}
          style={{
            opacity: messages.length <= 1 || userRating > 0 ? 1 : 0.5,
            cursor:
              messages.length <= 1 || userRating > 0
                ? "pointer"
                : "not-allowed",
          }}
        >
          {messages.length <= 1
            ? "返回方案選擇"
            : userRating > 0
            ? "結束詢問，返回方案選擇"
            : "結束詢問前請先進行評分"}
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
