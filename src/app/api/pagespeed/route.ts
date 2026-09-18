import { NextResponse } from "next/server";

const PAGE_URL = "https://rashaduldev.vercel.app";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;

type Strategy = "mobile" | "desktop";
type LighthouseCategory = { score?: number | null };

async function runAudit(strategy: Strategy) {
  const params = new URLSearchParams({ url: PAGE_URL, strategy });
  CATEGORIES.forEach((category) => params.append("category", category));

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (apiKey) params.set("key", apiKey);

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    { next: { revalidate: 21600 } },
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(error?.error?.message || `PageSpeed returned ${response.status}`);
  }

  const data = (await response.json()) as {
    lighthouseResult?: {
      fetchTime?: string;
      categories?: Record<string, LighthouseCategory>;
    };
  };
  const categories = data.lighthouseResult?.categories;

  if (!categories) throw new Error("PageSpeed scores were missing from the response");

  const score = (category: string) => {
    const value = categories[category]?.score;
    return typeof value === "number" ? Math.round(value * 100) : null;
  };

  return {
    strategy,
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    auditedAt: data.lighthouseResult?.fetchTime || new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const [mobile, desktop] = await Promise.all([
      runAudit("mobile"),
      runAudit("desktop"),
    ]);

    return NextResponse.json({
      url: PAGE_URL,
      source: "Google PageSpeed Insights",
      mobile,
      desktop,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "PageSpeed Insights is temporarily unavailable",
      },
      { status: 503 },
    );
  }
}
