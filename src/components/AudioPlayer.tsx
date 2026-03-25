"use client";

import { useEffect, useRef } from "react";

interface Props {
  audioUrl: string | null;
  onEnded: () => void;
}

export default function AudioPlayer({ audioUrl, onEnded }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        onEnded();
      });
    }
  }, [audioUrl, onEnded]);

  return (
    <audio
      ref={audioRef}
      onEnded={onEnded}
      onError={onEnded}
      className="hidden"
    />
  );
}
