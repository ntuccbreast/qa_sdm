// src/data/dcs.js

/**
 * 16 題決策衝突量表 (Decisional Conflict Scale, DCS) 題目設定
 * 來源出處：AM O'Connor, Decisional Conflict Scale. 1993 (Chinese translation 2006).
 */
export const DCS_QUESTIONS = [
  { id: 1, text: "你是否知道你有哪些可選擇的方案？" },
  { id: 2, text: "你是否知道每個選擇方案的好處？" },
  { id: 3, text: "你是否知道每個選擇方案的風險及副作用？" },
  { id: 4, text: "你是否清楚哪些好處對你最緊要？" },
  { id: 5, text: "你是否清楚哪些風險及副作用對你最緊要？" },
  { id: 6, text: "你是否清楚哪些（好處還是風險、副作用）對你比較重要？" },
  { id: 7, text: "當作出這個選擇時，你是否有來自其他人足夠的支持？" },
  { id: 8, text: "你是否在不受其他人的壓力下作出這個選擇？" },
  { id: 9, text: "當作出這個選擇時，你是否有足夠的建議？" },
  { id: 10, text: "你是否清楚什麼選擇對你是最好的？" },
  { id: 11, text: "你是否肯定自己作出什麼選擇？" },
  { id: 12, text: "這個決定對你來說是否容易做？" },
  { id: 13, text: "你是否覺得你是在充分被告知所有相關資訊後才作的決定？" },
  { id: 14, text: "你的決定是否表示了什麼對你是重要的？" },
  { id: 15, text: "你是否預期你會堅持你的決定？" },
  { id: 16, text: "你是否滿意你的決定？" },
];

// DCS 量表標準計分選項 (0 = 最正向 / 充分知情，4 = 最負向 / 衝突高)
export const DCS_OPTIONS = [
  { label: "是", value: 0 },
  { label: "大概是", value: 1 },
  { label: "不肯定", value: 2 },
  { label: "大概不是", value: 3 },
  { label: "不是", value: 4 },
];

// 統一管理學術引用文字
export const DCS_CITATION = {
  title: "📋 決策衝突評估 (Decisional Conflict Scale)",
  source:
    "來源出處：AM O'Connor, Decisional Conflict Scale. 1993 (Chinese translation 2006). www.ohri.ca/decisionaid",
};
