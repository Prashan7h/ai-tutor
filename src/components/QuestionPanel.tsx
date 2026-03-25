"use client";

import { Question } from "@/types";

interface Props {
  question: Question;
}

function renderInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  // Process bold (**text**), then inline code (`text`)
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-semibold text-zinc-800">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={match.index}
          className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono text-rose-600"
        >
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default function QuestionPanel({ question }: Props) {
  const sections = question.description.split("```");

  return (
    <div className="p-5 border-b border-zinc-200 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl font-bold text-zinc-900">{question.title}</h2>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            question.difficulty === "easy"
              ? "bg-green-100 text-green-700"
              : question.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {question.difficulty}
        </span>
      </div>
      <div className="text-sm text-zinc-600 leading-relaxed">
        {sections.map((part, i) => {
          if (i % 2 === 1) {
            // Code block
            return (
              <pre
                key={i}
                className="bg-zinc-100 rounded-md p-3 my-2 font-mono text-xs text-zinc-800 overflow-x-auto"
              >
                {part.replace(/^[a-z]*\n/, "")}
              </pre>
            );
          }
          // Regular text — split by newlines and render inline markdown
          return (
            <span key={i}>
              {part.split("\n").map((line, li) => (
                <span key={li}>
                  {li > 0 && <br />}
                  {renderInlineMarkdown(line)}
                </span>
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
}
