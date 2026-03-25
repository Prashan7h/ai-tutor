import { getClaudeClient } from "@/lib/claude";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, language, question } = await request.json();

    if (!code || !question) {
      return NextResponse.json(
        { error: "code and question are required" },
        { status: 400 }
      );
    }

    const client = getClaudeClient();

    const testCasesStr = question.testCases
      ?.map(
        (tc: { input: string; expectedOutput: string; description: string }) =>
          `- ${tc.description}: ${tc.input} should return ${tc.expectedOutput}`
      )
      .join("\n");

    const systemPrompt = `You are a code evaluator for a high school programming course. You are warm and encouraging but honest.

Evaluate the student's code against the problem requirements. Analyze the code logic WITHOUT executing it.

Problem: ${question.title}
Description: ${question.description}

Test Cases:
${testCasesStr}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "passed": boolean,
  "feedback": "2-3 sentence encouraging feedback explaining what they did well and what needs fixing. Keep it simple and friendly.",
  "details": [
    { "input": "the test input", "expected": "expected output", "actual": "what their code would produce", "passed": boolean }
  ]
}`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here is my ${language || "javascript"} code:\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    try {
      const result = JSON.parse(responseText);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json({
        passed: false,
        feedback: responseText,
        details: [],
      });
    }
  } catch (error) {
    console.error("Evaluate API error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate code" },
      { status: 500 }
    );
  }
}
