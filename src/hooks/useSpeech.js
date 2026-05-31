// src/hooks/useSpeech.js
// 解決 iOS Safari speechSynthesis 長文字中斷的 bug

import { useRef, useCallback } from "react";

export function useSpeech() {
  const intervalRef = useRef(null);

  const clearKeepAlive = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // iOS Safari bug fix：每 10 秒暫停再繼續，防止語音自動中斷
  const startKeepAlive = () => {
    clearKeepAlive();
    intervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const speak = useCallback(({ text, lang = "zh-TW", rate = 1.0, onStart, onBoundary, onEnd, onError }) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    clearKeepAlive();

    // ✅ 修正：實際建立並發音的函式，確保 voices 已載入後才執行
    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // ✅ 修正：明確選取中文語音
      // iOS Safari 系統語言為英文時，若不指定 voice 會 fallback 成英文朗讀
      const voices = window.speechSynthesis.getVoices();
      const zhVoice =
        voices.find((v) => v.lang === "zh-TW") ||
        voices.find((v) => v.lang === "zh-HK") ||
        voices.find((v) => v.lang === "zh-CN") ||
        voices.find((v) => v.lang.startsWith("zh"));
      if (zhVoice) utterance.voice = zhVoice;

      utterance.onstart = () => {
        startKeepAlive();
        onStart?.();
      };

      utterance.onboundary = (e) => {
        onBoundary?.(e);
      };

      utterance.onend = () => {
        clearKeepAlive();
        onEnd?.();
      };

      utterance.onerror = (e) => {
        clearKeepAlive();
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
    };

    // ✅ 修正：iOS Safari 的 getVoices() 是非同步的
    // 若 voices 尚未載入完成，需等 onvoiceschanged 再執行
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  }, []);

  const cancel = useCallback(() => {
    clearKeepAlive();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.resume();
  }, []);

  return { speak, cancel, pause, resume };
}
