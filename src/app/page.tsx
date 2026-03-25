"use client";

import { useState } from "react";
import Image from "next/image";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { questions } from "@/lib/questions";

export default function Home() {
  const [currentQuestionIndex] = useState(0);
  const question = questions[currentQuestionIndex];

  const {
    messages,
    isProcessing,
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    audioUrl,
    onAudioEnded,
    selectedAnswer,
    hasAnswered,
    handleAnswer,
    toggleListening,
  } = useVoiceAssistant(question);

  const isCorrect = selectedAnswer === question.correctOptionId;

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Left panel: Question + Answers */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-zinc-900 text-white flex items-center px-6 flex-shrink-0">
          <h1 className="font-bold text-lg tracking-tight">LearnWithAI</h1>
          <span className="ml-3 text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            Physics
          </span>
        </header>

        {/* Question content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-2xl w-full">
            {/* Scenario */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                {question.title}
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed max-w-lg mx-auto">
                {question.scenario}
              </p>
            </div>

            {/* Question prompt */}
            <div className="mb-8 text-center">
              <p className="text-lg font-semibold text-zinc-800">
                {question.prompt}
              </p>
            </div>

            {/* Answer options as clickable cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showResult = hasAnswered;
                const isThisCorrect = option.id === question.correctOptionId;

                let borderColor = "border-zinc-200 hover:border-violet-400";
                let bgColor = "bg-white hover:bg-violet-50";
                let ringStyle = "";

                if (showResult && isSelected && isThisCorrect) {
                  borderColor = "border-green-400";
                  bgColor = "bg-green-50";
                  ringStyle = "ring-2 ring-green-400";
                } else if (showResult && isSelected && !isThisCorrect) {
                  borderColor = "border-red-300";
                  bgColor = "bg-red-50";
                  ringStyle = "ring-2 ring-red-300";
                } else if (showResult && isThisCorrect) {
                  borderColor = "border-green-300";
                  bgColor = "bg-green-50/50";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      !hasAnswered &&
                      handleAnswer(option.id, option.label)
                    }
                    disabled={hasAnswered}
                    className={`group relative rounded-xl border-2 p-4 transition-all ${borderColor} ${bgColor} ${ringStyle} ${
                      hasAnswered
                        ? "cursor-default"
                        : "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 relative">
                        <Image
                          src={option.image}
                          alt={option.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-semibold text-zinc-700">
                        {option.label}
                      </span>
                    </div>

                    {/* Result indicator */}
                    {showResult && isSelected && (
                      <div
                        className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          isThisCorrect ? "bg-green-500" : "bg-red-400"
                        }`}
                      >
                        {isThisCorrect ? "✓" : "✗"}
                      </div>
                    )}
                    {showResult && !isSelected && isThisCorrect && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold bg-green-500">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-answer message */}
            {hasAnswered && (
              <div className="text-center">
                {isCorrect ? (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    <span>Nice pick!</span>
                    <span className="text-xs text-green-600">
                      Now talk to Archie about why
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                    <span>Not quite!</span>
                    <span className="text-xs text-amber-600">
                      Chat with Archie to figure it out
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Voice-only Assistant */}
      <VoiceAssistant
        messages={messages}
        isProcessing={isProcessing}
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        isSupported={isSupported}
        audioUrl={audioUrl}
        onAudioEnded={onAudioEnded}
        onToggleListening={toggleListening}
      />
    </div>
  );
}
