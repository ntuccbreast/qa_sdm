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
  const iosCorrectedCharRef = useRef(-1);
  // Tracks the last charPos the subtitle showed — so if the iOS interval is
  // spuriously cleared and restarted, it resumes from here instead of phrase 0.
  const iosLastCharRef = useRef(-1);
  // Shared elapsed time and tick timestamp — stored as refs so onboundary can
  // recalibrate them directly, preventing drift from accumulating over long speech.
  const iosElapsedRef = useRef(0);
  const iosLastTickRef = useRef(0);
  // Incremented each time speak() is called; lets onend timeouts detect stale closures
  const utteranceGenRef = useRef(0);

  const clearKeepAlive = () => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  };
  const startKeepAlive = () => {
    clearKeepAlive();
    // On iOS, pause()+resume() can spuriously re-fire onstart/onend, resetting
    // the subtitle loop. iOS 14+ doesn't need keepAlive anyway.
    if (isIOS()) return;
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
  // Polls every 50ms, tracking real (non-paused) elapsed time via refs so that
  // onboundary can recalibrate iosElapsedRef whenever a valid charIndex arrives.
  // This keeps drift bounded to the gap between consecutive boundary events instead
  // of letting it accumulate over the whole speech.
  //
  // If the interval was previously running and got spuriously cleared mid-speech,
  // iosLastCharRef holds the last shown position so we resume from there
  // instead of snapping back to phrase 0 ("您好").
  const scheduleIosSubtitles = (rate) => {
    clearIosTimers();
    iosCorrectedCharRef.current = -1;

    // Resume from last known position if this is a mid-speech restart (spurious iOS event).
    // Fresh speech: iosLastCharRef = -1 → start with startup latency offset.
    const resumeChar = iosLastCharRef.current;
    iosElapsedRef.current = resumeChar >= 0
      ? resumeChar / (IOS_CHARS_PER_SEC * (rate || 1.0))
      : -0.3;
    iosLastTickRef.current = Date.now();

    let lastPhraseText = null;

    iosIntervalRef.current = setInterval(() => {
      const now = Date.now();
      if (!window.speechSynthesis.paused) {
        iosElapsedRef.current += (now - iosLastTickRef.current) / 1000;
      }
      iosLastTickRef.current = now;

      const estimated = Math.floor(iosElapsedRef.current * IOS_CHARS_PER_SEC * (rate || 1.0));
      const charPos = iosCorrectedCharRef.current > estimated
        ? iosCorrectedCharRef.current
        : estimated;

      // Still in startup latency window — don't flash first phrase before audio begins
      if (charPos < 0) return;

      // Track last shown position so a spurious restart can resume from here
      iosLastCharRef.current = charPos;

      const phrase =
        phrasesRef.current.find((p) => charPos >= p.start && charPos < p.end) ??
        (charPos >= (phrasesRef.current[phrasesRef.current.length - 1]?.start ?? 0)
          ? phrasesRef.current[phrasesRef.current.length - 1]
          : phrasesRef.current[0]);

      if (phrase && phrase.text !== lastPhraseText) {
        lastPhraseText = phrase.text;
        onSubtitleRef.current?.(phrase.text);
      }
    }, 50);
  };

  const speak = useCallback(({ text, lang = "zh-TW", rate = 1.0, onStart, onSubtitle, onEnd, onError }) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    clearKeepAlive();
    clearIosTimers(); // ensure clean state so new onstart can always restart the interval
    iosLastCharRef.current = -1; // reset resume position for the new speech
    onSubtitleRef.current = onSubtitle || null;
    const cleanText = text.replace(/<[^>]*>/g, "");
    phrasesRef.current = buildPhrases(cleanText);
    utteranceGenRef.current += 1;
    const myGen = utteranceGenRef.current;

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
        if (isIOS() && !iosIntervalRef.current) {
          // Guard: if interval already running (spurious iOS re-fire of onstart),
          // don't restart — would reset elapsed to 0 mid-speech causing subtitle snap.
          scheduleIosSubtitles(rate);
        }
      };

      utterance.onboundary = (e) => {
        if (e.name !== "word" && e.name !== "sentence") return;
        const idx = e.charIndex;
        if (isIOS()) {
          // On iOS: use charIndex to both advance the floor AND recalibrate elapsed time.
          // Only accept idx if it's strictly advancing (spurious low-index events ignored).
          // Recalibrating iosElapsedRef here means future interval ticks extrapolate from
          // the correct base, bounding drift to the gap between consecutive boundary events.
          if (idx > iosCorrectedCharRef.current) {
            iosCorrectedCharRef.current = idx;
            if (iosIntervalRef.current) {
              iosElapsedRef.current = idx / (IOS_CHARS_PER_SEC * (rate || 1.0));
              iosLastTickRef.current = Date.now();
            }
          }
          return;
        }
        const phrase =
          phrasesRef.current.find((p) => idx >= p.start && idx < p.end) ??
          phrasesRef.current[phrasesRef.current.length - 1];
        if (phrase) onSubtitleRef.current?.(phrase.text);
      };

      utterance.onend = () => {
        clearKeepAlive();
        if (isIOS()) {
          // iOS fires spurious onend mid-speech then continues; use a timeout + gen
          // check to confirm speech truly ended before cleaning up and calling onEnd.
          // This prevents the interval from being cleared mid-speech (which would let
          // the next onstart restart it from elapsed=0, snapping subtitle to phrase 0).
          setTimeout(() => {
            if (utteranceGenRef.current === myGen && !window.speechSynthesis.speaking) {
              clearIosTimers();
              onSubtitleRef.current?.("");
              onEnd?.();
            }
          }, 200);
        } else {
          clearIosTimers();
          onSubtitleRef.current?.("");
          onEnd?.();
        }
      };

      utterance.onerror = (e) => {
        if (e.error === "interrupted") return; // fired when cancel() preempts; not a real error
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
