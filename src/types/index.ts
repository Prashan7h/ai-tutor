export interface AnswerOption {
  id: string;
  label: string;
  image: string; // path to image in /public
}

export interface Question {
  id: string;
  title: string;
  scenario: string; // the setup/story for the question
  prompt: string; // what the student needs to answer
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string; // the full correct explanation for the AI to reference
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
