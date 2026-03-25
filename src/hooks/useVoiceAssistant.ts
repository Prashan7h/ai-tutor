"use client";

import { useState, useCallback } from "react";
import { ChatMessage, Question } from "@/types";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useTextToSpeech } from "./useTextToSpeech";

export function useVoiceAssistant(question: Question) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { isListening, transcript, isSupported, startListening, stopListening } =
    useSpeechRecognition();
  const { isSpeaking, audioUrl, speak, onAudioEnded } = useTextToSpeech();

  const sendToApi = useCallback(
    async (allMessages: ChatMessage[], answer?: string) => {
      setIsProcessing(true);

      try {
        const apiMessages = allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            question: {
              title: question.title,
              scenario: question.scenario,
              prompt: question.prompt,
              correctOptionId: question.correctOptionId,
              explanation: question.explanation,
            },
            selectedAnswer: answer || selectedAnswer,
          }),
        });

        if (!response.ok) throw new Error("Chat request failed");

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        speak(data.reply);
      } catch (error) {
        console.error("Voice assistant error:", error);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Hmm, I had a little trouble there. Try talking to me again!",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [question, selectedAnswer, speak]
  );

  const handleAnswer = useCallback(
    async (optionId: string, optionLabel: string) => {
      setSelectedAnswer(optionId);
      setHasAnswered(true);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `I think the answer is: ${optionLabel}`,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      await sendToApi(newMessages, optionId);
    },
    [messages, sendToApi]
  );

  const sendVoiceMessage = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      await sendToApi(newMessages);
    },
    [messages, sendToApi]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        sendVoiceMessage(text);
      });
    }
  }, [isListening, startListening, stopListening, sendVoiceMessage]);

  return {
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
  };
}
