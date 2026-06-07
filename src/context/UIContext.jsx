// src/context/UIContext.jsx

import { createContext, useState, useContext } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [heroData, setHeroData] = useState({
    imageUrl:
      "https://web-production-fbb7b.up.railway.app/static/helperinside.png",
    title: "您好，我是乳房外科小幫手",
    description: "請填寫基本資料，再按下開始。",
  });

  const [allAnswers, setAllAnswers] = useState({
    userName: "",
    birthDate: "",
    selectedTopic: "",
    answers: {},
    result: "",
  });

  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  // true once the current page's TTS finishes — resets whenever a new speech starts
  const [hasSpeechEnded, setHasSpeechEnded] = useState(false);
  // controls the inline chatbot panel inside the Questionnaire page
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{
        heroData, setHeroData,
        allAnswers, setAllAnswers,
        isSpeechPlaying, setIsSpeechPlaying,
        hasSpeechEnded, setHasSpeechEnded,
        isChatbotOpen, setIsChatbotOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
