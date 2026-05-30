// src/components/utils/googleSheetLogger.js

const GSHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbwqPggo1xUr1_kg3cINCValfDip4lf9SBXImgbeW47snxhEB8jNzhk_SSNIWS7uB_0iTQ/exec";

export async function saveToSheet(logData) {
  try {
    await fetch(GSHEETS_API_URL, {
      method: "POST",
      mode: "no-cors", // ✅ 加這行
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(logData),
    });
    console.log("saveToSheet 送出成功");
    return { status: "success" };
  } catch (err) {
    console.error("saveToSheet 失敗:", err);
    return { status: "error" };
  }
}
