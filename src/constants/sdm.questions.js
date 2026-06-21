// src/constants/sdm.questions.js
// Question-flow data for each decision aid topic.
// question strings are HTML rendered via dangerouslySetInnerHTML.
// Hint bubble spans use class="hint-trigger pulsing-hint hint-icon" (no inline styles).
// Inline styles for layout/visual design belong in styles.css or *.module.css.

import hintImages from "./sdm.assets";

// ─────────────────────────────────────────────────────────────────────────────
// BCT+SLNB vs SM+SLNB  ―  pathway journey + values questionnaire
// ─────────────────────────────────────────────────────────────────────────────

// Reusable hint span (same helper as DCIS section below)
const hintBctSm = (id) =>
  `<span class="hint-trigger pulsing-hint hint-icon" data-hint-id="${id}">💡</span>`;

export const questionsBctSm = [
  // ── 開場：全局概覽 ──
  {
    id: "BCTSM_INTRO",
    topic: "兩種手術治療流程的全貌",
    assistantScript: `
      您好，在做決定之前，讓我先告訴您一件最重要的事：
      部分乳房切除合併前哨淋巴結切片，和全乳房切除合併前哨淋巴結切片，
      兩者的長期存活率是相同的。
      這個決定不是在選哪個活得比較久，而是在選哪種治療過程和結果是您更能接受的。
      兩種手術有兩個主要差異：第一，是否保留乳房；第二，放射線治療的必要性。
      接下來，我會帶您依序體驗兩種手術，讓您親身感受每個階段的具體差異。
    `,
    question: `
      <p>在做決定前，先了解最重要的一件事：兩種手術的長期存活率相同。</p>
      <br/>
      <p><strong>兩種手術的主要差異：</strong></p>
      <p><strong>① 乳房外觀的改變</strong>：部分乳房切除後外觀改變較小，全乳房切除後外觀幾乎平整</p>
      <p><strong>② 放射線治療的必要性</strong>：部分乳房切除後如果是乳癌幾乎<strong>必須</strong>放療；全乳房切除後<strong>不一定</strong>需要放療</p>
      <br/>
      <p>接下來，讓我們<strong>依序體驗兩種手術的流程</strong>，感受每個階段的具體差異。</p>
    `,
    hints: {
      bctsm_bct_flow: {
        type: "image",
        src: hintImages["bct_slnb"],
        alt: "部分乳房切除合併前哨淋巴結切片治療流程圖",
      },
      bctsm_sm_flow: {
        type: "image",
        src: hintImages["sm_slnb"],
        alt: "全乳房切除合併前哨淋巴結切片治療流程圖",
      },
    },
    options: [],
    nextId: "BCTSM_START",
  },

  // ── 體驗入口 ──
  {
    id: "BCTSM_START",
    topic: "治療路徑模擬體驗",
    assistantScript: `
      請選擇您想先體驗的手術方式
    `,
    question: "接下來將分別帶您體驗兩種手術的治療流程。您想先體驗哪一個？",
    options: [
      { label: "部分乳房切除合併前哨淋巴結切片", nextId: "BCT_A1_OP" },
      { label: "全乳房切除合併前哨淋巴結切片", nextId: "SM_B1_OP" },
    ],
  },

  // ── 路線 A：BCT+SLNB 旅程 ──
  {
    id: "BCT_A1_OP",
    topic: "BCT｜第一步：手術",
    assistantScript: `
      現在進入部分乳房切除合併前哨淋巴結切片手術的體驗。
      手術中，醫師會切除腫瘤和周圍少量組織，保留大部分的乳房，同時進行前哨淋巴結切片。
      手術中也可以評估是否要做立即局部重建，利用鄰近組織補足凹陷，這是自費項目。
      手術順利完成後，大約 7 到 14 天後回診，看病理報告。
    `,
    question: `
      <p><strong>【部分乳房切除合併前哨淋巴結切片手術】</strong></p>
      <br/>
      <p>${hintBctSm("bct_look")}手術中，醫師切除腫瘤及周圍少量組織，<strong>保留大部分乳房</strong>。</p>
      <p>${hintBctSm("slnb_reason")}同時進行前哨淋巴結切片。</p>
      <br/>
      <p>手術前可先思考：是否要立即局部重建？</p>
      <p>
        ✦ <strong>立即重建</strong>（同次手術）：利用鄰近組織或假體補足凹陷，自費<br/>
        ✦ <strong>延遲重建</strong>：等治療全部結束後再評估是否重建<br/>
        ✦ <strong>不重建</strong>：部分切除範圍相對小，凹陷程度多數人可接受，不一定需要重建
      </p>
      <br/>
      <p>手術順利完成，沒有發生合併症。醫護人員為您預約 <strong>7～14 天後</strong>回診，評估傷口並檢視病理報告。</p>
    `,
    hints: {
      bct_look: {
        type: "image",
        src: hintImages["bct_look"],
        alt: "部分乳房切除合併前哨淋巴結切片治療流程圖",
      },
      slnb_reason: {
        type: "image",
        src: hintImages["slnb_reason"],
        alt: "前哨淋巴結切片目的",
      },
    },
    options: [],
    nextId: "BCT_A2_MARGIN",
  },

  {
    id: "BCT_A2_MARGIN",
    topic: "BCT｜病理報告：邊緣評估",
    assistantScript: `
      7 到 14 天後，病理報告出爐了。
      這裡有一個部分乳房切除特有的考量，我想先說明清楚。
      切除腫瘤後，病理科會在顯微鏡下檢查切除組織的四周邊緣，確認有沒有留下足夠的安全邊緣。
      如果邊緣不夠乾淨，就需要再開一次刀，切除更多的乳房組織。
      這個邊緣不足的情況，大約有兩成的機率會發生。
      這是部分乳房切除特有的考量；全乳房切除因為整個乳房都切掉了，不會有邊緣不足的問題。
      另外，兩種手術都有可能因為淋巴結感染情形嚴重，需要再次進行淋巴廓清手術，這部分不管選哪種手術都是一樣的，不算在這裡討論的範圍。
      所以現在想請問您，面對部分乳房切除大約兩成機率需要因為安全邊緣不夠，再開一次刀的狀況，您的感受是？
    `,
    question: `
      <p><strong>【安全邊緣評估】</strong></p>
      <br/>
      <p>7～14 天後回診檢視病理報告</p>
      <p>${hintBctSm("surgical_margin")}切除腫瘤後，病理科醫師會檢查組織四周邊緣是否有足夠的安全距離。</p>
      <br/>
      <p>✅ <strong>邊緣足夠</strong>：腫瘤完整切除，手術圓滿完成</p>
      <p>⚠️ <strong>邊緣不足（約兩成機率）</strong>：需再次手術，切除更多乳房組織</p>
      <br/>
      <p>全乳房切除因為整個乳房都切除了，不會有安全邊緣不足的問題。<strong>部分乳房切除則需要考量，可能會有兩成機率因為安全邊緣不足而需要再次手術。</strong></p>
      <br/>
      <p class="em-note">補充：無論選擇哪種手術，若淋巴結感染嚴重需要進一步處理，兩種手術都可能需要再次淋巴廓清手術，不在這裡討論範圍。</p>
      <br/>
      <p class="em-red">面對部分乳房切除後，約兩成機率會因為安全邊緣不夠需要再開一次刀，您的感受是？</p>
    `,
    hints: {
      surgical_margin: {
        type: "image",
        src: hintImages["surgical_margin"],
        alt: "手術安全邊緣",
      },
    },
    options: [
      { label: "可以接受，有切除乾淨比較重要", nextId: "BCT_A4_CHEMO" },
      { label: "不想承擔還要再開一次刀的可能", nextId: "BCT_A4_CHEMO" },
    ],
  },

  {
    id: "BCT_A4_CHEMO",
    topic: "BCT｜化學治療評估",
    assistantScript: `
      完成手術後，醫師會評估是否需要化療。
      需要化療的話，療程約 3 到 6 個月，必須先完成化療，
      間隔約 4 週讓身體修復，再進入放射線治療。
      不需要化療的話，傷口癒合後進入放療評估。
      關於放療，如果是侵襲性乳癌，部分乳房切除後幾乎都需要放療。
      如果是乳房原位癌，則要看腫瘤大小和分級，
      腫瘤較小、分級較低的情況下，醫師可能評估省略放療。
    `,
    question: `
      <p><strong>【化學治療評估】</strong></p>
      <br/>
      <p><strong>① 情況一：{{yt:oxCrG5yD3t0}} 需要化療</strong><br/>
      {{yt:34Seb2e9sB4}} 療程約 3～6 個月，<strong>先完成化療</strong> → 間隔 4 週 → 進入放射線治療評估</p>
      <br/>
      <p><strong>② 情況二：不需要化療</strong><br/>
      由醫師評估腫瘤特性，若不需要化療，等傷口癒合 → 進入放射線治療評估</p>
    `,
    options: [],
    nextId: "BCT_A5_RADIATION",
  },

  {
    id: "BCT_A5_RADIATION",
    topic: "BCT｜放射線治療-為什麼要做？療程怎麼安排？",
    assistantScript: `
      這一步是部分乳房切除後的放射線治療。
      放療的目的是消滅手術後可能殘留在乳房組織裡的癌細胞，降低局部復發的機會。
      如果診斷是侵襲性乳癌，部分乳房切除後幾乎所有人都需要做放療。
      如果診斷是乳房原位癌，放療是否需要，要看腫瘤大小和分級等因素，醫師會個別評估。
      放療的療程大約是 4 到 8 週，每週一到五、每天去醫院，每次約十到三十分鐘。
    `,
    question: `
      <p><strong>【放射線治療—目的與療程安排】</strong></p>
      <br/>
      <p><strong>{{yt:YBSbYRUlY-8}} 為什麼要做放療？</strong></p>
      <p>
      &nbsp;&nbsp;• <strong>侵襲性乳癌</strong>：部分乳房切除後幾乎都需要放療，為的是消滅殘留癌細胞、降低局部復發率<br/>
      &nbsp;&nbsp;• <strong>乳房原位癌</strong>：腫瘤較小、分級較低時，由醫師個別評估，可能可以省略放療
      </p>
      <br/>
      <p><strong>{{yt:Vh217ZogKwQ}} 療程是怎麼安排的？</strong></p>
      <p>以醫師規劃為主，大致上共 <strong>4～8 週</strong>，每週一至五、每天到醫院，週六日休息，每次約 10～30 分鐘</p>
      <br/>
      <p class="em-red">每天到醫院、連續 4～8 週的安排，您能配合嗎？</p>
    `,
    hints: {},
    options: [
      {
        label: "我可以接受並配合這樣的安排",
        nextId: "BCT_A5_SIDEEFFECT",
      },
      {
        label: "每天往返醫院的安排讓我感到壓力",
        nextId: "BCT_A5_SIDEEFFECT",
      },
    ],
  },

  {
    id: "BCT_A5_SIDEEFFECT",
    topic: "BCT｜放射線治療-副作用有哪些？",
    assistantScript: `
      接下來談放療可能出現的副作用。
      最常見的是皮膚反應，照射的地方會有點泛紅、乾燥，感覺像曬傷，放療結束後幾週就會恢復，大多數人都能度過。
      另外，如果腫瘤在左側，極少數情況下可能輕微影響心臟或肺部，但醫師會調整照射的角度來降低這個風險。
      整個療程期間也可能感到比較容易疲倦，多休息就可以了。
      這些副作用，對您來說是可以接受的嗎？
    `,
    question: `
      <p><strong>【放射線治療-常見副作用】</strong></p>
      <br/>
      <p>
        &nbsp;&nbsp;• {{yt:qjMrVpc_mO4}} <strong>皮膚反應</strong>：照射部位泛紅、乾燥，類似曬傷感；放療結束後數週內自然恢復，大多數人都能度過<br/>
        &nbsp;&nbsp;• {{yt:jETmg4JI2Pc}} <strong>心肺影響</strong>：機率極低，多見於左側腫瘤；醫師會調整照射角度，將風險降到最低<br/>
        &nbsp;&nbsp;• <strong>疲倦感</strong>：療程期間容易疲勞，充分休息即可，不影響治療進行
      </p>
      <br/>
      <p class="em-red">對於這些放療可能出現的副作用，您能接受嗎？</p>
    `,
    options: [
      {
        label: "可以接受，這些副作用在我可承受的範圍內",
        nextId: "BCT_A6_FOLLOWUP",
      },
      {
        label: "這些副作用讓我感到顧慮，不確定能不能承受",
        nextId: "BCT_A6_FOLLOWUP",
      },
    ],
  },

  {
    id: "BCT_A6_FOLLOWUP",
    topic: "BCT｜定期追蹤",
    assistantScript: `
      您已完成了部分乳房切除合併前哨淋巴結切片手術的主要治療了，目前需要定期回診追蹤。
    `,
    question: `
      <p><strong>【定期追蹤】</strong></p>
      <br/>
      <p>完成手術和放療後，進入定期回診追蹤。</p>
      <br/>
      <p>若病理報告<strong>荷爾蒙受體是陽性</strong>，放療結束後還需要持續服用<strong>抗荷爾蒙藥物</strong>，療程約<strong> 5～10 年</strong>。</p>
      <br/>
      <p>若當初沒有選擇立即性乳房重建手術，在這個階段對外觀感到不滿意，此時仍可與整形外科醫師討論<strong>乳房重建</strong>。</p>
    `,
    options: [
      {
        label: "完成【部分乳房切除合併前哨淋巴結切片手術】流程體驗",
        nextId: "BCT_A7_FINISH",
      },
    ],
  },

  {
    id: "BCT_A7_FINISH",
    topic: "BCT 旅程完成",
    assistantScript: `
      您已完成了部分乳房切除合併前哨淋巴結切片手術的治療流程體驗，請確認您已完成體驗全乳房切除合併前哨淋巴結切片手術的治療流程，才能看最終建議。
    `,
    question:
      "您已完整體驗了「部分乳房切除合併前哨淋巴結手術」的治療流程。請確認您已完成體驗「全乳房切除合併前哨淋巴結手術」後，再看最終建議。",
    options: [
      { label: "體驗「全乳房切除合併前哨淋巴結手術」", nextId: "SM_B1_OP" },
      { label: "我已了解兩者差異，看最終建議", isFinal: true },
    ],
  },

  // ── 路線 B：SM+SLNB 旅程 ──
  {
    id: "SM_B1_OP",
    topic: "SM｜第一步：手術、外觀與重建選擇",
    assistantScript: `
      現在進入全乳房切除合併前哨淋巴結切片手術的體驗。
      全乳房切除是將整個乳房切除，術後外觀會有明顯改變。
      但有三種可能的走向，讓我分別說明。
      第一，選擇立即重建：在同一次手術中完成乳房重建，可用義乳植入或自體組織。
      重建後外觀更接近乳房的輪廓，但觸感、對稱性、乳頭乳暈與自然乳房仍有差異，屬自費項目。
      第二，選擇延遲重建：等所有治療結束後再評估，保留最大彈性。
      第三，選擇不重建：傷口以平整方式縫合，胸部呈現平整外觀。
      需要特別說明的是，即使選擇重建，重建後的外觀和觸感與原本自然的乳房還是有所不同，
      形狀、對稱性、乳頭乳暈都可能有落差。
      了解這三種可能後，我想請您思考：哪一種結果是您能接受的？
    `,
    question: `
      <p><strong>【全乳房切除合併前哨淋巴結切片手術】</strong></p>
      <br/>
      <p>${hintBctSm("sm_look")}手術中，醫師<strong>切除整個乳房</strong>，若沒有當下進行重建，<strong>外觀變得平整</strong>。</p>
      <p>${hintBctSm("slnb_reason")}同時進行前哨淋巴結切片。</p>
      <br/>
      <p>{{yt:Fos0tafgQME}} 重建目的是讓外觀更接近健康那側的乳房形狀，但觸感、對稱性、乳頭乳暈與自然乳房仍有差異。重建手術需<strong>自費</strong>。</p>
      <br/>
      <p>術後外觀的三種走向：</p>
      <p>
        ✦ <strong>立即重建</strong>（同次手術）：使用義乳植入或自體組織，重建出乳房的輪廓<br/>
        ✦ <strong>延遲重建</strong>（等治療全部結束後）：可能先放置組織擴張器，待後續追蹤穩定後再重建<br/>
        ✦ <strong>不重建</strong>：傷口以平整方式縫合，胸部呈平整外觀
      </p>
      <br/>
      <p class="em-red">了解三種可能後，關於外觀與重建，您的想法是？</p>
    `,
    hints: {
      sm_look: {
        type: "image",
        src: hintImages["sm_look"],
        alt: "全乳房切除手術外觀示意",
      },
      slnb_reason: {
        type: "image",
        src: hintImages["slnb_reason"],
        alt: "前哨淋巴結切片目的",
      },
    },
    options: [
      { label: "能接受外觀平整，不考慮重建", nextId: "SM_B2_LN" },
      { label: "能接受外觀改變，有意願考慮重建（需自費）", nextId: "SM_B2_LN" },
      { label: "外觀對我非常重要，希望盡量保留原本的乳房", nextId: "SM_B2_LN" },
    ],
  },

  {
    id: "SM_B2_LN",
    topic: "SM｜病理報告：淋巴結評估",
    assistantScript: `
      7 到 14 天後，病理報告出爐了。
      病理報告除了檢視乳房組織的病理分型、腫瘤大小等，還要檢視淋巴結是否有惡性細胞的存在。
      淋巴結的結果有兩種可能。
      第一種：前哨淋巴結無轉移或輕微感染，不需要再動手術清除更多淋巴結。
      第二種：淋巴結感染比較嚴重，需要進行腋下淋巴廓清手術，確保清除殘餘癌細胞。
    `,
    question: `
      <p><strong>【淋巴結評估】</strong></p>
      <br/>
      <p>約 7～14 天後回診檢視病理報告</p>
      <p>✅ <strong>不需進一步廓清</strong>：前哨淋巴結無轉移或輕微感染，手術圓滿完成</p>
      <p>⚠️ <strong>需要腋下淋巴廓清</strong>：淋巴結感染較嚴重，需再次手術清除腋下淋巴結，避免殘餘癌細胞</p>
      <br/>
      <p class="em-note">補充：無論選擇哪種手術，若淋巴結感染嚴重，兩種手術都可能需要再次淋巴廓清手術。</p>
    `,
    options: [],
    nextId: "SM_B3_TREATMENT_CHEMO",
  },

  {
    id: "SM_B3_TREATMENT_CHEMO",
    topic: "SM｜化學治療評估",
    assistantScript: `
      完成手術後，醫師會依據您病理報告的結果，評估是否需要化療。
      需要化療的話，療程約 3 到 6 個月，必須先完成化療，
      間隔約 4 週讓身體修復，再進入放療評估。
      不需要化療的話，傷口癒合後進入放療評估。
    `,
    question: `
      <p><strong>【化學治療評估】</strong></p>
      <br/>
      <p><strong>① 情況一：{{yt:oxCrG5yD3t0}} 需要化療</strong><br/>
      {{yt:34Seb2e9sB4}} 療程約 3～6 個月，<strong>先完成化療</strong> → 間隔 4 週 → 進入放射線治療評估</p>
      <br/>
      <p><strong>② 情況二：不需要化療</strong><br/>
      由醫師評估腫瘤特性，若不需要化療，等傷口癒合 → 進入放射線治療評估</p>
    `,
    options: [],
    nextId: "SM_B3_TREATMENT_RADIATION",
  },

  {
    id: "SM_B3_TREATMENT_RADIATION",
    topic: "SM｜後續輔助治療—與 BCT 最大的差異",
    assistantScript: `
      這裡是全乳房切除和部分乳房切除最重要的差別：放射線治療。
      部分乳房切除後，幾乎所有人都必須做放療。
      但全乳房切除後，大部分情況下不需要放療。
      什麼時候全乳房切除後還是需要放療呢？
      主要是當腫瘤較大，直徑超過 5 公分，或是轉移的淋巴結顆數較多，4 顆以上。
      在這些情況下，醫師可能會建議加做放療，進一步降低局部復發率。
    `,
    question: `
      <p><strong>【放射線治療—與部分乳房切除手術最大的差異】</strong></p>
      <br/>
      <p><strong>{{yt:7MiWDg5sa8Y}} 乳房全部都切除了還要做放療嗎？</strong></p>
      <p>
        ✅ 大部分全乳房切除患者<strong>不需要</strong>放療<br/>
        ⚠️ 除非<strong>腫瘤較大（&gt;5cm）</strong>或<strong>淋巴結轉移顆數多（≥4 顆）</strong>，醫師可能<strong>建議加做放療以降低局部復發率</strong>
      </p>
      <br/>
      <p><strong>{{yt:Vh217ZogKwQ}} 療程是怎麼安排的？</strong></p>
      <p>以醫師規劃為主，大致上共 <strong>4～8 週</strong>，每週一至五、每天到醫院，週六日休息，每次約 10～30 分鐘</p>
    `,
    hints: {},
    options: [],
    nextId: "SM_B4_FOLLOWUP",
  },

  {
    id: "SM_B4_FOLLOWUP",
    topic: "SM｜定期追蹤與重建再評估",
    assistantScript: `
      您已完成了全乳房切除合併前哨淋巴結切片手術的主要治療了，目前需要定期回診追蹤。
    `,
    question: `
      <p><strong>【定期追蹤】</strong></p>
      <br/>
      <p>完成主要治療後，進入定期回診追蹤。</p>
      <br/>
      <p>若病理報告<strong>荷爾蒙受體是陽性</strong>，還需要持續服用<strong>抗荷爾蒙藥物</strong>，療程約<strong> 5～10 年</strong>。</p>
      <br/>
      <p>若當初沒有選擇立即性乳房重建手術，在這個階段對乳房外觀感到不滿意，此時仍可與整形外科醫師討論<strong>乳房重建</strong>。</p>
    `,
    options: [
      {
        label: "完成【全乳房切除合併前哨淋巴結切片手術】流程體驗",
        nextId: "SM_B5_FINISH",
      },
    ],
  },

  {
    id: "SM_B5_FINISH",
    topic: "SM 旅程完成",
    assistantScript: `
      您已完成了全乳房切除合併前哨淋巴結切片手術的治療流程體驗，請確認您已完成體驗部分乳房切除合併前哨淋巴結切片手術的治療流程，才能看最終建議。
    `,
    question:
      "您已完整體驗了「全乳房切除合併前哨淋巴結手術」的治療流程。請確認您已完成體驗「部分乳房切除合併前哨淋巴結手術」後，再看最終建議。",
    options: [
      { label: "體驗「部分乳房切除合併前哨淋巴結手術」", nextId: "BCT_A1_OP" },
      { label: "我已了解兩者差異，看最終建議", isFinal: true },
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
      <p class="em-label">【部分乳房切除手術的外觀影響】</p>
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
        ✅ <strong>邊緣足夠</strong>：代表腫瘤已完整切除，手術圓滿完成。<br/>
        ⚠️ <strong>邊緣不足</strong>：代表周圍可能仍有殘留細胞，需要<strong>再次手術</strong>擴大切除範圍。
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
      <p>${hint("slnb_reason")}癌細胞若從乳房擴散出去，最常跑到腋下的「前哨淋巴結」又稱「哨兵淋巴結」，是最靠近腫瘤的前幾顆淋巴結，切片就是取這幾顆來化驗。</p>
      <br/>
      <p>
        ✅ <strong>前哨淋巴結沒有癌細胞</strong>：淋巴系統安全，不需要進一步清除。<br/>
        ⚠️ <strong>前哨淋巴結有癌細胞</strong>：代表可能已擴散，需評估是否清除更多淋巴結。
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
      <p>① <strong>敷麻藥減輕不適</strong>：檢查前醫護人員會先在您的乳頭乳暈處敷上麻醉藥膏，幫忙降低疼痛與不舒服感。</p>
      <p>② <strong>注射同位素</strong>：接著會從乳頭乳暈處注射少量的放射性同位素，這個同位素會順著淋巴循環流到前哨淋巴結。</p>
      <p>③ <strong>淋巴攝影定位</strong>：再來會幫您安排淋巴攝影，讓醫師看清楚同位素集中在哪一顆淋巴結，達到精準定位的效果。</p>
      <br/>
      <p>第二步：手術中的精準偵測</p>
      <p>開刀時，醫師會使用專用儀器去探測同位素的訊號，把有訊號反應的淋巴結取下來，送去病理化驗。</p>
      <br/>
      <p>如果手術當中同位素的訊號比較微弱，醫師會視情況額外使用一種<strong>「藍色染劑」</strong>來幫忙找到前哨淋巴結。這個藍色染劑最後會透過尿液代謝排出，所以手術後如果發現自己的尿液顏色變成「藍綠色」的，請千萬不要太緊張！這非常正常，只要適時、多補充水分，大約 1~2 天後尿液就會變回正常的顏色囉！</p>
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
      <p class="em-label">【前哨淋巴結切片的主要副作用：淋巴水腫】</p>
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
        label:
          "我選擇：先做部分乳房切除，等報告看有沒有需要進行前哨淋巴結切片再說",
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
      <p class="em-red">面對現在需要再次手術的情況，您此刻的心情是？</p>
    `,
    options: [
      {
        label:
          "懊悔：早知道當初就應該同時選擇合併前哨淋巴結切片手術，現在還要再開一次",
        resultTitle: "建議方案：部分乳房切除合併前哨淋巴結切片手術",
        resultDescription: `
          您的選擇顯示，<strong>再次手術的等待與焦慮對您來說難以接受</strong>。
          對您而言，避免還要再開一次刀，比在原位癌情況下多做前哨淋巴結切片更重要。
          <strong>一開始就選擇合併前哨淋巴結切片手術</strong>，一次處理完，是更適合您的選擇。
        `,
        flowChart: hintImages["bct_slnb"],
      },
      {
        label: "可以接受：再開一次手術也沒關係，確認清楚比較重要",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription: `
          您的選擇顯示，您是屬於<strong>可以接受分階段決策</strong>的人。
          <strong>先做部分乳房切除</strong>，等報告確認是否升級成乳癌後，再決定是否需要前哨淋巴結切片，
          對您而言，避免在原位癌的情況下，做不必要的前哨淋巴結切片，比避免還要再一次手術更重要。
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
      <p>病理報告出爐了。</p>
      <br/>
      <p>醫師說：「報告確認是乳房原位癌，安全邊緣也足夠，手術非常成功！」</p>
      <br/>
      <p>但這也意味著，您當初選擇同時做的前哨淋巴結切片，<strong>其實是不需要的處置</strong>。</p>
      <br/>
      <p>您已承擔了前哨淋巴結切片帶來的風險（約 5% 的淋巴水腫可能性），而且這個風險現在看起來是不必要的。</p>
      <br/>
      <p class="em-red">面對需要承擔不必要的淋巴水腫等前哨淋巴結切片帶來的風險，您此刻的心情是？</p>
    `,
    options: [
      {
        label:
          "可以接受：雖然多做了，但當時不確定，總是覺得做了比較安心，我願意為這個安心付出代價",
        resultTitle: "建議方案：部分乳房切除合併前哨淋巴結切片手術",
        resultDescription: `
          您的選擇顯示，您<strong>願意為安心感付出代價</strong>。
          即使最終報告確認是乳房原位癌，前哨淋巴結切片是多做的，您仍認為當時一次處理完是值得的。
          <strong>能夠一次手術解決</strong>，對您來說比事後的遺憾更重要。
          對您而言，部分乳房切除合併前哨淋巴結切片手術是更適合的選擇。
        `,
        flowChart: hintImages["bct_slnb"],
      },
      {
        label:
          "懊悔：早知道當初就先不要做淋巴切片，現在還要白白承擔可能會發生淋巴水腫的風險",
        resultTitle: "建議方案：先選部分乳房切除手術",
        resultDescription: `
          您的選擇顯示，您對於<strong>不必要的處置帶來額外風險</strong>會感到後悔。
          最終報告如果是乳房原位癌，您認為白白承擔了不必要的前哨淋巴結切片帶來的風險。
          對您而言，<strong>先選擇部分乳房切除手術</strong>，是更適合您的選擇。等病理報告確認後，
          真的非要進行前哨淋巴結切片再說，這樣才能確保每一個處置都有它的必要性，而不用白白承擔原本可能可以避免的副作用。
        `,
        flowChart: hintImages["dcis"],
      },
    ],
    isFinal: true,
  },
];
