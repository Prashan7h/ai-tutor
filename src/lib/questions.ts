import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "q1",
    title: "Free Fall in a Vacuum",
    scenario:
      "Imagine you're in a giant vacuum chamber — there's absolutely no air inside. You hold a feather in one hand and a basketball in the other. You let go of both at the exact same time from the same height.",
    prompt: "Which one hits the ground first?",
    options: [
      {
        id: "feather",
        label: "The Feather",
        image: "/feather.svg",
      },
      {
        id: "basketball",
        label: "The Basketball",
        image: "/basketball.svg",
      },
      {
        id: "same",
        label: "They land at the same time",
        image: "/both.svg",
      },
    ],
    correctOptionId: "same",
    explanation:
      "In a vacuum, there is no air resistance. The only force acting on both objects is gravity. Galileo discovered that all objects fall at the same rate regardless of their mass when air resistance is removed. The acceleration due to gravity (about 9.8 m/s²) is the same for every object. So the feather and basketball hit the ground at exactly the same time! This was famously demonstrated on the Moon by Apollo 15 astronaut David Scott with a hammer and a feather.",
  },
];

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getAllQuestions(): Question[] {
  return questions;
}
