import { NextRequest, NextResponse } from "next/server";
import {
  OUT_OF_SCOPE_MESSAGE,
  WHATSAPP_URL,
  buildPortfolioSystemPrompt,
  getLocalPortfolioAnswer,
  isPortfolioQuestion,
} from "@/lib/portfolioAssistant";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

const requests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(key: string) {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function extractResponseText(response: OpenAIResponse) {
  return response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { message: "Please wait a moment before sending another message." },
      { status: 429 },
    );
  }

  let body: { message?: unknown; locale?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 800) : "";
  const locale = typeof body.locale === "string" ? body.locale : "en";
  const history = Array.isArray(body.history)
    ? (body.history as ChatMessage[])
        .filter(
          (item) =>
            (item?.role === "user" || item?.role === "assistant") &&
            typeof item?.content === "string",
        )
        .slice(-6)
        .map((item) => ({ role: item.role, content: item.content.slice(0, 800) }))
    : [];

  if (!message) {
    return NextResponse.json({ message: "Please enter a question." }, { status: 400 });
  }

  const hasPortfolioHistory = history.some(
    (item) => item.role === "user" && isPortfolioQuestion(item.content),
  );
  if (!isPortfolioQuestion(message, hasPortfolioHistory)) {
    return NextResponse.json({
      reply: `${OUT_OF_SCOPE_MESSAGE} Feel free to contact me on WhatsApp for anything related to my work and services.`,
      outOfScope: true,
      whatsappUrl: WHATSAPP_URL,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: getLocalPortfolioAnswer(message, locale),
      outOfScope: false,
      source: "portfolio-knowledge",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        instructions: buildPortfolioSystemPrompt(locale),
        input: [...history, { role: "user", content: message }],
        max_output_tokens: 350,
        store: false,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const reply = extractResponseText((await response.json()) as OpenAIResponse);
    if (!reply) throw new Error("AI provider returned an empty response");

    return NextResponse.json({ reply, outOfScope: false, source: "openai" });
  } catch {
    return NextResponse.json({
      reply: getLocalPortfolioAnswer(message, locale),
      outOfScope: false,
      source: "portfolio-knowledge",
    });
  }
}
