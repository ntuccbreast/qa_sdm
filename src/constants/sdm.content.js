// src/constants/sdm.content.js
// All user-facing text content: intro paragraphs and audio scripts.
// HTML strings here are rendered via dangerouslySetInnerHTML in Questionnaire.jsx.
// Keep logic and question-flow data in sdm.js / sdm.questions.js.

import hintImages from "./sdm.assets";

// ── Plain-text narration scripts (read aloud by the assistant avatar) ──

export const introText = `
您好，我是乳房外科小幫手。歡迎使用乳房手術方式輔助決策工具！
當您檢查發現異常鈣化、被診斷乳房原位癌或乳癌時，該選擇哪個治療處置可能讓人感到困惑。
我知道這是一個不容易的決定。請告訴我您的基本資料跟想了解的問題，我將一步一步陪您釐清，幫助您做出最適合自己的決定。
請注意：我的建議不能取代專業醫生的診斷和討論喔，只是提供您決策的資訊。
`;

export const introAudioDCIS = `
您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。
當您被診斷為乳房原位癌後，可能正在思考：「我應該選擇部分乳房切除，還是同一次手術一起進行部分乳房切除合併前哨淋巴結切片？」
這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。
說明的過程中，點擊閃爍燈泡，可以看更多資訊！點擊Youtube圖案，可以看多更多補充影片說明！
評估的過程中，如果有問題，可以在我說明完後點擊我的頭像，我會隨時回答您喔！
我會根據您的想法，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。
準備好了嗎？那我們就一起開始吧！
`;

export const introAudioBctSm = `
您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。
當您被診斷為乳房原位癌或乳癌後，可能正在思考：「我應該選擇部分乳房切除合併前哨淋巴結切片，還是全乳房切除合併前哨淋巴結切片？」
這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。
說明的過程中，點擊閃爍燈泡，可以看更多資訊！點擊Youtube圖案，可以看多更多補充影片說明！
評估的過程中，如果有問題，可以在我說明完後點擊我的頭像，我會隨時回答您喔！
我會根據您的想法，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。
準備好了嗎？那我們就一起開始吧！
`;

// ── HTML intro panels (rendered via dangerouslySetInnerHTML) ──

export const introTextBctSm = `
<p><strong>使用說明：</strong><br /><br />
點擊 <span class="hint-trigger pulsing-hint hint-icon" style="width:16px;height:16px;font-size:0.9rem;line-height:0;vertical-align:2px;margin-right:1px;margin-bottom:1px;">💡</span>
可以看到更多資訊<br /><br />
點擊<img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" style="height: 1.2em; vertical-align: middle; margin: 0 4px;" />可以看到更多補充說明影片<br /><br />
點擊我的頭像<img src="${hintImages["helperinside"]}" alt="頭像" style="height: 1.5em; border-radius: 50%; vertical-align: middle; margin: 0 4px;" />可以隨時問我問題<br /><br />
準備好了就讓我們一起開始吧！</p><br />
`;

export const introTextDCIS = `
<p><strong>使用說明：</strong><br /><br />
點擊 <span class="hint-trigger pulsing-hint hint-icon" style="width:16px;height:16px;font-size:0.9rem;line-height:0;vertical-align:2px;margin-right:1px;margin-bottom:1px;">💡</span>
可以看到更多資訊<br /><br />
點擊<img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" style="height: 1.2em; vertical-align: middle; margin: 0 4px;" />可以看到更多補充說明影片<br /><br />
點擊我的頭像<img src="${hintImages["helperinside"]}" alt="頭像" style="height: 1.5em; border-radius: 50%; vertical-align: middle; margin: 0 4px;" />可以隨時問我問題<br /><br />
準備好了就讓我們一起開始吧！</p><br />
`;

export const introTextSTVAB = `
<p>您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。</p>
<p>當您在乳房攝影發現有鈣化後，可能正在思考：「<strong>我應該選擇乳房立體定位微創切片，還是傳統的細針定位取樣？</strong>」。</p>
<p>這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。</p>
<p>填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。</p>
<p>準備好了嗎？那我們就一起開始吧！</p>
`;

export const introTextReconstruction = `
<p>您好，我是乳房外科小幫手，今天要陪您一起做一個重要的決定。</p>
<p>當您被診斷為<strong>乳房導管內原位癌 (DCIS; Ductal Carcinoma In Situ)</strong>時，代表異常細胞只存在於乳腺管內]，尚未突破基底膜，也沒有侵犯到周圍的乳房組織或其他器官。這是一種<strong>非侵襲性乳癌</strong>，也常被稱為<strong>第 0 期乳癌</strong>。</p>
<p>診斷通常是靠乳房穿刺切片或乳房切除後的病理化驗。有極少數情況(&lt;2–3%)會在第二次手術後病理結果發現<strong>微小侵襲癌(microinvasion)或少量癌細胞</strong>，在這些情況下，就需要進一步針對淋巴結取樣，以確定癌細胞沒有擴散到淋巴結。</p>
<p>不過，如果第二次手術後病理結果還是原位癌，則大多數不會有淋巴轉移的情形，因此不一定需要進行淋巴結取樣。</p>
<p>那麼，當您被診斷為乳房原位癌後，可能正在思考：「<strong>我應該選擇部分乳房切除就好，還是要在同一次手術當中一起進行前哨淋巴切片？</strong>」。</p>
<p>這裡沒有正確答案，我會一步一步地引導您，幫您釐清您自己在意的事情。</p>
<p>填完之後，我會根據您的回答，幫您整理出適合您的資訊，讓您更知道自己適合什麼樣的手術。</p>
<p>準備好了嗎？那我們就一起開始吧！</p>
`;
