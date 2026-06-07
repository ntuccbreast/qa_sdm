// src/constants/sdm.questions.js
// Question-flow data for each decision aid topic.
// question strings are HTML rendered via dangerouslySetInnerHTML.
// Hint bubble spans use class="hint-trigger pulsing-hint hint-icon" (no inline styles).
// Inline styles for layout/visual design belong in styles.css or *.module.css.

import hintImages from "./sdm.assets";

// ─────────────────────────────────────────────────────────────────────────────
// BCT vs SM  ―  complete path: journey simulation + values questionnaire
// ─────────────────────────────────────────────────────────────────────────────

export const questionsBctSm = [
  // 1. 體驗入口
  {
    id: "BCTSM_START",
    topic: "治療路徑模擬體驗",
    question:
      "在做決定前，讓我們分別模擬「部分乳房切除合併前哨淋巴結切片手術」與「全乳房切除合併前哨淋巴結切片手術」，您未來需要經歷的治療過程。這能幫助您更具體地感受兩者的差異。您想先體驗哪一個流程？",
    options: [
      {
        label: "體驗：部分乳房切除合併前哨淋巴結切片手術",
        nextId: "BCT_A1_OP",
      },
      { label: "體驗：全乳房切除合併前哨淋巴結切片手術", nextId: "SM_B1_OP" },
    ],
  },

  // --- 路線 A: BCT 旅程 ---
  {
    id: "BCT_A1_OP",
    topic: "BCT-第一步：手術內容",
    question:
      "<b>【部分乳房合併前哨淋巴結切片手術】</b><br/>此時，您也可以選擇是否同時進行「立即乳房重建手術」。<br/>您完成了手術，沒有發生合併症。醫護人員協助您預約 7~14 天後回診，評估傷口及檢視病理報告。",
    options: [
      {
        label:
          "先看第一種情況：病理報告顯示乳房安全邊緣足夠、淋巴結沒有轉移或輕微感染",
        nextId: "BCT_A2_MARGINLN_CHECK",
      },
    ],
  },

  {
    id: "BCT_A2_MARGINLN_CHECK",
    topic: "BCT-第二步：邊緣及淋巴結評估 (情境一)",
    question:
      "<b>【情況一：不需再次手術】</b><br/>如果病理結果顯示乳房邊緣足夠，前哨淋巴結沒有轉移或輕微感染，則不需再動手術切除更多乳房組織或淋巴結。",
    options: [
      {
        label:
          "再看另一種情況：病理報告顯示乳房安全邊緣太近、淋巴結有轉移或感染",
        nextId: "BCT_A2_2NDOP_YES",
      },
    ],
  },

  {
    id: "BCT_A2_2NDOP_YES",
    topic: "BCT-第二步：邊緣及淋巴結評估 (情境二)",
    question:
      "<b>【情況二：需要再次手術】</b><br/>若病理結果顯示乳房邊緣離惡性細胞太近，或淋巴結感染較嚴重，為了清除殘餘癌細胞，醫師會建議進行第二次手術，若是邊緣距離不夠，則會選擇再次進行「乳房組織更大範圍的切除」，可選擇部分乳房切除或全乳房切除。針對腋下淋巴結感染嚴重，則會進行「腋下淋巴廓清手術」以確盡量清除身上殘餘癌細胞。",
    options: [
      {
        label: "再次手術的傷口也癒合了，接下來醫師會評估後續治療",
        nextId: "BCT_A4_CHEMO_CHECK",
      },
    ],
  },

  {
    id: "BCT_A4_CHEMO_CHECK",
    topic: "BCT-第四步：化學藥物治療評估",
    question:
      "<b>【醫師評估治療方案】</b><br/>完成手術後，醫師會根據腫瘤的大小、細胞特性及淋巴結狀態，評估您是否需要接受「化學藥物治療」。治療的順序會因為是否需要化療而有所不同。",
    options: [
      { label: "先看第一種情況：需要化療", nextId: "BCT_A4_CHEMO_YES" },
    ],
  },

  {
    id: "BCT_A4_CHEMO_YES",
    topic: "BCT-第四步：需要化學治療的情況",
    videoUrl: "https://youtu.be/oxCrG5yD3t0?si=zJVfWei0wiG8ZfrR",
    question:
      "<b>【情況一：需要化療】</b><br/>如果醫師評估需接受化學藥物治療（療程約 3~6 個月），為了達到最佳效果，您必須<b>「先完成化療」</b>，化療結束間隔約 4 週讓身體修復後，才會進入放射線治療階段。",
    options: [
      { label: "再看另一種情況：不需要化療", nextId: "BCT_A4_CHEMO_NO" },
    ],
  },

  {
    id: "BCT_A4_CHEMO_NO",
    topic: "BCT-第四步：不需要化學治療的情況",
    question:
      "<b>【情況二：不需要化療】</b><br/>如果醫師評估您的腫瘤性質不需要接受化療，在手術傷口癒合後，您就可以<b>「直接開始」</b>放射線治療。",
    options: [{ label: "放射線治療 ± 荷爾蒙治療", nextId: "BCT_A5_RADIATION" }],
  },

  {
    id: "BCT_A5_RADIATION",
    topic: "BCT-第五步：放射線 ± 抗荷爾蒙治療",
    videoUrl: "https://youtu.be/YBSbYRUlY-8?si=rjeJfVBJws2XIGdV",
    question:
      "<b>【放射線治療】</b><br/>不論是否需要化療，部分乳房切除手術後幾乎都需要接受<b>放射線治療，</b>療程約 4~8 週。<br/><b>抗荷爾蒙藥物治療則視病理報告荷爾蒙受體結果而定：</b>療程約 5~10 年。",
    options: [{ label: "放射線治療結束之後", nextId: "BCT_A6_FOLLOWUP" }],
  },

  {
    id: "BCT_A6_FOLLOWUP",
    topic: "BCT-第六步：定期追蹤與重建評估",
    question:
      "<b>【定期追蹤與重建評估】</b><br/>完成主要治療後，您將進入定期回診追蹤階段。<b>如果您在第一步手術時沒有選擇「立即重建」</b>，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "完成部分乳房切除合併前哨淋巴結手術治療流程體驗",
        nextId: "BCT_A7_FINISH",
      },
    ],
  },

  {
    id: "BCT_A7_FINISH",
    topic: "BCT 旅程結束",
    question:
      "您已完整體驗了「部分乳房切除合併前哨淋巴結手術」的治療流程。您必須也體驗過「全乳房切除合併前哨淋巴結切片手術」流程後，才能開始價值觀評估。",
    options: [
      {
        label: "體驗「全乳房切除合併前哨淋巴結手術」的治療流程",
        nextId: "SM_B1_OP",
      },
      { label: "我已了解兩者差異，開始價值觀評估", nextId: "Q_APPEARANCE" },
    ],
  },

  // --- 路線 B: SM 旅程 ---
  {
    id: "SM_B1_OP",
    topic: "SM-第一步：手術內容",
    question:
      "<b>【全乳房切除合併前哨淋巴結切片手術】</b><br/>此時，您也可以選擇是否同時進行「立即乳房重建手術」。您完成了手術，沒有發生合併症，術後會有傷口引流管。醫護人員協助您預約 7~14 天後回診，評估是否可以拆線及拆除引流管，並檢視病理報告。",
    options: [
      {
        label: "先看第一種情況：病理報告顯示前哨淋巴結感染輕微或無轉移",
        nextId: "SM_B2_LN_NORMAL",
      },
    ],
  },

  {
    id: "SM_B2_LN_NORMAL",
    topic: "SM-第二步：淋巴結評估 (情境一)",
    question:
      "<b>【情況一：不需進一步淋巴廓清】</b><br/>如果病理結果顯示前哨淋巴結感染輕微或沒有轉移，就不需再動手術切除更多淋巴結。",
    options: [
      {
        label: "看另一種情況：病理報告顯示淋巴結感染顆數多",
        nextId: "SM_B2_LN_ALND",
      },
    ],
  },

  {
    id: "SM_B2_LN_ALND",
    topic: "SM-第二步：淋巴結評估 (情境二)",
    question:
      "<b>【情況二：需要進一步淋巴廓清】</b><br/>如果淋巴結感染狀況較嚴重，需進行「腋下淋巴廓清手術」以確保徹底清除殘餘的癌細胞。",
    options: [
      {
        label: "淋巴廓清手術的傷口也癒合了，接下來醫師會評估後續治療",
        nextId: "SM_B3_TREATMENT_MATRIX",
      },
    ],
  },

  {
    id: "SM_B3_TREATMENT_MATRIX",
    topic: "SM-第三步：後續治療的 4 種可能",
    question:
      "【手術後的輔助治療】<br/>為了讓您完整了解全乳房切除合併前哨淋巴結切片手術後，接下來可能面臨的治療，請依序點選以下不同種情況進行體驗。全部看完後，系統將會開啟最後的追蹤階段。",
    options: [
      { label: "情況一：要化療 + 要放療", nextId: "SM_CASE_1" },
      { label: "情況二：要化療 + 不用放療", nextId: "SM_CASE_2" },
      { label: "情況三：不用化療 + 要放療", nextId: "SM_CASE_3" },
      { label: "情況四：不用化療 + 不用放療", nextId: "SM_CASE_4" },
      {
        label: "我已看完四種不同情境，接下來呢？",
        nextId: "SM_B6_FINISH",
        isSecret: true,
      },
    ],
  },

  {
    id: "SM_CASE_1",
    topic: "情境 1：(化療 + 放療)的化療",
    videoUrl: "https://youtu.be/oxCrG5yD3t0",
    question:
      "情況❶：要化療 + 要放療<br/>治療路徑：手術 ⮕ 【化療】 ⮕ 放療 ⮕ 追蹤<br/><br/>您必須先完成 3~6 個月的化療，待身體修復約4週後，再接續6~8週的放療。",
    options: [
      { label: "化學藥物治療結束，也休息約4週了", nextId: "SM_CASE_1_RAD" },
    ],
  },
  {
    id: "SM_CASE_1_RAD",
    topic: "情境 1-2：(化療 + 放療)的放療",
    videoUrl: "https://youtu.be/7MiWDg5sa8Y?si=pqljIg5sGqQ-LI26",
    question:
      "情況❶：要化療 + 要放療<br/>治療路徑：手術 ⮕ 化療 ⮕【放療】⮕ 追蹤<br/><br/>在化療結束並休息約4週後，接著進行放射線治療(療程約 6~8 週)。<br/>全乳房切除後若腫瘤較大或有淋巴轉移風險，放療能進一步降低局部復發率。",
    options: [
      {
        label: "放射線治療結束",
        nextId: "SM_CASE_1_FOLLOWUP",
      },
    ],
  },
  {
    id: "SM_CASE_1_FOLLOWUP",
    topic: "情境 1-2：(化療 + 放療)的追蹤",
    question:
      "情況❶：要化療 + 要放療<br/>治療路徑：手術 ⮕ 化療 ⮕ 放療 ⮕【追蹤】<br/><br/>抗荷爾蒙藥物治療：視病理報告荷爾蒙受體結果而定，療程約 5~10 年。<br/>完成主要治療後，您將進入定期回診追蹤階段。<b>如果您在第一步手術時沒有選擇「立即重建」</b>，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "已了解情況一，回選單看其他情境",
        nextId: "SM_B3_TREATMENT_MATRIX",
      },
    ],
  },

  {
    id: "SM_CASE_2",
    topic: "情境 2：(要化療 + 不用放療)的化療",
    videoUrl: "https://youtu.be/oxCrG5yD3t0",
    question:
      "情況➋：要化療 + 不用放療<br/>治療路徑：手術 ⮕【化療】⮕ 追蹤<br/><br/>若腫瘤較小但特性需化療，則完成 3~6 個月化療後，不需放療，直接進入追蹤。",
    options: [
      {
        label: "化學藥物治療結束",
        nextId: "SM_CASE_2_FOLLOWUP",
      },
    ],
  },
  {
    id: "SM_CASE_2_FOLLOWUP",
    topic: "情境 2：(要化療 + 不用放療)的追蹤",
    question:
      "情況➋：要化療 + 不用放療<br/>治療路徑：手術 ⮕ 化療 ⮕【追蹤】<br/><br/>抗荷爾蒙藥物治療：視病理報告荷爾蒙受體結果而定，療程約 5~10 年。<br/>完成主要治療後，您將進入定期回診追蹤階段。<b>如果您在第一步手術時沒有選擇「立即重建」</b>，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "已了解情況二，回選單看其他情境",
        nextId: "SM_B3_TREATMENT_MATRIX",
      },
    ],
  },

  {
    id: "SM_CASE_3",
    topic: "情境 3：(不用化療 + 要放療)的放療",
    videoUrl: "https://youtu.be/7MiWDg5sa8Y",
    question:
      "情況➌：不用化療 + 要放療<br/>治療路徑：手術 ⮕【放療】⮕ 追蹤<br/><br/>全乳房切除後若腫瘤較大或有淋巴轉移風險，放療能進一步降低局部復發率。",
    options: [
      {
        label: "放射線治療結束",
        nextId: "SM_CASE_3_FOLLOWUP",
      },
    ],
  },
  {
    id: "SM_CASE_3_FOLLOWUP",
    topic: "情境 3-2：(不用化療 + 要放療)的追蹤",
    question:
      "情況➌：不用化療 + 要放療<br/>治療路徑：手術 ⮕ 放療 ⮕【追蹤】<br/><br/>抗荷爾蒙藥物治療：視病理報告荷爾蒙受體結果而定，療程約 5~10 年。<br/>完成主要治療後，您將進入定期回診追蹤階段。<b>如果您在第一步手術時沒有選擇「立即重建」</b>，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "已了解情況三，回選單看其他情境",
        nextId: "SM_B3_TREATMENT_MATRIX",
      },
    ],
  },

  {
    id: "SM_CASE_4",
    topic: "情境 4：不用化療 + 不用放療",
    question:
      "情況➍：不用化療 + 不用放療<br/>治療路徑：手術 ⮕【追蹤】<br/><br/>手術傷口癒合後，不需化療及放療，直接進入長期藥物控制與追蹤。<br/>抗荷爾蒙藥物治療：視病理報告荷爾蒙受體結果而定，療程約 5~10 年。<br/>完成主要治療後，您將進入定期回診追蹤階段。<b>如果您在第一步手術時沒有選擇「立即重建」</b>，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "已了解情況四，回選單看其他情境",
        nextId: "SM_B3_TREATMENT_MATRIX",
      },
    ],
  },

  {
    id: "SM_B5_FOLLOWUP",
    topic: "SM-第五步：定期追蹤與重建評估",
    question:
      "【定期追蹤與重建評估】<br/>抗荷爾蒙藥物治療：視病理報告荷爾蒙受體結果而定，療程約 5~10 年。<br/>完成主要治療後，您將進入定期回診追蹤階段。如果您在第一步手術時沒有選擇「立即重建」，而在治療結束後對乳房外觀有改變或不對稱的困擾，此時您可以與醫師討論是否進行「乳房重建手術」。",
    options: [
      {
        label: "體驗「部分乳房切除合併前哨淋巴結手術」的治療流程",
        nextId: "BCT_A1_OP",
      },
      {
        label: "完成全乳房切除合併前哨淋巴結切片手術治療流程體驗",
        nextId: "SM_B6_FINISH",
      },
    ],
  },
  {
    id: "SM_B6_FINISH",
    topic: "SM 旅程結束",
    question:
      "您已完整體驗了「全乳房切除合併前哨淋巴結手術」的治療流程。您必須也體驗過「部分乳房切除合併前哨淋巴結切片手術」流程後，才能開始價值觀評估。",
    options: [
      {
        label: "體驗「部分乳房切除合併前哨淋巴結手術」的治療流程",
        nextId: "BCT_A1_OP",
      },
      { label: "我已了解兩者差異，開始價值觀評估", nextId: "Q_APPEARANCE" },
    ],
  },

  // --- 第二階段：價值觀釐清問卷 ---
  {
    id: "Q_APPEARANCE",
    topic: "對乳房外觀在意程度",
    question:
      "對某些人來說，乳房外觀對於自我形象或日常穿著很重要；對某些人來說，健康與安心更優先。請問您的想法是：",
    options: [
      { label: "我覺得保留乳房外觀很重要", nextId: "Q_RECONSTRUCTION" },
      { label: "我覺得保留乳房外觀對我來說不重要", nextId: "Q_RECONSTRUCTION" },
    ],
  },
  {
    id: "Q_RECONSTRUCTION",
    topic: "對乳房重建的意願",
    videoUrl: "https://youtu.be/Fos0tafgQME?si=HkIAN0l_J18NeN8W",
    question:
      "不論部分或全切除，都可以考慮自費重建。有些人希望恢復外觀，有些人覺得沒關係。您的想法是：",
    options: [
      { label: "我有意願接受乳房重建(了解需自費)", nextId: "Q_REOPERATION" },
      { label: "我不考慮接受乳房重建", nextId: "Q_REOPERATION" },
    ],
  },
  {
    id: "Q_REOPERATION",
    topic: "接受再次手術可能性",
    question:
      "部分乳房切除術後可能會因為邊緣不夠，還需要再開一次刀，有些人可以接受，有些人會覺得壓力大。您的想法是：",
    options: [
      { label: "我可以接受需要再次手術的可能性", nextId: "Q_RADIATION_TIME" },
      { label: "我不想承擔還需要再次手術的可能性", nextId: "Q_RADIATION_TIME" },
    ],
  },
  {
    id: "Q_RADIATION_TIME",
    topic: "對放射線治療療程接受程度",
    videoUrl: "https://www.youtube.com/watch?v=Vh217ZogKwQ",
    linkText: " [影片：乳癌放射線治療要做多久？多久一次？]",
    question:
      "放療需要連續 6-8 週每天來醫院(週休二日)，這可能會影響工作或生活。您的想法是：",
    options: [
      {
        label: "我可以接受每天來醫院的排程",
        nextId: "Q_RADIATION_SIDE_EFFECT_SKIN",
      },
      {
        label: "我不想每天到醫院接受放療",
        nextId: "Q_RADIATION_SIDE_EFFECT_SKIN",
      },
    ],
  },
  {
    id: "Q_RADIATION_SIDE_EFFECT_SKIN",
    topic: "對放射線治療皮膚相關副作用接受程度",
    videoUrl: "https://youtu.be/qjMrVpc_mO4?si=OTrj8oxa3UlT50tJ",
    question: "放療可能導致皮膚紅腫、乾燥或疲倦，通常是暫時的。您的想法是：",
    options: [
      {
        label: "我可以接受可能出現的皮膚副作用",
        nextId: "Q_RADIATION_SIDE_EFFECT_HEARTLUNG",
      },
      {
        label: "我不想接受放療可能產生的皮膚副作用",
        nextId: "Q_RADIATION_SIDE_EFFECT_HEARTLUNG",
      },
    ],
  },
  {
    id: "Q_RADIATION_SIDE_EFFECT_HEARTLUNG",
    topic: "對放射線治療心肺相關副作用接受程度",
    videoUrl: "https://youtu.be/jETmg4JI2Pc?si=tskAoZIFBFtpADFp",
    question: "放療可能導致心肺相關副作用，通常是暫時的。您的想法是：",
    options: [
      { label: "我可以接受可能出現的心肺副作用", isFinal: true },
      { label: "我不想接受放療可能產生的心肺副作用", isFinal: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DCIS  ―  knowledge station + scenario simulation + values questions
// ─────────────────────────────────────────────────────────────────────────────

// Reusable hint span — no inline styles, styled entirely via .hint-icon in styles.css
const hint = (id) =>
  `<span class="hint-trigger pulsing-hint hint-icon" data-hint-id="${id}">💡</span>`;

export const questionsDCIS = [
  // ─── Act 0：破冰 ───
  {
    id: "DCIS_INTRO_WHAT",
    topic: "原位癌是什麼？",
    assistantScript: `
      您好，在我們開始評估之前，先讓我幫您了解一些重要的背景知識。
      乳房原位癌，是一種異常細胞只待在乳腺管裡面，還沒有跑出去的狀態。
      大多數的情況下，它不會跑到乳房以外的地方，所以通常不需要特別去檢驗淋巴結。
    `,
    question: `
      <p><strong>乳房原位癌</strong>是一種<strong>非侵襲性</strong>的細胞變化。</p>
      <br/>
      <p>異常細胞只存在於乳腺管內，尚未突破基底膜，也沒有侵犯周圍組織。</p>
      <br/>
      <p>因為大多數不會有腋下淋巴轉移情形，所以<strong>不一定需要進行淋巴結取樣</strong>。</p>
      <br/>
    `,
    options: [],
    nextId: "DCIS_INTRO_WHY_CANCER",
  },

  {
    id: "DCIS_INTRO_WHY_CANCER",
    topic: "為什麼切下來變乳癌？不是誤診！",
    assistantScript: `
      您可能會疑惑：明明診斷是原位癌，為什麼手術切下來之後，有時候會變成乳癌？
      這不是誤診，而是因為切片只取一小部分，有極少數機會，真正的癌細胞剛好躲在取樣以外的地方。
      這種情況大約佔 2 到 3%，也就是一百個人裡面大約有兩三個。
      正因為這個小小的可能性，才會有今天這個決策問題：要不要在第一次手術時，就順便把淋巴結也一起檢查？
    `,
    videoUrl: "",
    question: `
      <p>${hint("cnb_intro")}手術前的切片只取一小部分組織。有<strong>約 2～3%</strong> 的情況，完整切除後病理報告才發現有<strong>微小侵襲性癌細胞</strong>。</p>
      <br/>
      <p>${hint("slnb_reason")}這時診斷會從原位癌升級為乳癌，就需要額外進行<strong>前哨淋巴結切片</strong>，確認癌細胞是否已從乳房跑出去。</p>
      <br/>
      <p>這不是誤診——而是原本的切片無法預測的「隱藏風險」。</p>
      <br/>
      <p>正因為這個小小的不確定性，今天才有這個決策問題：要在第一次手術就一起做前哨淋巴結切片？還是等看過報告有變成乳癌再說？</p>
    `,
    hints: {
      cnb_intro: {
        type: "image",
        src: hintImages["cnb"],
        alt: "導引粗針切片原理",
      },
      slnb_reason: {
        type: "image",
        src: hintImages["slnb_reason"],
        alt: "為什麼要做前哨淋巴結切片",
      },
    },
    options: [],
    nextId: "DCIS_FLOWMAP",
  },

  // ─── Act 1：全局流程 ───
  {
    id: "DCIS_FLOWMAP",
    topic: "兩條路的全貌",
    assistantScript: `
      在我們深入每個細節之前，先讓您看看這兩條路長什麼樣子。
      路線一：先做部分乳房切除，等報告出來再決定要不要做淋巴切片。
      路線二：第一次手術就同時做部分乳房切除加前哨淋巴結切片。
      兩條路都有它的道理，接下來我會帶您了解幾個重要的知識點，再讓您體驗模擬情境。
    `,
    videoUrl: "",
    question: `
      <p>面對原位癌診斷，目前有<strong>兩種手術策略</strong>：</p>
      <br/>
      <p><strong>路線一｜先做部分乳房切除</strong><br/>等待病理報告（7～14 天），若升級為乳癌再安排前哨淋巴結切片手術。</p>
      <br/>
      <p><strong>路線二｜同時接受前哨淋巴結切片</strong><br/>第一次手術就一起做前哨淋巴結切片，不論報告結果如何都已處理完淋巴檢查。</p>
      <br/>
      <p>${hint("dcis_flowchart")}點此看治療的完整流程圖</p>
      <br/>
      <p>接下來，讓我先補充幾個重要知識，讓您更清楚每個選擇的意義。</p>
    `,
    hints: {
      dcis_flowchart: {
        type: "image",
        src: hintImages["dcis"],
        alt: "乳房原位癌治療路徑圖",
      },
    },
    options: [],
    nextId: "DCIS_KNOW_BCT_SIDE",
  },

  // ─── Act 2：知識補充站 ───
  {
    id: "DCIS_KNOW_BCT_SIDE",
    topic: "知識站 1／6：部分乳房切除的傷口與外觀影響",
    assistantScript: `
      第一個知識點：部分乳房切除對外觀的影響。
      部分乳房切除顧名思義，是只切掉腫瘤和周圍一小部分組織，保留大部分的乳房。
      但切除的位置和範圍，可能會造成乳房輕微變形或兩側不對稱。
      多數人外觀都在可接受範圍內，但如果有外觀上的困擾，之後也可以評估重建。
    `,
    videoUrl: "",
    question: `
      <p><strong>【部分乳房切除手術的外觀影響】</strong></p>
      <br/>
      <p>保留乳房手術只切除腫瘤及周圍少量組織，大部分乳房得以保留。</p>
      <br/>
      <p>
        可能的外觀改變：切除位置和範圍可能造成輕微凹陷或兩側不對稱。<br/>
        重建選項：若外觀困擾明顯，治療結束後可評估局部重建手術。
      </p>
      <br/>
      <p>多數人在治療完成後，外觀變化在<strong>可接受範圍內</strong>。</p>
    `,
    hints: {},
    options: [],
    nextId: "DCIS_KNOW_MARGIN",
  },
  {
    id: "DCIS_KNOW_MARGIN",
    topic: "知識站 2／6：什麼是安全邊緣？",
    assistantScript: `
      第二個知識點：安全邊緣。
      手術切除腫瘤之後，病理科醫師會在顯微鏡下看切下來的組織四周，
      確認最外圍有沒有留下足夠的正常組織，這一圈正常組織就叫做「安全邊緣」。
      如果邊緣太近，代表旁邊可能還有殘留的異常細胞，就需要再次手術把範圍切大一點。
      這跟淋巴結沒有關係，不管有沒有做淋巴切片，邊緣不夠就是要再開刀。
    `,
    videoUrl: "",
    question: `
      <p><strong>【安全邊緣】</strong></p>
      <br/>
      <p>${hint("surgical_margin")}切除腫瘤後，病理科會在顯微鏡下檢查組織四周是否有足夠的「正常組織緩衝帶」。</p>
      <br/>
      <p>
        <strong>邊緣足夠</strong>：代表腫瘤已完整切除，手術圓滿完成。<br/>
        <strong>邊緣不足</strong>：代表周圍可能仍有殘留細胞，需要<strong>再次手術</strong>擴大切除範圍。
      </p>
      <br/>
      <p>安全邊緣與淋巴切片是<strong>獨立的兩件事</strong>，不管有沒有做前哨淋巴結切片，邊緣不足就需要再開刀擴大切除範圍。</p>
    `,
    hints: {
      surgical_margin: {
        type: "image",
        src: hintImages["surgical_margin"],
        alt: "手術安全邊緣",
      },
    },
    options: [],
    nextId: "DCIS_KNOW_SLNB_WHAT",
  },

  {
    id: "DCIS_KNOW_SLNB_WHAT",
    topic: "知識站 3／6：前哨淋巴結是什麼？",
    assistantScript: `
      第三個知識點：前哨淋巴結。
      淋巴結是癌細胞跑出去的第一個站，而「前哨淋巴結」就是最靠近腫瘤的那一顆，
      也是最可能最先被侵犯的淋巴結。
      切片就是取出這顆淋巴結來做化驗，看看有沒有癌細胞在裡面。
    `,
    videoUrl: "",
    question: `
      <p><strong>【前哨淋巴結切片目的】</strong></p>
      <br/>
      <p>${hint("slnb_reason")}癌細胞若從乳房擴散出去，最常跑到腋下的淋巴結。</p>
      <p>「前哨淋巴結」又稱「哨兵淋巴結」，是最靠近腫瘤的前幾顆淋巴結，切片就是取這幾顆來化驗。</p>
      <br/>
      <p>
        <strong>前哨淋巴結沒有癌細胞</strong>：淋巴系統安全，不需要進一步清除。<br/>
        <strong>前哨淋巴結有癌細胞</strong>：代表可能已擴散，需評估是否清除更多淋巴結。
      </p><br/>
      <p>乳房原位癌因為不是乳癌，所以不需要進行前哨淋巴結切片，除非手術後最終診斷為乳癌才需要進行前哨淋巴結切片。</>
      <br/>
    `,
    hints: {
      slnb_reason: {
        type: "image",
        src: hintImages["slnb_reason"],
        alt: "為什麼要做前哨淋巴結切片",
      },
    },
    options: [],
    nextId: "DCIS_KNOW_SLNB_HOW",
  },

  {
    id: "DCIS_KNOW_SLNB_HOW",
    topic: "知識站 4／6：前哨淋巴結怎麼進行？",
    assistantScript: `
      第四個知識點：前哨淋巴結是怎麼進行的呢？
      為了在手術時精準找到這幾顆關鍵的淋巴結，手術前會先安排一個「定位攝影檢查」，大約需要 1 到 2 小時。
      檢查時會先敷麻藥，再注射少量的放射性同位素。
      手術中醫生會用儀器去偵測訊號，找出有反應的淋巴結取下來化驗。
      有時候如果訊號比較弱，醫生還會加用藍色染劑幫忙，所以術後尿液變成藍綠色是正常的，多喝水過一兩天就好了喔！
    `,
    videoUrl: "",
    question: `
      <p>【前哨淋巴結手術與檢查流程】</p>
      <br/>
      <p>${hint("lsg")}如果是安排<strong>「前哨淋巴結切片手術」</strong>的病人，為了幫助醫師在開刀時準確找到這幾顆代表性的淋巴結，我們會在手術前進行一項<strong>「前哨淋巴結定位攝影」</strong>的檢查。</p>
      <br/>
      <p>第一步：手術前的「定位攝影檢查」（約需 1-2 小時</p>
      <p>1. <strong>敷麻藥減輕不適</strong>：檢查前醫護人員會先在您的乳頭乳暈處敷上麻醉藥膏，幫忙降低疼痛與不舒服感。</p>
      <p>2. <strong>注射同位素</strong>：接著會從乳頭乳暈處注射少量的放射性同位素，這個同位素會順著淋巴循環流到前哨淋巴結。</p>
      <p>3. <strong>淋巴攝影定位</strong>：接著會幫您安排淋巴攝影，讓醫師看清楚同位素集中在哪一顆淋巴結，達到精準定位的效果。</p>
      <br/>
      <p>第二步：手術中的精準偵測</p>
      <p>開刀時，醫師會使用專用儀器去探測同位素的訊號，把有訊號反應的淋巴結取下來，送去病理化驗。</p>
      <br/>
      <p>如果手術當中同位素的訊號比較微弱，醫師會視情況額外使用一種<strong>「藍色染劑」</strong>來幫忙找到前哨淋巴結。</p>
      <p>這個藍色染劑最後會透過尿液代謝排出，所以手術後如果發現自己的尿液顏色變成「藍綠色」的，請千萬不要太緊張！這非常正常，只要適時、多補充水分，大約 1~2 天後尿液就會變回正常的顏色囉！</p>
      <br/>
    `,
    hints: {
      lsg: {
        type: "image",
        src: hintImages["lsg"],
        alt: "前哨淋巴結定位攝影流程",
      },
    },
    options: [],
    nextId: "DCIS_KNOW_SLNB_SIDE",
  },

  {
    id: "DCIS_KNOW_SLNB_SIDE",
    topic: "知識站 5／6：前哨淋巴結切片的副作用",
    assistantScript: `
      第五個知識點：前哨淋巴結切片可能帶來的副作用。
      最主要要了解的是淋巴水腫。手術切除淋巴結後，局部淋巴液的流動可能受影響，
      進而造成手臂腫脹。大約有 5% 的人在切片後會發生淋巴水腫。
      雖然並非每個人都會發生，但一旦發生就需要長期管理。
    `,
    videoUrl: "",
    question: `
      <p><strong>【前哨淋巴結切片的主要副作用：淋巴水腫】</strong></p>
      <br/>
      <p>{{yt:ybeI96rtA-Y}} 切除淋巴結後，淋巴液的流動可能受影響，造成手臂腫脹，稱為「淋巴水腫」。</p>
      <br/>
      <p>
        {{yt:exQV-q4rLXs}} 發生率約 <strong>5%</strong>，每 20 人中約有 1 人。<br/>
        可能在手術後數月甚至數年才出現。<br/>
        {{yt:GxVB0TRyzDw}} 一旦發生，需要<strong>長期持續管理</strong>，目前無法完全根治。
      </p>
      <br/>
      <p>其他較少見的副作用包括：手臂麻木感、局部疼痛、肩關節活動度下降。</p>
      <br/>
    `,
    hints: {},
    options: [],
    nextId: "DCIS_KNOW_SLNB_REHAB",
  },

  {
    id: "DCIS_KNOW_SLNB_REHAB",
    topic: "知識站 6／6：淋巴水腫怎麼預防與復健？",
    assistantScript: `
      第六個知識點：淋巴水腫的預防與復健。
      好消息是，雖然淋巴水腫無法完全避免，但做好日常管理可以大幅降低發生的風險。
      最重要的是術後復健運動，從手術後就可以開始做。
    `,
    videoUrl: "",
    question: `
      <p><strong>【淋巴水腫的預防與復健】</strong></p>
      <br/>
      <p>{{yt:UsR0itKP66Y}} 淋巴水腫雖無法完全根治，但<strong>積極的日常管理</strong>可以大幅降低風險與嚴重程度。</p>
      <br/>
      <p>
        術後復健運動：從術後早期開始。<br/>
        日常保護患側手臂：避免受傷、感染、高溫或過度使用。<br/>
        維持健康體重：肥胖是淋巴水腫的重要危險因子。
      </p>
      <br/>
    `,
    hints: {},
    options: [],
    nextId: "DCIS_Q1",
  },

  // ─── Act 3：情境模擬 ───
  {
    id: "DCIS_Q1",
    topic: "選擇手術方式",
    assistantScript: `
      好，現在您已經了解了所有重要的背景知識。
      讓我們進入情境模擬。
      請依照您現在的直覺，選擇您比較傾向的手術方式。
      這不是最終決定，只是幫助我們釐清您的價值觀跟想法。
    `,
    videoUrl: "",
    question: `
      <p>醫師向您說明了兩種手術方式，請依照您<strong>目前的直覺</strong>做初步選擇：</p>
      <br/>
      <p>這不是最終決定，選完後我會帶您體驗這條路上可能發生的事，幫助您更清楚自己的感受。</p>
    `,
    descriptionText:
      "請先依據目前的想法做選擇，不要擔心，這不是最後的決策建議，我會繼續引導您。",
    options: [
      {
        label: "我選擇：先做部分乳房切除，等報告再說",
        nextId: "DCIS_BCT_WAITING",
      },
      {
        label: "我選擇：部分乳房切除合併前哨淋巴結切片，一次完成",
        nextId: "DCIS_SLNB_WAITING",
      },
    ],
  },

  // ─── 路線 A：選了 BCT ───
  {
    id: "DCIS_BCT_WAITING",
    topic: "路線A：手術完成，等待報告",
    assistantScript: `
      您選擇了先做部分乳房切除。
      手術順利完成，沒有發生合併症。
      現在，您在等待病理報告。
      這段等待大約是 7 到 14 天。
      病理報告有三種可能的結果：
      最好的情況是原位癌、邊緣乾淨，手術就圓滿結束了。
      中間的情況是原位癌但邊緣不夠，需要再次切除乳房組織，但不需要做淋巴切片。
      最壞的情況是升級為惡性乳癌，這時候就需要再次手術做前哨淋巴結切片。
      現在，讓我們試想如果最壞的情況發生時，您的感受會是什麼。
    `,
    videoUrl: "",
    question: `
      <p>手術順利完成，沒有合併症。醫師為您預約了 <strong>7～14 天後</strong>的回診，檢視病理報告。</p>
      <br/>
      <p>病理報告有三種可能：</p>
      <br/>
      <p>
        ✅ 原位癌 + 安全邊緣足夠 → 手術圓滿完成<br/>
        ⚠️ 原位癌 + 安全邊緣不足 → 需再次切除乳房組織（不需做淋巴切片）<br/>
        ❌ 升級為惡性乳癌 → 需進一步接受前哨淋巴結切片
      </p>
      <br/>
      <p>接下來，我們要體驗<strong>最壞的情況</strong>：升級為惡性，需進一步接受前哨淋巴結切片，您的感受會是什麼？</p>
    `,
    options: [],
    nextId: "DCIS_BCT_WORST",
  },

  {
    id: "DCIS_BCT_WORST",
    topic: "路線A：最壞情況——升級為惡性",
    assistantScript: `
      回診的時候到了。醫師告訴您，病理報告顯示有侵襲性癌細胞，診斷從原位癌升級為乳癌。
      您需要再安排一次手術，進行前哨淋巴結切片，確認癌細胞是否已跑出乳房。
      您一開始選擇的是先做部分乳房切除，現在面對這個情況，您此刻的心情會是？
    `,
    videoUrl: "",
    question: `
      <p>病理報告出爐了。</p>
      <br/>
      <p>醫師說：「報告顯示乳房組織有侵襲性癌細胞，升級診斷為乳癌。我們需要再安排一次手術，進行前哨淋巴結切片，確認癌細胞是否已跑出乳房。」</p>
      <br/>
      <p>您一開始<strong>選擇了先做部分乳房切除，沒有同時做前哨淋巴結切片</strong>。</p>
      <br/>
      <p><strong>面對現在需要再次手術的情況，您此刻的心情是？</strong></p>
    `,
    options: [
      {
        label:
          "懊悔：早知道當初就應該同時選擇合併前哨淋巴結切片手術，現在還要再開一次",
        resultTitle: "建議方案：部分乳房切除合併前哨淋巴結切片手術",
        resultDescription: `
          根據您的感受，<strong>再次手術的焦慮與等待</strong>對您來說是比較難接受的。
          對您而言，<strong>一開始就選擇合併前哨淋巴結切片手術</strong>可能更適合——
          即使最終報告是原位癌，您也能接受淋巴切片帶來的副作用，換取不需要面對再一次手術。
        `,
        flowChart: hintImages["bct_slnb"],
      },
      {
        label: "可以接受：再開一次手術也沒關係，確認清楚比較重要",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription: `
          您屬於<strong>可以接受分階段決策</strong>的人。
          先做部分乳房切除，等報告確認是否升級成乳癌後再決定是否需要前哨淋巴結切片，
          對您而言，避免在原位癌的情況下做不必要的前哨淋巴結切片，比避免還要再一次手術更重要。
        `,
        flowChart: hintImages["dcis"],
      },
    ],
    isFinal: true,
  },

  // ─── 路線 B：選了 SLNB ───
  {
    id: "DCIS_SLNB_WAITING",
    topic: "路線B：手術完成，等待報告",
    assistantScript: `
      您選擇了部分乳房切除合併前哨淋巴結切片手術。
      手術順利完成，沒有發生合併症。
      現在，您在等待病理報告。
      這段等待大約是 7 到 14 天。
      病理報告有三種可能的結果：
      最好的情況是惡性乳癌、淋巴結正常、邊緣乾淨，手術就圓滿結束了。
      中間的情況是不論原位癌或乳癌，邊緣不夠，需要再次切除乳房組織。
      最壞的情況是報告顯示還是原位癌，這時候就代表前哨淋巴結切片其實不需要做。
      現在，讓我們體驗最壞的情況發生時，您的感受會是什麼。
    `,
    videoUrl: "",
    question: `
      <p>✅ 手術順利完成，沒有合併症。醫師為您預約了 <strong>7～14 天後</strong>的回診，檢視病理報告。</p>
      <br/>
      <p>病理報告有三種可能：</p>
      <br/>
      <p>
        ✅ 惡性乳癌 + 淋巴正常 + 安全邊緣足夠 → 手術圓滿完成<br/>
        ⚠️ 安全邊緣不足 → 不論是乳房原位癌或乳癌，都需再次切除乳房組織，取得足夠安全邊緣<br/>
        ❌ 原位癌 → 乳房原位癌本來就不需要接受前哨淋巴結切片，代表您承擔了不必要的手術及風險
      </p>
      <br/>
      <p>接下來，我們要體驗<strong>最壞的情況</strong>：報告是乳房原位癌，前哨淋巴結切片是多做的。您的感受會是什麼？</p>
    `,
    options: [],
    nextId: "DCIS_SLNB_WORST",
  },

  {
    id: "DCIS_SLNB_WORST",
    topic:
      "路線B：最壞情況是最終診斷還是乳房原位癌，沒有升級成乳癌，前哨淋巴結切片是多做的",
    assistantScript: `
      回診的時候到了。醫師告訴您，病理報告確認是乳房原位癌，並沒有升級成乳癌，而且邊緣乾淨，手術圓滿完成。
      代表您當初做的前哨淋巴結切片，其實是不需要做的處置。
      這也意味您承擔了前哨淋巴結切片帶來的風險，包括大約 5% 的淋巴水腫可能性。
      面對這個狀況，您此刻的心情會是？
    `,
    videoUrl: "",
    question: `
      <p>📋 <strong>病理報告出爐了。</strong></p>
      <br/>
      <p>醫師說：「報告確認是乳房原位癌，安全邊緣也足夠，手術非常成功！」</p>
      <br/>
      <p>但這也意味著，您當初選擇同時做的前哨淋巴結切片，<strong>其實是不需要的處置</strong>。</p>
      <br/>
      <p>您已承擔了前哨淋巴結切片帶來的風險（約 5% 的淋巴水腫可能性），而且這個風險現在看起來是不必要的。</p>
      <br/>
      <p><strong>面對需要承擔不必要的淋巴水腫等前哨淋巴結切片帶來的風險，您此刻的心情是？</strong></p>
    `,
    options: [
      {
        label:
          "可以接受：雖然多做了，但當時不確定，總是覺得做了比較安心，我願意為這個安心付出代價",
        resultTitle: "建議方案：部分乳房切除合併前哨淋巴結切片手術",
        resultDescription: `
          您的選擇顯示，您比較<strong>無法接受手術後不確定性帶來的焦慮</strong>。
          即使最終報告是乳房原位癌，您也認為同時完成前哨淋巴結切片帶來的安心感比起承擔前哨淋巴結切片帶來的風險更重要。
          對您而言，<strong>一次手術處理完，而不要懸著一個不確定的心等待病理報告</strong>是更適合您的選擇。
        `,
        flowChart: hintImages["bct_slnb"],
      },
      {
        label:
          "懊悔：早知道當初就先不要做淋巴切片，現在還要白白承擔可能會發生淋巴水腫的風險",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription: `
          您的選擇顯示，您對於<strong>不必要的處置帶來額外風險</strong>會感到後悔。
          最終報告如果是乳房原位癌，您認為承擔了不必要的前哨淋巴結切片帶來的風險。
          對您而言，<strong>先選擇部分乳房切除手術</strong>，是更適合您的選擇。等病理報告確認後，
          真的非要進行前哨淋巴結切片再說，這樣才能確保每一個處置都有它的必要性，而不用白白承擔原本可能可以避免的副作用。
        `,
        flowChart: hintImages["dcis"],
      },
    ],
    isFinal: true,
  },
];
