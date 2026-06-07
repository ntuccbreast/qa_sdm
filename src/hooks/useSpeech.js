// src/hooks/useSpeech.js
import { useRef, useCallback } from "react";

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Pre-build phrases with their char ranges so onboundary can display the full
// current phrase instead of a forward-slice that shrinks near the end.
const buildPhrases = (cleanText) => {
  const segments = cleanText.match(/[^。？！，、；]+[。？！，、；]?/g) || [cleanText];
  const phrases = [];
  let offset = 0;
  for (const seg of segments) {
    const t = seg.trim();
    if (!t) { offset += seg.length; continue; }
    const start = cleanText.indexOf(t, offset);
    const end = start + t.length;
    if (t.length > 18) {
      for (let i = 0; i < t.length; i += 18) {
        const chunk = t.slice(i, Math.min(i + 18, t.length));
        phrases.push({ text: chunk, start: start + i, end: start + i + chunk.length });
      }
    } else {
      phrases.push({ text: t, start, end });
    }
    offset = end;
  }
  return phrases;
};

// Measured chars/sec for zh-TW TTS on iOS at rate=1.0.
// Raise this number if subtitles lag behind audio; lower if they run ahead.
const IOS_CHARS_PER_SEC = 4.2;

export function useSpeech() {
  const keepAliveRef = useRef(null);
  const onSubtitleRef = useRef(null);
  const phrasesRef = useRef([]);
  const iosIntervalRef = useRef(null);
  // Tracks char position corrections coming from onboundary events
  const iosCorrectedCharRef = useRef(-1);

  const clearKeepAlive = () => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  };
  const startKeepAlive = () => {
    clearKeepAlive();
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 9000);
  };

  const clearIosTimers = () => {
    if (iosIntervalRef.current) { clearInterval(iosIntervalRef.current); iosIntervalRef.current = null; }
  };

  // Subtitle sync for iOS where onboundary is unreliable for zh-TW.
  // Polls every 100ms, tracking real (non-paused) elapsed time.
  // When onboundary does fire with a valid charIndex, we use it to
  // correct the estimated position so drift doesn't accumulate.
  const scheduleIosSubtitles = (rate) => {
    clearIosTimers();
    iosCorrectedCharRef.current = -1;
    let elapsed = 0;
    let lastTick = Date.now();
    let lastPhraseText = null;

    iosIntervalRef.current = setInterval(() => {
      const now = Date.now();
      if (!window.speechSynthesis.paused) {
        elapsed += (now - lastTick) / 1000;
      }
      lastTick = now;

      const estimated = Math.floor(elapsed * IOS_CHARS_PER_SEC * (rate || 1.0));
      // If onboundary gave us a correction, use whichever is further ahead
      const charPos = iosCorrectedCharRef.current > estimated
        ? iosCorrectedCharRef.current
        : estimated;

      const phrase =
        phrasesRef.current.find((p) => charPos >= p.start && charPos < p.end) ??
        (charPos >= (phrasesRef.current[phrasesRef.current.length - 1]?.start ?? 0)
          ? phrasesRef.current[phrasesRef.current.length - 1]
          : phrasesRef.current[0]);

      if (phrase && phrase.text !== lastPhraseText) {
        lastPhraseText = phrase.text;
        onSubtitleRef.current?.(phrase.text);
      }
    }, 100);
  };

  const speak = useCallback(({ text, lang = "zh-TW", rate = 1.0, onStart, onSubtitle, onEnd, onError }) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    clearKeepAlive();
    onSubtitleRef.current = onSubtitle || null;
    const cleanText = text.replace(/<[^>]*>/g, "");
    phrasesRef.current = buildPhrases(cleanText);

    const doSpeak = () => {
      // Use clean text so charIndex aligns exactly with our phrase ranges
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = rate;

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
        if (isIOS()) {
          // Always use polling loop on iOS — onboundary is unreliable for zh-TW.
          // onboundary events (when they do fire) will correct the estimate.
          scheduleIosSubtitles(rate);
        }
      };

      utterance.onboundary = (e) => {
        if (e.name !== "word" && e.name !== "sentence") return;
        const idx = e.charIndex;
        if (isIOS()) {
          // On iOS: only use charIndex to correct the polling loop's forward estimate.
          // Never call onSubtitle directly here — spurious low-index events would
          // snap the subtitle back to the first phrase mid-speech.
          if (idx > iosCorrectedCharRef.current) iosCorrectedCharRef.current = idx;
          return;
        }
        const phrase =
          phrasesRef.current.find((p) => idx >= p.start && idx < p.end) ??
          phrasesRef.current[phrasesRef.current.length - 1];
        if (phrase) onSubtitleRef.current?.(phrase.text);
      };

      utterance.onend = () => {
        clearKeepAlive();
        clearIosTimers();
        onSubtitleRef.current?.("");
        onEnd?.();
      };

      utterance.onerror = (e) => {
        clearKeepAlive();
        clearIosTimers();
        onSubtitleRef.current?.("");
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
    };

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
    clearIosTimers();
    onSubtitleRef.current?.("");
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
