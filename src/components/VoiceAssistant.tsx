"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import AudioPlayer from "./AudioPlayer";

interface Props {
  messages: ChatMessage[];
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  isSupported: boolean;
  audioUrl: string | null;
  onAudioEnded: () => void;
  onToggleListening: () => void;
}

export default function VoiceAssistant({
  messages,
  isProcessing,
  isListening,
  isSpeaking,
  transcript,
  isSupported,
  audioUrl,
  onAudioEnded,
  onToggleListening,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const statusText = isSpeaking
    ? "Speaking..."
    : isListening
      ? "Listening..."
      : isProcessing
        ? "Thinking..."
        : "Tap the mic to talk";

  return (
    <div className="w-[380px] flex-shrink-0 bg-zinc-900 border-l border-zinc-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h3 className="font-semibold text-white">Archie</h3>
            <span className="text-xs text-zinc-400">Your science tutor</span>
          </div>
        </div>
      </div>

      {/* Chat transcript (subtle, secondary to voice) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 text-sm mt-8 px-4">
            <p className="mb-2">Pick an answer on the left, then we'll chat about it!</p>
            <p className="text-xs text-zinc-600">All conversations are voice-based</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-md"
                  : "bg-zinc-800 text-zinc-200 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        {isListening && transcript && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-violet-900 text-violet-200 italic">
              {transcript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice control area */}
      <div className="p-6 border-t border-zinc-700 flex flex-col items-center gap-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isSpeaking
                ? "bg-blue-400 animate-pulse"
                : isListening
                  ? "bg-red-400 animate-pulse"
                  : isProcessing
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-zinc-600"
            }`}
          />
          <span className="text-xs text-zinc-400">{statusText}</span>
        </div>

        {/* Big mic button */}
        <button
          onClick={onToggleListening}
          disabled={!isSupported || isProcessing || isSpeaking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isListening
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110 animate-pulse"
              : "bg-violet-600 text-white hover:bg-violet-500 hover:scale-105"
          }`}
          title={isListening ? "Stop listening" : "Start talking"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>

        {!isSupported && (
          <p className="text-xs text-amber-400 text-center">
            Voice requires Chrome browser
          </p>
        )}
      </div>

      <AudioPlayer audioUrl={audioUrl} onEnded={onAudioEnded} />
    </div>
  );
}
