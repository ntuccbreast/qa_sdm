import hintImages from "../../constants/sdm.assets";

/**
 * 判定 BCT vs SM 價值觀衝突
 *
 * 衝突條件：患者重視保留乳房（SM_B1_OP 第三選項），
 * 但在旅程中表達對再次手術（BCT_A2_MARGIN）、
 * 放療每日排程（BCT_A5_RADIATION）或放療副作用（BCT_A5_SIDEEFFECT）的顧慮。
 * 注意：排程與副作用是獨立的兩個軸，分開追蹤。
 */
export const checkBctSmConflict = (latestAnswers) => {
  // 外觀非常重要，希望保留原本乳房 → 傾向 BCT（答案記錄在 SM_B1_OP 的三選項問題）
  const wantsBreastPreservation = latestAnswers["SM_B1_OP"]?.includes(
    "非常重要",
  )
    ? 1
    : 0;

  // BCT 旅程中：能接受再次手術？
  const canAcceptReop = latestAnswers["BCT_A2_MARGIN"]?.includes("可以接受")
    ? 1
    : 0;

  // BCT 旅程中：能接受每日 4～8 週放療排程？（與副作用分開）
  const canAcceptRadSchedule = latestAnswers["BCT_A5_RADIATION"]?.includes(
    "可以接受",
  )
    ? 1
    : 0;

  // BCT 旅程中：能接受放療副作用（皮膚/心肺/疲倦）？
  const canAcceptRadSideEffect = latestAnswers["BCT_A5_SIDEEFFECT"]?.includes(
    "可以接受",
  )
    ? 1
    : 0;

  // 衝突一：想保留外觀 但 不接受再次手術
  const reopConflict = wantsBreastPreservation === 1 && canAcceptReop === 0;

  // 衝突二：想保留外觀 但 對放療排程有顧慮
  const radScheduleConflict =
    wantsBreastPreservation === 1 && canAcceptRadSchedule === 0;

  // 衝突三：想保留外觀 但 對放療副作用有顧慮
  const radSideEffectConflict =
    wantsBreastPreservation === 1 && canAcceptRadSideEffect === 0;

  // 合併放療衝突（向下相容）
  const radConflict = radScheduleConflict || radSideEffectConflict;

  return {
    hasConflict: reopConflict || radConflict,
    reopConflict,
    radConflict,
    radScheduleConflict,
    radSideEffectConflict,
  };
};

/**
 * 根據終極抉擇產出最後結果，並附上每個步驟的答案摘要。
 */
export const getBctSmFinalResult = (ultimateChoice, latestAnswers) => {
  const smAppearanceAnswer = latestAnswers["SM_B1_OP"];
  const isWantRecon = smAppearanceAnswer?.includes("有意願考慮重建");
  const reconSuffix = isWantRecon ? "合併重建" : "";

  // ── 重新推導衝突類型，用於敘事說明 ──
  const {
    reopConflict,
    radConflict,
    radScheduleConflict,
    radSideEffectConflict,
  } = checkBctSmConflict(latestAnswers);

  // Build specific radiation concern label(s)
  const radConcerns = [];
  if (radScheduleConflict) radConcerns.push("每天往返醫院的放療排程");
  if (radSideEffectConflict) radConcerns.push("放療帶來的副作用");
  const radConcernText = radConcerns.join("與");

  // ── 衝突敘事開場（A 勝過 B 的結構）──
  let narrativeHtml = "";
  let ttsText = "";
  if (ultimateChoice === "BCT") {
    const tradeoffParts = [];
    if (reopConflict) tradeoffParts.push("避免再次手術的風險");
    if (radConflict) tradeoffParts.push(`不用承受${radConcernText}`);
    const bSide = tradeoffParts.join("與");
    const burdens = [
      reopConflict && "因為安全邊緣不足需要再次手術的可能",
      radConflict && radConcernText,
    ]
      .filter(Boolean)
      .join("與");
    const narrative = `在衝突發生時，您似乎更在意<b>盡量保留乳房外觀</b>，多過於<b>${bSide}</b>，因此建議您選擇<b>部分乳房切除合併前哨淋巴結切片手術</b>。`;
    const tradeoffNote = burdens
      ? `這代表您要能願意承擔${burdens}，因為盡量保留乳房外觀對您而言是更重要的考量。`
      : "";
    narrativeHtml = `<p>${narrative}${tradeoffNote}</p><br/>`;
    ttsText = `${narrative.replace(/<b>|<\/b>/g, "")}${tradeoffNote}`;
  } else {
    let narrative = "";
    let note = "";
    if (reopConflict && radConflict) {
      narrative = `在衝突發生時，您似乎更在意<b>不想再次手術</b>，以及<b>不想承受${radConcernText}</b>，多過於<b>盡量保留乳房外觀</b>，因此建議您選擇<b>全乳房切除合併前哨淋巴結切片手術</b>。`;
      note =
        "全乳房切除可以確保邊緣乾淨，通常也無需搭配放射線治療，同時解決您的兩個顧慮。";
    } else if (reopConflict) {
      narrative = `在衝突發生時，您似乎更在意<b>不想承擔再次手術的風險</b>，多過於<b>盡量保留乳房外觀</b>，因此建議您選擇<b>全乳房切除合併前哨淋巴結切片手術</b>。`;
      note =
        "全乳房切除可以確保邊緣乾淨，讓您不必擔心因安全邊緣不足而再開一次刀。";
    } else {
      narrative = `在衝突發生時，您似乎更在意<b>不想承受${radConcernText}</b>，多過於<b>盡量保留乳房外觀</b>，因此建議您選擇<b>全乳房切除合併前哨淋巴結切片手術</b>。`;
      note = "全乳房切除後，通常不需要像部分切除後那樣必須搭配放射線治療。";
    }
    narrativeHtml = `<p>${narrative}${note}</p><br/>`;
    ttsText = `${narrative.replace(/<b>|<\/b>/g, "")}${note}`;
  }

  // ── 建立選擇摘要 ──
  const summaryItems = [];

  if (smAppearanceAnswer) {
    if (smAppearanceAnswer.includes("非常重要")) {
      summaryItems.push(
        "✅ 希望盡量保留<strong>原本的乳房外觀</strong>，對您來說非常重要",
      );
    } else if (smAppearanceAnswer.includes("有意願考慮重建")) {
      summaryItems.push(
        "✅ 能接受外觀改變，有意願考慮<strong>乳房重建</strong>（需自費）",
      );
    } else {
      summaryItems.push("✅ 能接受<strong>外觀平整</strong>，不考慮重建");
    }
  }

  const reopAnswer = latestAnswers["BCT_A2_MARGIN"];
  if (reopAnswer) {
    summaryItems.push(
      reopAnswer.includes("可以接受")
        ? "✅ 能接受<strong>邊緣不足再開一次刀</strong>的可能（約兩成機率）"
        : "⚠️ 不想承擔<strong>邊緣不足再開一次刀</strong>的可能",
    );
  }

  const radScheduleAnswer = latestAnswers["BCT_A5_RADIATION"];
  if (radScheduleAnswer) {
    summaryItems.push(
      radScheduleAnswer.includes("可以接受")
        ? "✅ 能接受<strong>每天到醫院的放療排程</strong>（4～8 週）"
        : "⚠️ <strong>每天往返的放療排程</strong>讓您感到壓力",
    );
  }

  const radSideEffectAnswer = latestAnswers["BCT_A5_SIDEEFFECT"];
  if (radSideEffectAnswer) {
    summaryItems.push(
      radSideEffectAnswer.includes("可以接受")
        ? "✅ 能接受<strong>放療的可能副作用</strong>（皮膚反應、心肺、疲倦）"
        : "⚠️ <strong>放療的副作用</strong>讓您感到顧慮",
    );
  }

  const summaryHtml =
    summaryItems.length > 0
      ? `<p><strong>您的選擇摘要：</strong></p><ul style="text-align:left;padding-left:1.2em;line-height:2">${summaryItems.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "";

  // Bridge sentence: explains WHY a conflict exists before showing the final suggestion
  let conflictBridgeHtml = "";
  if (reopConflict && radConflict) {
    conflictBridgeHtml = `<p style="color:#888;font-size:0.95rem;margin-top:12px">這些選擇之間出現了衝突，因為選擇部分乳房切除，就必須同時承擔因為安全邊緣不足需要再次手術的可能與放射線治療的療程。</p>`;
  } else if (reopConflict) {
    conflictBridgeHtml = `<p style="color:#888;font-size:0.95rem;margin-top:12px">這些選擇之間出現了衝突，因為選擇部分乳房切除，就必須承擔因為安全邊緣不足需要再次手術的可能。</p>`;
  } else if (radConflict) {
    conflictBridgeHtml = `<p style="color:#888;font-size:0.95rem;margin-top:12px">這些選擇之間出現了衝突，因為選擇部分乳房切除，就幾乎必須搭配放射線治療。</p>`;
  }

  if (ultimateChoice === "BCT") {
    return {
      type: "BCT",
      title: `最終建議：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `${summaryHtml}${conflictBridgeHtml}<br/>${narrativeHtml}`,
      flowChart: hintImages["bct_slnb"],
      ttsText,
    };
  } else {
    return {
      type: "SM",
      title: `最終建議：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description: `${summaryHtml}${conflictBridgeHtml}<br/>${narrativeHtml}`,
      flowChart: hintImages["sm_slnb"],
      ttsText,
    };
  }
};
