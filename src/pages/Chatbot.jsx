import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Button from "../components/common/Button";
import RatingComponent from "../components/common/Rating";
import styles from "../Chatbot.module.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const { allAnswers } = useUI();
  const [userRating, setUserRating] = useState(0);
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
  const prevMsgCount = useRef(messages.length);

  useEffect(() => {
    const currentCount = messages.length;
    const oldCount = prevMsgCount.current;
    prevMsgCount.current = currentCount;

    if (currentCount <= oldCount || currentCount <= 1) return;

    const lastMsg = messages[currentCount - 1];
    if (lastMsg.role === "user") {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
    } else {
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [messages.length]);

  const handleSend = async (manualInput = "") => {
    const currentInput = manualInput || input.trim();
    if (!currentInput || isLoading) return;

    setInput("");
    if (inputRef.current) inputRef.current.value = "";

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://web-production-fbb7b.up.railway.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: allAnswers.userName, question: currentInput, ui_language: "zh", rating: "" }),
      });
      const data = await response.json();
      if (data.answer) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "抱歉，系統連線失敗。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    if (userRating > 0) {
      fetch("https://web-production-fbb7b.up.railway.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: allAnswers.userName, question: "--- 使用者提交總結評分 ---", answer: "對話結束", rating: userRating }),
      }).catch((e) => console.error("評分失敗", e));
    }
    navigate("/selection");
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.phoneWrapper}>
        <div className={styles.warningBanner}>
          ⚠ 請注意：我無法查詢或安排個人的醫療事項(如門診預約、住院預約等)，也無法替代醫師診斷，我所提供的資訊僅供衛教參考，如果您有治療相關問題，或遇到緊急狀況請立即就醫。
        </div>

        <div className={styles.chatBox} ref={scrollRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`${styles.messageWrapper} ${msg.role === "user" ? styles.userWrapper : styles.aiWrapper}`}
            >
              {msg.role === "assistant" && (
                <img
                  src="https://web-production-fbb7b.up.railway.app/static/helperinside.png"
                  alt="AI"
                  className={styles.avatar}
                />
              )}
              <div className={styles.bubble} dangerouslySetInnerHTML={{ __html: msg.content }} />
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
              <img src="https://web-production-fbb7b.up.railway.app/static/helperinside.png" alt="AI" className={styles.avatar} />
              <div className={styles.typingIndicator}>
                <span></span><span></span><span></span>
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
                const trimmed = input.trim();
                if (!isLoading && trimmed) {
                  e.target.blur();
                  handleSend(trimmed);
                  setTimeout(() => { setInput(""); if (inputRef.current) inputRef.current.value = ""; }, 0);
                }
              }
            }}
          />
          <Button onClick={() => handleSend(input.trim())} disabled={isLoading}>詢問</Button>
        </div>

        {messages.length > 1 && (
          <div className={styles.ratingSection}>
            <RatingComponent value={userRating} onChange={setUserRating}>
              結束使用前，請先為這次的回覆進行評分
            </RatingComponent>
          </div>
        )}

        <div className={styles.exitSection}>
          <Button
            variant={messages.length <= 1 || userRating > 0 ? "outline" : "disabled"}
            fullWidth
            onClick={handleExit}
            style={{
              opacity: messages.length <= 1 || userRating > 0 ? 1 : 0.5,
              cursor: messages.length <= 1 || userRating > 0 ? "pointer" : "not-allowed",
            }}
          >
            {messages.length <= 1 ? "返回方案選擇" : userRating > 0 ? "結束詢問，返回方案選擇" : "結束詢問前請先進行評分"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
