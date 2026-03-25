"use client";

import { useState, useCallback, useRef } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const speak = useCallback(async (text: string) => {
    // Clean up previous audio URL
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    setIsSpeaking(true);

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      currentUrlRef.current = url;
      setAudioUrl(url);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsSpeaking(false);
    }
  }, []);

  const onAudioEnded = useCallback(() => {
    setIsSpeaking(false);
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    setAudioUrl(null);
  }, []);

  const stop = useCallback(() => {
    setIsSpeaking(false);
    setAudioUrl(null);
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  return {
    isSpeaking,
    audioUrl,
    speak,
    stop,
    onAudioEnded,
  };
}
