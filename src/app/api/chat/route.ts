import { getClaudeClient } from "@/lib/claude";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages, question, selectedAnswer } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const client = getClaudeClient();

    const systemPrompt = `You are a friendly, enthusiastic science tutor for high school students. Your name is Archie (short for Archimedes).

You're helping a student with this question:
**${question?.title || "Science Question"}**

Scenario: ${question?.scenario || ""}
Question: ${question?.prompt || ""}
The correct answer: "${question?.correctOptionId || ""}"
Full explanation: ${question?.explanation || ""}

${selectedAnswer ? `The student just selected: "${selectedAnswer}"` : ""}

Your teaching style:
- You're voice-only, so keep responses SHORT (2-3 sentences max). They will be read aloud.
- Be expressive and conversational — use natural speech patterns like "Ooh!", "Hmm...", "That's interesting!", "Aha!"
- Use the Socratic method: ask questions to guide the student to the answer, don't just tell them
- If they got it WRONG: React with curiosity, not disappointment. Say something like "Interesting choice! Let me ask you something..." then ask a guiding question
- If they got it RIGHT: Celebrate! Then ask them to explain WHY, to make sure they understand the reasoning
- Keep the conversation going until the student demonstrates understanding of the core concept
- Use everyday analogies and simple language
- Never be condescending or make the student feel dumb`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 250,
      system: systemPrompt,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from assistant" },
      { status: 500 }
    );
  }
}
