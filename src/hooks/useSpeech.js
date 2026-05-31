// src/hooks/useSpeech.js
// 解決 iOS Safari speechSynthesis 長文字中斷 + onboundary 不觸發的 bug

import { useRef, useCallback } from "react";

export function useSpeech() {
  const intervalRef = useRef(null);
  const keepAliveRef = useRef(null);

  const clearKeepAlive = () => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const clearSubtitleTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // iOS Safari bug fix：每 9 秒暫停再繼續，防止語音自動中斷
  const startKeepAlive = () => {
    clearKeepAlive();
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 9000);
  };

  const speak = useCallback(({
    text,
    lang = "zh-TW",
    rate = 1.0,
    onStart,
    onBoundary,
    onEnd,
    onError,
  }) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    clearKeepAlive();
    clearSubtitleTimer();

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // ✅ 明確選取中文語音
      const voices = window.speechSynthesis.getVoices();
      const zhVoice =
        voices.find((v) => v.lang === "zh-TW") ||
        voices.find((v) => v.lang === "zh-HK") ||
        voices.find((v) => v.lang === "zh-CN") ||
        voices.find((v) => v.lang.startsWith("zh"));
      if (zhVoice) utterance.voice = zhVoice;

      utterance.onstart = () => {
        startKeepAlive();

        // ✅ iOS onboundary 不觸發的 workaround：用計時器模擬字幕進度
        // 中文語音約每秒讀 4~5 個字，rate=1.0 時約 4.5字/秒
        if (onBoundary) {
          const charsPerSecond = 4.5 * rate;
          const startTime = Date.now();

          intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const charIndex = Math.floor(elapsed * charsPerSecond);
            if (charIndex < text.length) {
              onBoundary({ charIndex });
            } else {
              clearSubtitleTimer();
            }
          }, 150); // 每 150ms 更新一次，夠順暢又不耗效能
        }

        onStart?.();
      };

      // onboundary：桌機瀏覽器正常觸發時直接用，iOS 上不會觸發所以無影響
      utterance.onboundary = (e) => {
        onBoundary?.(e);
      };

      utterance.onend = () => {
        clearKeepAlive();
        clearSubtitleTimer();
        onEnd?.();
      };

      utterance.onerror = (e) => {
        clearKeepAlive();
        clearSubtitleTimer();
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
    };

    // ✅ iOS Safari 的 getVoices() 是非同步的，需等 onvoiceschanged 觸發
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
    clearSubtitleTimer();
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
