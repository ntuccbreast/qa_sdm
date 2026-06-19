/**
 * 判定 BCT vs SM 價值觀衝突
 *
 * 衝突條件：患者重視保留乳房（SM_B1_OP 第三選項），
 * 但在旅程中表達對再次手術（BCT_A2_MARGIN_LN）、
 * 放療每日排程（BCT_A5_RADIATION）或放療副作用（BCT_A5_SIDEEFFECT）的顧慮。
 * 注意：排程與副作用是獨立的兩個軸，分開追蹤。
 */
export const checkBctSmConflict = (latestAnswers) => {
  // 外觀非常重要，希望保留原本乳房 → 傾向 BCT（答案記錄在 SM_B1_OP 的三選項問題）
  const wantsBreastPreservation =
    latestAnswers["SM_B1_OP"]?.includes("非常重要") ? 1 : 0;

  // BCT 旅程中：能接受再次手術？
  const canAcceptReop =
    latestAnswers["BCT_A2_MARGIN_LN"]?.includes("可以接受") ? 1 : 0;

  // BCT 旅程中：能接受每日 4～8 週放療排程？（與副作用分開）
  const canAcceptRadSchedule =
    latestAnswers["BCT_A5_RADIATION"]?.includes("可以接受") ? 1 : 0;

  // BCT 旅程中：能接受放療副作用（皮膚/心肺/疲倦）？
  const canAcceptRadSideEffect =
    latestAnswers["BCT_A5_SIDEEFFECT"]?.includes("可以接受") ? 1 : 0;

  // 衝突一：想保留外觀 但 不接受再次手術
  const reopConflict =
    wantsBreastPreservation === 1 && canAcceptReop === 0;

  // 衝突二：想保留外觀 但 對放療有顧慮（排程或副作用任一）
  const radConflict =
    wantsBreastPreservation === 1 &&
    (canAcceptRadSchedule === 0 || canAcceptRadSideEffect === 0);

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
  const smAppearanceAnswer = latestAnswers["SM_B1_OP"];
  const isWantRecon = smAppearanceAnswer?.includes("有意願考慮重建");
  const reconSuffix = isWantRecon ? "合併重建" : "";

  // ── 建立選擇摘要 ──
  const summaryItems = [];

  // SM_B1_OP 三選項：外觀與重建偏好（合併原 BCT_A1_OP 外觀問題 + SM_B1_RECON_Q）
  if (smAppearanceAnswer) {
    if (smAppearanceAnswer.includes("非常重要")) {
      summaryItems.push("✅ 外觀對您來說<strong>非常重要</strong>，希望盡量保留原本的乳房");
    } else if (smAppearanceAnswer.includes("有意願考慮重建")) {
      summaryItems.push("✅ 您<strong>有意願</strong>考慮重建，能接受外觀改變（需自費）");
    } else {
      summaryItems.push("➡️ 您能接受<strong>外觀平整</strong>，不考慮重建");
    }
  }

  const reopAnswer = latestAnswers["BCT_A2_MARGIN_LN"];
  if (reopAnswer) {
    summaryItems.push(
      reopAnswer.includes("可以接受")
        ? "✅ 您<strong>能接受</strong>部分乳房切除後邊緣不足再開一次刀的風險（約兩成機率）"
        : "⚠️ 您<strong>不想承擔</strong>邊緣不足再開一次刀的風險"
    );
  }

  const radScheduleAnswer = latestAnswers["BCT_A5_RADIATION"];
  if (radScheduleAnswer) {
    summaryItems.push(
      radScheduleAnswer.includes("可以接受")
        ? "✅ 您<strong>能接受</strong> 4～8 週每天到醫院的放療排程"
        : "⚠️ 每天往返的放療排程讓您感到<strong>壓力</strong>"
    );
  }

  const radSideEffectAnswer = latestAnswers["BCT_A5_SIDEEFFECT"];
  if (radSideEffectAnswer) {
    summaryItems.push(
      radSideEffectAnswer.includes("可以接受")
        ? "✅ 您<strong>能接受</strong>放療的可能副作用（皮膚反應、心肺、疲倦）"
        : "⚠️ 放療的副作用讓您感到<strong>顧慮</strong>"
    );
  }

  const summaryHtml =
    summaryItems.length > 0
      ? `<p><strong>您的選擇摘要：</strong></p><ul style="text-align:left;padding-left:1.2em;line-height:2">${summaryItems.map((s) => `<li>${s}</li>`).join("")}</ul><br/>`
      : "";

  if (ultimateChoice === "BCT") {
    return {
      type: "BCT",
      title: `最終建議：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `${summaryHtml}在權衡過後，您決定以盡可能<b>保留乳房外觀</b>為首要考量。這代表您願意承擔因邊緣不乾淨而需要再次手術的可能性，並配合放射線治療。`,
    };
  } else {
    return {
      type: "SM",
      title: `最終建議：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `${summaryHtml}在權衡過後，您決定以<b>治療過程的簡便</b>為首要考量。這代表您想避開因邊緣不乾淨而需要再次手術的可能性與放射線治療。`,
    };
  }
};
