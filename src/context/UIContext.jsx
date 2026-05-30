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

  return (
    <UIContext.Provider
      value={{ heroData, setHeroData, allAnswers, setAllAnswers }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
