// src/pages/SDM.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import styles from "../SDM.module.css";
import eveVideo from "../assets/eve_sdm_talk.mp4";
import { topicDescriptions } from "../constants/sdm";
import { useSpeech } from "../hooks/useSpeech";

const SDM = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();
  const videoRef = useRef(null);
  const { speak, cancel, pause, resume } = useSpeech();

  const step = searchParams.get("step") || "SELECT";
  const selectedTopicId = searchParams.get("topic");

  const [tempSelectedTopic, setTempSelectedTopic] = useState(selectedTopicId || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [activeHint, setActiveHint] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const contentSectionRef = useRef(null);
  const sentencesRef = useRef([]);

  const checkCanScroll = () => {
    const el = contentSectionRef.current;
    if (el) {
      const canScrollDown = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 15;
      setShowScrollHint(canScrollDown && !isAtBottom);
    }
  };

  const getSpeechText = () => {
    if (step === "SELECT" && !selectedTopicId) {
      return `${allAnswers.userName || "您"}您好，請選擇您想了解的乳癌治療決策輔助主題。`;
    } else if (step === "INTRO" && selectedTopicId) {
      const topic = topicDescriptions[selectedTopicId];
      return topic.audio || topic.content.replace(/<[^>]+>/g, "");
    }
    return "";
  };

  const buildSentences = (text) => {
    const arr = text.match(/[^。？！，、]+[。？！，、]?/g) || [text];
    let acc = 0;
    return arr.map((s) => { const start = acc; acc += s.length; return { text: s.trim(), start, end: acc }; });
  };

  const handleContentClick = (e) => {
    const trigger = e.target.closest(".hint-trigger");
    if (trigger) {
      const hintId = trigger.getAttribute("data-hint-id");
      const hintData = topicDescriptions[selectedTopicId]?.hints?.[hintId];
      if (hintData) setActiveHint(hintData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkCanScroll, 300);
    return () => clearTimeout(timer);
  }, [step, selectedTopicId]);

  useEffect(() => {
    setHeroData(null);
    cancel();
    setIsPlaying(false); setIsPaused(false); setCurrentSubtitle("");
    sentencesRef.current = buildSentences(getSpeechText());
    return () => { cancel(); if (videoRef.current) videoRef.current.pause(); };
  }, [step, selectedTopicId, allAnswers.userName, setHeroData]);

  const handleTogglePlay = (e) => {
    e?.stopPropagation();
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
      const text = getSpeechText();
      sentencesRef.current = buildSentences(text);
      speak({
        text,
        onStart: () => {
          setIsPlaying(true); setIsPaused(false);
          if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
        },
        onBoundary: (e) => {
          const active = sentencesRef.current.find((s) => e.charIndex >= s.start && e.charIndex < s.end);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" }}>
      <style>{`
        @keyframes hint-glow { 0%,100%{transform:scale(1);box-shadow:0 2px 6px rgba(244,162,180,0.4);opacity:0.85}50%{transform:scale(1.1);box-shadow:0 2px 12px rgba(244,162,180,0.7);opacity:1} }
        .pulsing-hint{animation:hint-glow 2s infinite ease-in-out}
        @keyframes bounce-down{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .scroll-down-tip{position:sticky;bottom:12px;left:0;right:0;margin:0 auto;width:max-content;background-color:rgba(244,162,180,0.95);color:white;padding:6px 14px;border-radius:20px;font-size:0.85rem;font-weight:bold;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:bounce-down 1.6s infinite ease-in-out;pointer-events:none;z-index:10}
      `}</style>

      <div className={styles.videoSection}>
        <video ref={videoRef} src={eveVideo} playsInline muted loop className={styles.theatreVideo} />
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

      <div ref={contentSectionRef} onScroll={checkCanScroll} className={styles.contentSection}>
        {step === "SELECT" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.keys(topicDescriptions).map((key) => (
              <Card key={key} title={topicDescriptions[key].label} description={topicDescriptions[key].description}
                isActive={tempSelectedTopic === key} onClick={() => setTempSelectedTopic(key)} />
            ))}
          </div>
        ) : (
          <div onClick={handleContentClick} dangerouslySetInnerHTML={{ __html: topicDescriptions[selectedTopicId]?.content }} />
        )}
        {showScrollHint && <div className="scroll-down-tip">下滑還有內容喔 👇</div>}
      </div>

      <div className={styles.buttonWrapper}>
        {step === "SELECT" ? (
          <>
            <Button onClick={() => { if (!tempSelectedTopic) alert("請先選擇一個主題"); else setSearchParams({ step: "INTRO", topic: tempSelectedTopic }); }} fullWidth>
              {tempSelectedTopic ? "確認選擇並查看詳情 ⮕" : "⬆ 請選擇上方主題"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/selection")} fullWidth>⬅ 返回方案選擇頁面</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate(`/questionnaire/${selectedTopicId}`)} fullWidth>開始評估諮詢 ⮕</Button>
            <Button variant="outline" onClick={() => { setTempSelectedTopic(null); setSearchParams({ step: "SELECT" }); }} fullWidth>⬅ 返回選擇主題</Button>
          </>
        )}
      </div>

      {activeHint && (
        <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,padding:"20px" }}
          onClick={() => setActiveHint(null)}>
          <div style={{ position:"relative",backgroundColor:"#fff",borderRadius:"20px",padding:"20px",maxWidth:"750px",width:"100%",boxShadow:"0 12px 36px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveHint(null)}
              style={{ position:"absolute",top:"-14px",right:"-14px",width:"34px",height:"34px",borderRadius:"50%",backgroundColor:"#f4a2b4",color:"#fff",border:"2px solid #fff",fontSize:"16px",fontWeight:"bold",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0 4px 10px rgba(0,0,0,0.15)" }}>✕</button>
            {activeHint.type === "image" && <img src={activeHint.src} alt={activeHint.alt || "說明圖片"} style={{ width:"100%",height:"auto",borderRadius:"12px",display:"block" }} />}
            {activeHint.type === "text" && <div style={{ padding:"8px" }}><h3 style={{ marginTop:0,color:"#e91e63" }}>{activeHint.title}</h3><p style={{ color:"#333",lineHeight:"1.6",margin:0 }}>{activeHint.content}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SDM;
