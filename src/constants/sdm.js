// src/constants/sdm.js
// Core logic: topic registry and decision-result computation.
// Text content  → sdm.content.js
// Question data → sdm.questions.js
// Image assets  → sdm.assets.js

import hintImages from "./sdm.assets";
import {
  introTextDCIS,
  introAudioDCIS,
  introTextBctSm,
  introAudioBctSm,
} from "./sdm.content";

// Re-export everything consumers previously imported from this file
export { questionsBctSm, questionsDCIS } from "./sdm.questions";
export {
  introText,
  introTextBctSm,
  introTextSTVAB,
  introTextReconstruction,
} from "./sdm.content";

// ── Topic registry ────────────────────────────────────────────────────────────
// Maps topic keys to labels, intro content, hint images, and audio scripts.
// Add new topics here; keep HTML out — reference imports from sdm.content.js.

export const topicDescriptions = {
  dcis: {
    label: "先選擇只接受部分乳房切除手術，還是要一起接受前哨淋巴結切片？",
    description: "適用於診斷為乳房原位癌的病人。",
    content: introTextDCIS,
    hints: {
      cnb_intro: {
        type: "image",
        src: hintImages["cnb"],
        alt: "導引粗針切片原理",
      },
      slnb_intro: {
        type: "image",
        src: hintImages["slnb"],
        alt: "前哨淋巴結切片目的",
      },
    },
    audio: introAudioDCIS,
  },
  bctsm: {
    label: "部分乳房切除合併前哨淋巴結切片手術，還是全乳房切除合併前哨淋巴結切片手術？",
    description: "適用於診斷為乳房原位癌或乳癌的病人。",
    content: introTextBctSm,
    audio: introAudioBctSm,
  },
  /*
  stvab: {
    label: "乳房微創手術，還是傳統手術？",
    description: "適用於乳房良性腫瘤或有疑似鈣化點的病人。",
    content: introTextSTVAB,
  },
  reconstruction: {
    label: "要在乳房切除當下，還是等治療追蹤穩定後再進行重建？",
    description: "適用於乳房切除後希望進行乳房重建的病人。",
    content: introTextReconstruction,
  },
  */
};

// ── Decision logic ────────────────────────────────────────────────────────────
// Pure function: maps BCT vs SM questionnaire answers to a recommendation.
// Inputs: finalAnswers — { [questionId]: selectedLabel }
// Output: { type: "BCT"|"SM", title: string, description: string }

export const getBctSmResult = (finalAnswers) => {
  // Updated IDs: Q_BREAST_IMAGE, BCT_A2_MARGIN_LN, BCT_A5_RADIATION, Q_RECONSTRUCTION_FEEL
  const isAppearanceImportant = finalAnswers["Q_BREAST_IMAGE"]?.includes("很重要");
  const isWantRecon = finalAnswers["Q_RECONSTRUCTION_FEEL"]?.includes("有意願");
  const isAcceptingReop = finalAnswers["BCT_A2_MARGIN_LN"]?.includes("可以接受");
  const isRejectingRad = finalAnswers["BCT_A5_RADIATION"]?.includes("壓力");

  const reconSuffix = isWantRecon || isAppearanceImportant ? "合併重建" : "";

  // Case 1: rejects radiation → SM (BCT侵襲性幾乎必做放療)
  if (isRejectingRad) {
    return {
      type: "SM",
      title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description:
        "由於您對<b>放射線治療</b>有較多顧慮，而「部分乳房切除手術」侵襲性乳癌幾乎必須搭配放療。因此，選擇全乳房切除能避開長期的放療療程與副作用，較符合您的需求。",
    };
  }

  // Case 2: appearance matters (radiation already accepted above)
  if (isAppearanceImportant) {
    if (isAcceptingReop) {
      return {
        type: "BCT",
        title: `建議方案：部分乳房切除及前哨淋巴結切片手術${reconSuffix}`,
        description:
          "您在意乳房外觀，且願意承擔因邊緣不乾淨而需要再次手術的可能性與配合放療。<b>部分乳房切除</b>能最大程度保留您的自然胸型，是您的理想選擇。",
      };
    }
    // Wants appearance preserved but refuses re-operation → SM + reconstruction
    return {
      type: "SM",
      title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
      description:
        "您雖然在意乳房外觀，但不希望承擔因邊緣不乾淨而需要再次手術的可能性。全乳房切除可以確保邊緣乾淨，若搭配<b>乳房重建</b>，可同時滿足您對外觀的要求。",
    };
  }

  // Case 3: appearance not a priority → SM for simplicity
  return {
    type: "SM",
    title: `建議方案：全乳房切除及前哨淋巴結切片手術${reconSuffix}`,
    description:
      "既然外觀不是您的首要考量，<b>全乳房切除</b>可以確保邊緣乾淨，且視病理情況有機會不需進行放射線治療，使治療流程相對簡化、安心。",
  };
};
