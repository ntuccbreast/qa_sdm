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
  const [zoomedSrc, setZoomedSrc] = useState(null);
  const contentSectionRef = useRef(null);
  const hintBackdropRef = useRef(null);
  const hintScrollRef = useRef(null);

  // iOS-safe modal scroll lock:
  // - body overflow:hidden prevents background scroll on most browsers
  // - A non-passive native touchmove listener on the backdrop calls preventDefault()
  //   UNLESS the touch target is inside the scroll container, so the modal can scroll.
  // (React's onTouchMove is passive → e.preventDefault() silently fails on iOS.)
  // (body touchAction:none blocks the modal's inner scroll too — so we don't use it.)
  useEffect(() => {
    if (!activeHint) return;
    document.body.style.overflow = "hidden";

    const backdrop = hintBackdropRef.current;
    const scrollEl = hintScrollRef.current;

    const preventOuterScroll = (e) => {
      if (scrollEl && scrollEl.contains(e.target)) return; // allow scroll inside modal
      e.preventDefault();
    };
    backdrop?.addEventListener("touchmove", preventOuterScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      backdrop?.removeEventListener("touchmove", preventOuterScroll);
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
        .modal-scroll-hint{display:inline-flex;align-items:center;gap:4px;background-color:rgba(244,162,180,0.95);color:white;padding:5px 14px;border-radius:20px;font-size:0.82rem;font-weight:bold;letter-spacing:0.3px;box-shadow:0 2px 10px rgba(244,162,180,0.5);animation:bounce-down 1.6s infinite ease-in-out;pointer-events:none}
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
        <div
          ref={hintBackdropRef}
          style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",backgroundColor:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",zIndex:9999,padding:"16px",boxSizing:"border-box",display:"flex",justifyContent:"center",alignItems:"center" }}
          onClick={() => { setActiveHint(null); setHintAtBottom(false); }}
        >
          {/* Wrapper: relative anchor for the gradient overlay */}
          <div style={{ position:"relative",maxWidth:"750px",width:"100%" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal = the scroll container itself. maxHeight+overflow-y:auto is all that's needed —
                no flex tricks. Short content: shrinks to fit. Tall content: caps at 88dvh and scrolls. */}
            <div
              ref={hintScrollRef}
              style={{ backgroundColor:"#fff",borderRadius:"20px",maxHeight:"88dvh",overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",boxShadow:"0 12px 36px rgba(0,0,0,0.25)" }}
              onScroll={(e) => { const el = e.currentTarget; setHintAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 8); }}
            >
              {/* Sticky header keeps the close button visible while scrolling */}
              <div style={{ position:"sticky",top:0,display:"flex",justifyContent:"flex-end",padding:"10px 12px",backgroundColor:"#fff",borderRadius:"20px 20px 0 0",zIndex:1 }}>
                <button
                  onClick={() => { setActiveHint(null); setHintAtBottom(false); }}
                  style={{ width:"32px",height:"32px",borderRadius:"50%",backgroundColor:"#f4a2b4",color:"#fff",border:"none",fontSize:"18px",fontWeight:"bold",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.15)",lineHeight:1 }}
                >✕</button>
              </div>
              <div style={{ padding:"0 16px 20px" }}>
                {activeHint.type === "image" && (
                  <div style={{ position:"relative",cursor:"zoom-in" }} onClick={() => setZoomedSrc(activeHint.src)}>
                    <img
                      src={activeHint.src}
                      alt={activeHint.alt || "說明圖片"}
                      draggable={false}
                      style={{ width:"100%",height:"auto",borderRadius:"12px",display:"block",WebkitUserDrag:"none",userSelect:"none" }}
                    />
                    <div style={{ position:"absolute",bottom:"8px",right:"8px",background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:"8px",padding:"3px 8px",fontSize:"0.72rem",fontWeight:"bold",pointerEvents:"none",letterSpacing:"0.3px" }}>
                      點擊放大 🔍
                    </div>
                  </div>
                )}
                {activeHint.type === "text" && (
                  <>
                    <h3 style={{ marginTop:0,color:"#e91e63" }}>{activeHint.title}</h3>
                    <p style={{ color:"#333",lineHeight:"1.6",margin:0 }}>{activeHint.content}</p>
                  </>
                )}
              </div>
            </div>
            {/* Gradient sits outside the scroll container so it doesn't scroll away */}
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
          style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",background:"rgba(0,0,0,0.93)",zIndex:10001,overflow:"auto",boxSizing:"border-box",padding:"52px 0 24px",touchAction:"pan-x pan-y pinch-zoom" }}
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
            style={{ display:"block",margin:"0 auto",width:"100%",maxWidth:"960px",height:"auto",padding:"0 12px",boxSizing:"border-box",WebkitUserDrag:"none",userSelect:"none",borderRadius:"8px",touchAction:"pan-x pan-y pinch-zoom" }}
          />
          <p style={{ textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.76rem",margin:"14px 0 0",letterSpacing:"0.3px" }}>點擊空白處關閉</p>
        </div>
      )}
    </div>
  );
};

export default SDM;
