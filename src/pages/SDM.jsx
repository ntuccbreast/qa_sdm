// src/pages/SDM.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import styles from "../SDM.module.css";
import { topicDescriptions } from "../constants/sdm";

const SDM = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setHeroData, allAnswers } = useUI();

  const step = searchParams.get("step") || "SELECT";
  const selectedTopicId = searchParams.get("topic");

  const [tempSelectedTopic, setTempSelectedTopic] = useState(selectedTopicId || null);
  const [activeHint, setActiveHint] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [hintAtBottom, setHintAtBottom] = useState(false);
  const contentSectionRef = useRef(null);

  useEffect(() => {
    if (activeHint) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [activeHint]);

  const checkCanScroll = () => {
    const el = contentSectionRef.current;
    if (el) {
      const canScrollDown = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 15;
      setShowScrollHint(canScrollDown && !isAtBottom);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkCanScroll, 300);
    return () => clearTimeout(timer);
  }, [step, selectedTopicId]);

  // ✅ 交給 MainLayout 統一播放 TTS
  useEffect(() => {
    if (step === "SELECT" && !selectedTopicId) {
      setHeroData({
        description: `${allAnswers.userName || ""}您好，請選擇您想了解的乳癌治療決策輔助主題。`,
      });
    } else if (step === "INTRO" && selectedTopicId) {
      const topic = topicDescriptions[selectedTopicId];
      setHeroData({
        description: topic.audio || topic.content.replace(/<[^>]+>/g, ""),
      });
    }
  }, [step, selectedTopicId, allAnswers.userName, setHeroData]);

  const handleContentClick = (e) => {
    const trigger = e.target.closest(".hint-trigger");
    if (trigger) {
      const hintId = trigger.getAttribute("data-hint-id");
      const hintData = topicDescriptions[selectedTopicId]?.hints?.[hintId];
      if (hintData) setActiveHint(hintData);
    }
  };

  return (
    <div className={styles.wrapper}>
      <style>{`
        @keyframes hint-glow { 0%,100%{transform:scale(1);box-shadow:0 2px 6px rgba(244,162,180,0.4);opacity:0.85}50%{transform:scale(1.1);box-shadow:0 2px 12px rgba(244,162,180,0.7);opacity:1} }
        .pulsing-hint{animation:hint-glow 2s infinite ease-in-out}
        @keyframes bounce-down{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .scroll-down-tip{position:sticky;bottom:12px;left:0;right:0;margin:0 auto;width:max-content;background-color:rgba(244,162,180,0.95);color:white;padding:6px 14px;border-radius:20px;font-size:0.85rem;font-weight:bold;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:bounce-down 1.6s infinite ease-in-out;pointer-events:none;z-index:10}
      `}</style>

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
        <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",backgroundColor:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",zIndex:9999,padding:"16px",boxSizing:"border-box",display:"flex",justifyContent:"center",alignItems:"center" }}
          onClick={() => { setActiveHint(null); setHintAtBottom(false); }}
          onTouchMove={(e) => e.preventDefault()}>
          {/* No overflow:hidden on modal — it blocks touch-scroll on iOS inside position:fixed */}
          <div style={{ position:"relative",backgroundColor:"#fff",borderRadius:"20px",maxWidth:"750px",width:"100%",maxHeight:"88dvh",boxShadow:"0 12px 36px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Close button: absolutely positioned so it doesn't affect scroll area height */}
            <button onClick={() => { setActiveHint(null); setHintAtBottom(false); }}
              style={{ position:"absolute",top:"10px",right:"12px",zIndex:2,width:"32px",height:"32px",borderRadius:"50%",backgroundColor:"#f4a2b4",color:"#fff",border:"none",fontSize:"18px",fontWeight:"bold",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.15)",lineHeight:1 }}>✕</button>
            {/* Scroll area: onTouchMove stops propagation so backdrop's preventDefault doesn't block inner scroll */}
            <div style={{ overflowY:"scroll",WebkitOverflowScrolling:"touch",maxHeight:"88dvh",borderRadius:"20px",padding:"16px 16px 20px",paddingTop:"44px",boxSizing:"border-box",touchAction:"pan-y" }}
              onTouchMove={(e) => e.stopPropagation()}
              onScroll={(e) => { const el = e.currentTarget; setHintAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 8); }}>
              {activeHint.type === "image" && <img src={activeHint.src} alt={activeHint.alt || "說明圖片"} style={{ width:"100%",height:"auto",borderRadius:"12px",display:"block" }} />}
              {activeHint.type === "text" && <div><h3 style={{ marginTop:0,color:"#e91e63" }}>{activeHint.title}</h3><p style={{ color:"#333",lineHeight:"1.6",margin:0 }}>{activeHint.content}</p></div>}
            </div>
            {!hintAtBottom && (
              <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"64px",background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.97))",pointerEvents:"none",borderRadius:"0 0 20px 20px",display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:"8px" }}>
                <span style={{ fontSize:"1.1rem",color:"#ccc",lineHeight:1 }}>▾</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SDM;
