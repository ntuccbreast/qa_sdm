/**
 * 判定 BCT vs SM 價值觀衝突
 *
 * 衝突條件：患者重視保留乳房（Q_BREAST_IMAGE），
 * 但在旅程中表達對再次手術（BCT_A2_MARGIN_LN）或放療（BCT_A5_RADIATION）的顧慮。
 */
export const checkBctSmConflict = (latestAnswers) => {
  // 保留乳房很重要 → 傾向 BCT
  const wantsBreastPreservation =
    latestAnswers["Q_BREAST_IMAGE"]?.includes("很重要") ? 1 : 0;

  // BCT 旅程中：能接受再次手術？（含「可以接受」視為 OK）
  const canAcceptReop =
    latestAnswers["BCT_A2_MARGIN_LN"]?.includes("可以接受") ? 1 : 0;

  // BCT 旅程中：能接受放療安排？（含「可以接受」視為 OK）
  const canAcceptRadiation =
    latestAnswers["BCT_A5_RADIATION"]?.includes("可以接受") ? 1 : 0;

  // 衝突一：想保留外觀 但 不接受再次手術（BCT 必須承擔此風險）
  const reopConflict =
    wantsBreastPreservation === 1 && canAcceptReop === 0;

  // 衝突二：想保留外觀 但 不接受放療（BCT 侵襲性幾乎必做放療）
  const radConflict =
    wantsBreastPreservation === 1 && canAcceptRadiation === 0;

  return {
    hasConflict: reopConflict || radConflict,
    reopConflict,
    radConflict,
  };
};

/**
 * 根據終極抉擇產出最後結果，並附上每個步驟的答案摘要。
 */
export const getBctSmFinalResult = (ultimateChoice, latestAnswers) => {
  const isWantRecon =
    latestAnswers["Q_RECONSTRUCTION_FEEL"]?.includes("有意願");
  const reconSuffix = isWantRecon ? "合併重建" : "";

  // ── 建立選擇摘要 ──
  const summaryItems = [];

  const breastImportant = latestAnswers["Q_BREAST_IMAGE"];
  if (breastImportant) {
    summaryItems.push(
      breastImportant.includes("很重要")
        ? "✅ 保留乳房外觀對您來說<strong>很重要</strong>"
        : "➡️ 保留乳房外觀不是您最優先的考量"
    );
  }

  const reopAnswer = latestAnswers["BCT_A2_MARGIN_LN"];
  if (reopAnswer) {
    summaryItems.push(
      reopAnswer.includes("可以接受")
        ? "✅ 您<strong>能接受</strong>部分乳房切除後再次手術的可能性"
        : "⚠️ 您<strong>不想承擔</strong>再次手術的風險"
    );
  }

  const radAnswer = latestAnswers["BCT_A5_RADIATION"];
  if (radAnswer) {
    summaryItems.push(
      radAnswer.includes("可以接受")
        ? "✅ 您<strong>能接受</strong> 4～8 週的每日放療安排"
        : "⚠️ 放療安排讓您感到壓力，是您的<strong>顧慮之一</strong>"
    );
  }

  const smBreastAnswer = latestAnswers["SM_B1_OP"];
  if (smBreastAnswer) {
    summaryItems.push(
      smBreastAnswer.includes("能接受")
        ? "✅ 您<strong>能接受</strong>切除整個乳房（視需要可搭配重建）"
        : "⚠️ 切除整個乳房讓您感到困擾，乳房外觀對您<strong>很重要</strong>"
    );
  }

  if (isWantRecon !== undefined) {
    summaryItems.push(
      isWantRecon
        ? "✅ 您<strong>有意願</strong>考慮乳房重建（需自費）"
        : "➡️ 您目前不考慮重建"
    );
  }

  const summaryHtml =
    summaryItems.length > 0
      ? `<br/><p><strong>您的選擇摘要：</strong></p><ul style="text-align:left;padding-left:1.2em;line-height:2">${summaryItems.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "";

  if (ultimateChoice === "BCT") {
    return {
      type: "BCT",
      title: `最終建議：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `在權衡過後，您決定以盡可能<b>保留乳房外觀</b>為首要考量。這代表您願意承擔因邊緣不乾淨而需要再次手術的可能性，並配合放射線治療。${summaryHtml}`,
    };
  } else {
    return {
      type: "SM",
      title: `最終建議：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `在權衡過後，您決定以<b>治療過程的簡便</b>為首要考量。這代表您想避開因邊緣不乾淨而需要再次手術的可能性與放射線治療。${summaryHtml}`,
    };
  }
};
