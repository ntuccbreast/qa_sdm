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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

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
