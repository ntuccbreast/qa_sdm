/**
 * 判定 BCT vs SM 價值觀衝突
 */
export const checkBctSmConflict = (latestAnswers) => {
  const A = latestAnswers["Q_APPEARANCE"]?.includes("很重要") ? 1 : 0;
  const C = latestAnswers["Q_REOPERATION"]?.includes("可以接受") ? 1 : 0;
  const D = latestAnswers["Q_RADIATION_TIME"]?.includes("可以接受") ? 1 : 0;
  const E = latestAnswers["Q_RADIATION_SIDE_EFFECT_SKIN"]?.includes("可以接受")
    ? 1
    : 0;
  const F = latestAnswers["Q_RADIATION_SIDE_EFFECT_HEARTLUNG"]?.includes(
    "可以接受"
  )
    ? 1
    : 0;

  const reopConflict = A === 1 && C === 0; // 要外觀但怕再開刀
  const radConflict = A === 1 && (D === 0 || E === 0 || F === 0); // 要外觀但怕放療

  return {
    hasConflict: reopConflict || radConflict,
    reopConflict,
    radConflict,
  };
};

/**
 * 根據終極抉擇產出最後結果
 */
export const getBctSmFinalResult = (ultimateChoice, latestAnswers) => {
  const isWantRecon = latestAnswers["Q_RECONSTRUCTION"]?.includes("有意願");
  const reconSuffix = isWantRecon ? "合併重建" : "";

  if (ultimateChoice === "BCT") {
    return {
      type: "BCT",
      title: `最終建議：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description:
        "在權衡過後，您決定以盡可能<b>保留乳房外觀</b>為首要考量。這代表您願意承擔因邊緣不乾淨而需要再次手術的可能性，並配合放射線治療。",
    };
  } else {
    return {
      type: "SM",
      title: `最終建議：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description:
        "在權衡過後，您決定以<b>治療過程的簡便</b>為首要考量。這代表您想避開因邊緣不乾淨而需要再次手術的可能性與放射線治療。",
    };
  }
};
