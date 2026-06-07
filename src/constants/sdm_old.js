// src/constants/sdm.js
import bctImage from "../assets/bct_slnb.png";
import smImage from "../assets/sm_slnb.png";
import dcisImage from "../assets/dcis.png";

// 1. 改用 Webpack 的 require.context 批量引入 src/assets/hints 底下的圖片
const context = require.context("../assets/hints", false, /\.(png|jpe?g|svg)$/);

const hintImages = {};
context.keys().forEach((path) => {
  // path 的格式會是 "./cnb.png"
  // 清除前面的 ./ 並切出主檔名（例如：./cnb.png -> cnb）
  const fileName = path.replace("./", "").split(".").shift();
  hintImages[fileName] = context(path);
});

// 💡 這時候自動產生的 hintImages 物件就會長這樣：
// { cnb: "/static/media/cnb.xxxxxx.png" }

const introText = `
您好，我是乳房外科小幫手。歡迎使用乳房手術方式輔助決策工具！
當您檢查發現異常鈣化、被診斷乳房原位癌或乳癌時，該選擇哪個治療處置可能讓人感到困惑。
我知道這是一個不容易的決定。請告訴我您的基本資料跟想了解的問題，我將一步一步陪您釐清，幫助您做出最適合自己的決定。
請注意：我的建議不能取代專業醫生的診斷和討論喔，只是提供您決策的資訊。
`;

const introAudioDCIS = `
您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。
當您被診斷為乳房導管內原位癌時，代表這是一種非侵襲性細胞分化，大多數不會有淋巴轉移的情形，因此不一定需要進行淋巴結取樣。
但有少於2~3%的極少數情況，會在手術後病理結果發現癌細胞，在這個狀況下，就需要進一步針對前哨淋巴結取樣切片，以確定癌細胞沒有擴散到淋巴結。
那麼，當您被診斷為乳房原位癌後，可能正在思考：「我到底會不會是那2~3%的人？應該一開始選擇只先做部分乳房切除就好，還是要在同一次手術當中也一起進行前哨淋巴結切片？
這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。
填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。
評估的過程中，如果有問題，可以隨時點擊有我頭像的圓形按鈕，我會隨時回答您喔！
準備好了嗎？那我們就一起開始吧！
`;

const introTextDCIS = `
<p><strong>乳房原位癌並不是乳癌，是一種非侵襲性細胞分化，大多數不會有腋下淋巴轉移情形，因此不用取淋巴結化驗。</p><br />
<p>  
<span class="hint-trigger pulsing-hint" data-hint-id="cnb_intro" style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin-right: 1px; margin-bottom: 1px; width: 16px; height: 16px; background: linear-gradient(135deg, #fff5f7, #ffe3e8); border: 1px solid #f4a2b4; border-radius: 50%; font-size: 0.75rem; line-height: 0; vertical-align: 2px; box-shadow: 0 2px 5px rgba(244, 162, 180, 0.3);">💡</span>
但有少於2~3%的情況，手術後檢體中才發現有癌細胞存在，診斷就會從一開始的乳房原位癌變為乳癌。
</p><br />
<p>
<span class="hint-trigger pulsing-hint" data-hint-id="slnb_intro" style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin-right: 1px; margin-bottom: 1px; width: 16px; height: 16px; background: linear-gradient(135deg, #fff5f7, #ffe3e8); border: 1px solid #f4a2b4; border-radius: 50%; font-size: 0.75rem; line-height: 0; vertical-align: 2px; box-shadow: 0 2px 5px rgba(244, 162, 180, 0.3);">💡</span>
一旦診斷是乳癌，就必須取淋巴結化驗，為的是要看癌細胞是否有擴散到淋巴結。
</p><br />
<p>閱讀的過程中，如果有出現閃爍燈泡，可以點擊看更多資訊！</p><br />
<p>評估的過程中，如果有問題，可以隨時點擊有我頭像的圓形按鈕，我會隨時回答您喔！</p>
`;

const introAudioBctSm = `
您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。
當您被診斷為乳房原位癌或乳癌後，可能正在思考：「我應該選擇部分乳房切除合併前哨淋巴結切片，還是全乳房切除合併前哨淋巴結切片？
請了解，不管接受部分乳房切除或是全乳房切除，是否需要後續藥物治療，主要是根據癌細胞的特性與期別來決定。<strong>並非全乳房切除後就不用接受後續追蹤及治療
另外，如果是診斷乳癌，不管選擇乳房部分切除，或乳房全切除，都一定需要同時進行淋巴結切片。
這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。
填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。
評估的過程中，如果有問題，可以隨時點擊有我頭像的圓形按鈕，我會隨時回答您喔！
準備好了嗎？那我們就一起開始吧！
`;

const introTextBctSm = ``;

const introTextSTVAB = `
<p>您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。</p>
<p>當您在乳房攝影發現有鈣化後，可能正在思考：「<strong>我應該選擇乳房立體定位微創切片，還是傳統的細針定位取樣？</strong>」。</p>
<p>這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。</p>
<p>填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。</p>
<p>準備好了嗎？那我們就一起開始吧！</p>
`;

const introTextReconstruction = `
<p>您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。</p>
<p>當您被診斷為<strong>乳房導管內原位癌 (DCIS; Ductal Carcinoma In Situ)</strong>時，代表異常細胞只存在於乳腺管內]，尚未突破基底膜，也沒有侵犯到周圍的乳房組織或其他器官。這是一種<strong>非侵襲性乳癌</strong>，也常被稱為<strong>第 0 期乳癌</strong>。</p>
<p>診斷通常是靠乳房穿刺切片或乳房切除後的病理化驗。有極少數情況(<2–3%)會在第二次手術後病理結果發現<strong>微小侵襲癌(microinvasion)或少量癌細胞</strong>，在這些情況下，就需要進一步針對淋巴結取樣，以確定癌細胞沒有擴散到淋巴結。</p>
<p>不過，如果第二次手術後病理結果還是原位癌，則大多數不會有淋巴轉移的情形，因此不一定需要進行淋巴結取樣。</p>
<p>那麼，當您被診斷為乳房原位癌後，可能正在思考：「<strong>我應該選擇部分乳房切除就好，還是要在同一次手術當中一起進行前哨淋巴切片？</strong>」。</p>
<p>這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。</p>
<p>填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。</p>
<p>準備好了嗎？那我們就一起開始吧！</p>
`;

const topicDescriptions = {
  dcis: {
    label: "先選擇只接受部分乳房切除手術，還是要一起接受前哨淋巴結切片？",
    description: "適用於診斷為乳房原位癌的病人。",
    content: introTextDCIS,
    hints: {
      cnb_intro: {
        type: "image", // 類型：可以是 image 或 text (保留未來擴充彈性)
        src: hintImages["cnb"], // 對應上面 import 的圖片變數
        alt: "導引粗針切片原理",
      },
      /*slnb_intro: {
        type: "text",
        title: "什麼是淋巴結化驗？",
        content: "這裡可以放純文字的詳細醫療科普解說...",
      },*/
      slnb_intro: {
        type: "image",
        src: hintImages["slnb"],
        alt: "前哨淋巴結切片目的",
      },
    },
    audio: introAudioDCIS,
  },
  bctsm: {
    label:
      "部分乳房切除合併前哨淋巴結切片手術，還是全乳房切除合併前哨淋巴結切片手除？",
    description: "適用於診斷為乳房原位癌或乳癌的病人。",
    content: introTextBctSm,
    audio: introAudioBctSm,
  },
  /*stvab: {
    // 新增一個模擬主題
    label: "乳房微創手術，還是傳統手術？",
    description: "適用於乳房良性腫瘤或有疑似鈣化點的病人。",
    content: introTextSTVAB,
  },
  reconstruction: {
    // 新增一個模擬主題
    label: "要在乳房切除當下，還是等治療追蹤穩定後再進行重建？",
    description: "適用於乳房切除後希望進行乳房重建的病人。",
    content: introTextReconstruction,
  },*/
};

// --- BCT vs SM 完整路徑：模擬體驗 + 價值觀問卷 ---
const questionsBctSm = [
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
      }, // 補上 _OP
      { label: "體驗：全乳房切除合併前哨淋巴結切片手術", nextId: "SM_B1_OP" },
    ],
  },

  // --- 路線 A: BCT 旅程 ---
  // 第一步：手術
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

  // 第二步 (情境一)：不需再次手術
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

  // 第二步 (情境二)：需要進一步廓清
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

  // 第四步-1：醫師評估是否化療
  {
    id: "BCT_A4_CHEMO_CHECK",
    topic: "BCT-第四步：化學藥物治療評估",
    question:
      "<b>【醫師評估治療方案】</b><br/>完成手術後，醫師會根據腫瘤的大小、細胞特性及淋巴結狀態，評估您是否需要接受「化學藥物治療」。治療的順序會因為是否需要化療而有所不同。",
    options: [
      { label: "先看第一種情況：需要化療", nextId: "BCT_A4_CHEMO_YES" },
    ],
  },

  // 第四步-2：需要化療的情境 (順序：手術 -> 化療 -> 放療)
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

  // 第四步-3：不需要化療的情境 (順序：手術 -> 放療)
  {
    id: "BCT_A4_CHEMO_NO",
    topic: "BCT-第四步：不需要化學治療的情況",
    question:
      "<b>【情況二：不需要化療】</b><br/>如果醫師評估您的腫瘤性質不需要接受化療，在手術傷口癒合後，您就可以<b>「直接開始」</b>放射線治療。",
    options: [{ label: "放射線治療 ± 荷爾蒙治療", nextId: "BCT_A5_RADIATION" }],
  },

  // 第五步：放射線與荷爾蒙治療
  {
    id: "BCT_A5_RADIATION",
    topic: "BCT-第五步：放射線 ± 抗荷爾蒙治療",
    videoUrl: "https://youtu.be/YBSbYRUlY-8?si=rjeJfVBJws2XIGdV",
    question:
      "<b>【放射線治療】</b><br/>不論是否需要化療，部分乳房切除手術後幾乎都需要接受<b>放射線治療，</b>療程約 4~8 週。<br/><b>抗荷爾蒙藥物治療則視病理報告荷爾蒙受體結果而定：</b>療程約 5~10 年。",
    options: [{ label: "放射線治療結束之後", nextId: "BCT_A6_FOLLOWUP" }],
  },

  // 第六步：定期追蹤與延遲重建 (根據您的需求增加)
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

  // 結尾：引導至下一個流程
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
  // --- 路線 B: SM 旅程 (全線性引導：強迫看完全部情境) ---

  // 第一步：手術執行
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

  // 第二步 (情境一)：淋巴結不需廓清
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

  // 第二步 (情境二)：淋巴結需要廓清
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

  // 第三步：核心矩陣 (重點優化：一次列出 4 種可能，讓病人點選想看的)
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
      // 關鍵：這個選項在 Questionnaire.jsx 渲染時，
      // 必須判斷 isAllCasesViewed 為 true 才能顯示，或是設為隱藏
      {
        label: "我已看完四種不同情境，接下來呢？",
        nextId: "SM_B6_FINISH",
        isSecret: true,
      },
    ],
  },

  // --- 4 種 CASE 的詳細說明 ---

  {
    id: "SM_CASE_1",
    topic: "情境 1：(化療 + 放療)的化療",
    videoUrl: "https://youtu.be/oxCrG5yD3t0", // 化療影片
    question:
      "情況❶：要化療 + 要放療<br/>治療路徑：手術 ⮕ 【化療】 ⮕ 放療 ⮕ 追蹤<br/><br/>您必須先完成 3~6 個月的化療，待身體修復約4週後，再接續6~8週的放療。",
    options: [
      { label: "化學藥物治療結束，也休息約4週了", nextId: "SM_CASE_1_RAD" },
    ],
  },
  {
    id: "SM_CASE_1_RAD",
    topic: "情境 1-2：(化療 + 放療)的放療",
    videoUrl: "https://youtu.be/7MiWDg5sa8Y?si=pqljIg5sGqQ-LI26", // 放療影片
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
    topic: "情境 1-2：(化療 + 放療)的追蹤",
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

  // 第五步：定期追蹤 (固定結尾)
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

  // --- 第二階段：價值觀釐清問卷 (正式評分題) ---
  {
    id: "Q_APPEARANCE",
    topic: "對乳房外觀在意程度",
    question:
      "對某些人來說，乳房外觀對於自我形象或日常穿著很重要；對某些人來說，健康與安心更優先。請問您的想法是：",
    options: [
      {
        label: "我覺得保留乳房外觀很重要",
        nextId: "Q_RECONSTRUCTION",
      },
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
      {
        label: "我可以接受可能出現的心肺副作用",
        isFinal: true,
      },
      {
        label: "我不想接受放療可能產生的心肺副作用",
        isFinal: true,
      },
    ],
  },
];

const getBctSmResult = (finalAnswers) => {
  // 1. 抓取關鍵變數
  const isAppearanceImportant =
    finalAnswers["Q_APPEARANCE"]?.includes("很重要");
  const isWantRecon = finalAnswers["Q_RECONSTRUCTION"]?.includes("有意願");
  const isAcceptingReop = finalAnswers["Q_REOPERATION"]?.includes("可以接受");

  // 只要放療三題中有一題選「不想」，就視為不接受放療
  const isRejectingRad =
    finalAnswers["Q_RADIATION_TIME"]?.includes("不想") ||
    finalAnswers["Q_RADIATION_SIDE_EFFECT_SKIN"]?.includes("不想") ||
    finalAnswers["Q_RADIATION_SIDE_EFFECT_HEARTLUNG"]?.includes("不想");

  const reconSuffix = isWantRecon || isAppearanceImportant ? "合併重建" : "";
  // --- 判定邏輯開始 ---

  // 情況一：如果「完全不接受放療」
  if (isRejectingRad) {
    return {
      type: "SM",
      title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description:
        "由於您對<b>放射線治療</b>有較多顧慮，而「部分乳房切除手術」必須搭配放療。因此，選擇全乳房切除能避開長期的放療療程與副作用，較符合您的需求。",
    };
  }

  // 情況二：在意乳房外觀 (且通過了放療測試，因為上面沒被攔截)
  if (isAppearanceImportant) {
    // 如果可以接受再次手術的風險 -> 適合 BCT
    if (isAcceptingReop) {
      return {
        type: "BCT",
        title: `建議方案：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
        description:
          "您在意乳房外觀，且願意承擔因邊緣不乾淨而需要再次手術的可能性與配合放療。<b>部分乳房切除</b>能最大程度保留您的自然胸型，是您的理想選擇。",
      };
    }
    // 如果要在意外觀但「不想」再次手術 -> 這裡通常會觸發 Questionnaire 的衝突攔截
    // 但若程式跑到這，我們會建議全切合併重建，以兼顧外觀與不需補切的需求
    else {
      return {
        type: "SM",
        title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
        description:
          "您雖然在意乳房外觀，但不希望承擔因邊緣不乾淨而需要再次手術的可能性。全乳房切除可以確保邊緣乾淨，若搭配<b>乳房重建</b>，可同時滿足您對外觀的要求。",
      };
    }
  }

  // 情況三：外觀不是首要考量 (A=0)
  return {
    type: "SM",
    title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
    description:
      "既然外觀不是您的首要考量，<b>全乳房切除</b>可以確保邊緣乾淨，且視病理情況有機會不需進行放射線治療，使治療流程相對簡化、安心。",
  };
};

/*const questionsDCIS = [
  {
    topic: "一次完成所有手術的重要性",
    //"info": "",
    question:
      "有些人希望一次就把所有可能需要的處置完成，避免未來還需要安排第二次手術，牽涉請假、家人照顧等額外負擔。請問您的想法是：",
    options: [
      "我希望能夠一次完成所有手術處置，不想再開一次刀",
      "我可以接受手術分兩次進行",
    ],
    //"extra": "請完整閱讀以下內容再做選擇",
    //"linkUrl": "https://plausible-uncle-1ab.notion.site/3902ace74f6e419fb47f99262d11efcd",
    //'linkText': '我該選擇哪種乳癌手術',
  },
  {
    topic: "承擔再次麻醉風險",
    //"info": "",
    question:
      "如果手術後病理報告呈現有癌細胞，需要再次進行前哨淋巴切片，代表有機會還要再次手術，也就還要再承擔一次麻醉的風險。請問您的想法是：",
    options: ["我擔心需要再次麻醉的風險", "我可以接受再次麻醉的風險"],
    //"extra": "請完整閱讀以下內容再做選擇",
    //"videoUrl": "https://www.youtube.com/watch?v=Vh217ZogKwQ",
  },
  {
    topic: "等待報告的心理壓力",
    //"info": "",
    question:
      "手術完等待病理報告的時間為7~14天，若第一次手術後病理報告呈現有癌細胞，則還需再安排第二次手術與等待報告7~14天，部分人可能會因此感到不確定性、焦慮與壓力。請問您的想法是：",
    options: [
      "我希望能同時接受手術，縮短等待報告期間，減輕我身心壓力",
      "我可以接受再次等待報告與手術，覺得這樣比較謹慎",
    ],
    //"extra": "請完整閱讀以下內容再做選擇",
    //"videoUrl": "https://youtu.be/O1zuko9nTpc?si=B_zf2N0vErvXGqyU",
  },
  {
    topic: "過度治療的接受程度",
    //"info": "",
    question:
      "接受前哨淋巴結清除(切片)手術後發生淋巴水腫的風險約為5%，不是每個人都會在手術後產生淋巴水腫的情形，還沒發生淋巴水腫前，在日常生活當中做好風險管理，就能降低發生的風險。請問您的想法是：",
    options: [
      "我可以接受即使最終沒發現癌症也不會覺得前哨淋巴切片是白做的，反而覺得這樣更安心，而且願意接受淋巴結切片術後可能產生的併發症",
      "我擔心接受淋巴結切片術後可能產生的併發症，希望先等確定病理報告後再決定是否做前哨淋巴切片，即使未來要再手術我也覺得沒關係",
    ],
    extra: "請完整閱讀以下內容再做選擇",
    linkUrl:
      "https://plausible-uncle-1ab.notion.site/1a2a35ddedd8809aa289c22f6a7b2844",
    linkText: "[接受淋巴結手術，包括前哨淋巴結切片、腋下淋巴結清除的相關問題]",
  },
];*/

/*const optionsDCIS = [
  {
    result:
      "您適合先接受部分乳房切除手術，之後再依據病理報告結果決定是否接受前哨淋巴切片",
    options: [
      "還好當初只選擇部分乳房切除，只有一次手術，不用擔心會有出現淋巴水腫的風險，現在可以專心後續追蹤治療了",
      "好吧，沒關係，那我就再接受一次前哨淋巴切片手術",
      "啊！早知道當初就不選合併前哨淋巴結片手術，現在要面臨有可能出現淋巴水腫的風險",
    ],
  },
  {
    result: "您適合一次接受部分乳房切除合併前哨淋巴切片手術",
    options: [
      "好吧，沒關係，現在起碼知道淋巴結檢驗結果了，我會好好地做復健降低淋巴水腫的風險",
      "還好當初有選擇前哨淋巴切片，只有一次手術，我會好好地做復健降低淋巴水腫風險，現在可以專心後續追蹤治療了",
      "啊！早知道當初就選合併前哨淋巴結片手術，現在還要再接受前哨淋巴結手術",
    ],
  },
];*/

const questionsDCIS = [
  {
    id: "DCIS_Q1",
    topic: "選擇手術方式",
    question: "醫師講解了兩種手術方式。您初步想選擇？",
    assistantScript: "您好，請在觀看完影片後，依照直覺選擇您比較傾向的手術方式",
    videoUrl: "https://youtu.be/fG2sW0AzzVA?si=QT36nD3c4GSZBwqX", // 醫師講解影片
    descriptionText:
      "請先依據您目前的想法做選擇，請不要擔心，這不是最後決策建議，我會繼續引導您。",
    options: [
      {
        label: "我選擇部分乳房切除手術",
        nextId: "DCIS_SCENARIO_BCT",
      },
      {
        label: "我選擇部分乳房切除合併前哨淋巴結切片手術",
        nextId: "DCIS_SCENARIO_SLNB",
      },
    ],
  },

  // --- 路線 A: 選擇部分切除 (BCT) 的情境引導 ---
  {
    id: "DCIS_SCENARIO_BCT",
    topic: "術後回診情境",
    question: `如果您住院接受部分乳房切除手術後沒有出現合併症，醫護人員協助您預約7~14天後回診，評估傷口及檢視病理報告。`,
    assistantScript: "現在，讓我來帶您體驗部分乳房切除手術的過程",
    videoUrl: "", // 請替換成 BCT 術後情境影片
    descriptionText:
      "目前是讓您了解接受部分乳房切除手術的流程，有問題都可以問我喔！",
    options: [], // 純閱讀
    nextId: "DCIS_Q2_BCT_NORMAL",
  },
  {
    id: "DCIS_Q2_BCT_NORMAL",
    topic: "病理報告：原位癌",
    question: `第一種可能的結果：病理報告是<strong>原位癌</strong>，而且組織邊緣乾淨，手術已圓滿完成。`,
    assistantScript: "到了回診看報告的時候了，讓醫師來向您說明第一種可能的結果",
    videoUrl: "", // 報告為原位癌的影片
    descriptionText:
      "目前是讓您了解接受部分乳房切除手術的流程，有問題都可以問我喔！",
    options: [],
    nextId: "DCIS_Q2_BCT_NORMAL_MARGIN",
  },
  {
    id: "DCIS_Q2_BCT_NORMAL_MARGIN",
    topic: "病理報告：原位癌",
    question: `第二種可能的結果：病理報告是<strong>原位癌</strong>但組織邊緣不足夠。<br /><br />只需要再次手術將乳房組織切乾淨，不需要進行腋下淋巴結切片。`,
    assistantScript: "接著讓醫師來向您說明第二種可能的結果",
    videoUrl: "", // 報告為原位癌的影片
    options: [],
    nextId: "DCIS_Q2_BCT_MALIGNANT",
  },
  {
    id: "DCIS_Q2_BCT_MALIGNANT",
    topic: "病理報告：惡性",
    question: `第三種可能的結果：病理報告是<strong>惡性乳癌</strong>。<br /><br />醫師解釋需要再次手術取樣淋巴結。<br /><strong>您一開始選擇只接受部分乳房切手術，如果遇到需要再次手術進行腋下淋巴結切片，您此刻的心情會是？</strong>`,
    videoUrl: "", // 報告為惡性的影片
    assistantScript: "接著讓醫師來向您說明第三種可能的結果",
    options: [
      {
        label: "懊悔：早知當初就該選一起做前哨淋巴結切片手術",
        resultTitle: "建議方案：一開始就選擇部分乳房切除合併前哨淋巴結切片手術",
        resultDescription: `根據您的感受，您比較在意還要再接受一次手術。對於您來說，<strong>一開始就選擇部分乳房切除合併前哨淋巴結切片手術</strong>可能更適合，避免承擔第二次手術的焦慮。`,
        flowChart: bctImage,
      },
      {
        label: "可接受：再開一次手術也沒關係，確保治療效果最重要",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription: `您是屬於<strong>可以接受分階段決策</strong>的人。先進行部分乳房切除，等第一次手術病理報告出爐，依據結果再來決定是否對前哨淋巴結切片化驗，對您而言才是相對穩健且可接受的流程。`,
        flowChart: bctImage,
      },
    ],
    isFinal: true,
  },

  // --- 路線 B: 選擇合併手術 (SLNB) 的情境引導 ---
  {
    id: "DCIS_SCENARIO_SLNB",
    topic: "術後回診情境",
    videoUrl: "", // 請替換成 SLNB 術後情境影片
    question: `您住院接受部分乳房切除合併前哨淋巴結切片手術後沒有合併症，預約 7~14 天後回診。`,
    options: [],
    nextId: "DCIS_Q2_SLNB_MALIGNANT",
  },
  {
    id: "DCIS_Q2_SLNB_MALIGNANT",
    topic: "情境一：病理報告為惡性",
    videoUrl: "", // 請替換成 SLNB 術後情境影片
    question: `第一種可能的報告結果：<strong>惡性乳癌</strong>。<br /><br />您當初決定同時取樣淋巴結，現在手術已圓滿完成，不需再次開刀。`,
    options: [],
    nextId: "DCIS_Q2_SLN_MALIGNANT_MARGIN",
  },
  {
    id: "DCIS_Q2_SLN_MALIGNANT_MARGIN",
    topic: "病理報告：原位癌",
    videoUrl: "", // 報告為原位癌的影片
    question: `第二種可能的結果：病理報告是<strong>惡性乳癌</strong>但組織邊緣不足夠。<br /><br />需要再次手術將乳房惡性組織切乾淨。`,
    options: [],
    nextId: "DCIS_Q3_SLNB_NORMAL_MARGIN",
  },
  {
    id: "DCIS_Q3_SLNB_NORMAL_MARGIN",
    topic: "病理報告：原位癌",
    videoUrl: "", // 報告為原位癌的影片
    question: `第三種可能的結果：病理報告是<strong>原位癌</strong>但組織邊緣不足夠。<br /><br />需要再次手術將乳房組織切乾淨。`,
    options: [],
    nextId: "DCIS_Q3_SLNB_NORMAL",
  },
  {
    id: "DCIS_Q3_SLNB_NORMAL",
    topic: "情境二：病理報告為原位癌",
    videoUrl: "", // 報告為原位癌的影片
    question: `第四種可能的報告結果：病理報告是<strong>原位癌</strong>組織邊緣足夠。<br /><br />報告結果為原位癌，就不需要特別針對前哨淋巴結進行切片，這代表當初的淋巴切片其實是多做的處置。<br /><strong>面對多做了一個不必要的前哨淋巴結切片手術，您此刻的心情會是？</strong>`,
    options: [
      {
        label: "可接受：反正開都開了，之後好好做預防淋巴水腫運動就好",
        resultTitle: "建議方案：一開始就選擇部分乳房切除合併前哨淋巴結切片手術",
        resultDescription:
          "您的選擇顯示您偏好一次手術處理完。對於您來說，<strong>同時接受部分乳房切除合併前哨淋巴結切片手術</strong>能讓您感到安心，您也能配合復健運動的執行，盡量降低淋巴水腫的發生。",
        flowChart: bctImage,
      },
      {
        label:
          "懊悔：早知道當初就先不要選前哨淋巴切片手術，現在還要白白承擔有可能會發生淋巴水腫的風險",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription:
          "您對於多做前哨淋巴切片手術帶來不必要的淋巴水腫風險較無法接受。建議您<strong>先選擇部分乳房切除手術</strong>，等第一次手術病理報告出爐，依據結果再來決定是否對前哨淋巴結切片化驗，對您而言才是相對穩健且可接受的流程。",
        flowChart: bctImage,
      },
    ],
    isFinal: true,
  },
];

export {
  introText,
  introTextBctSm,
  introTextSTVAB,
  introTextReconstruction,
  topicDescriptions,
  questionsBctSm,
  getBctSmResult,
  questionsDCIS,
};
