import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { explainCulturalContext } from "@/lib/ai";

// POST /api/explain - explain cultural context of a phrase
// Body: { phrase: string, languageCode: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phrase, languageCode } = body as {
      phrase?: string;
      languageCode?: string;
    };

    if (!phrase || !languageCode) {
      return NextResponse.json(
        { error: "phrase dan languageCode diperlukan" },
        { status: 400 }
      );
    }

    const lang = await db.language.findUnique({
      where: { code: languageCode },
      select: { id: true, name: true },
    });
    if (!lang) {
      return NextResponse.json(
        { error: "Bahasa tidak ditemukan" },
        { status: 404 }
      );
    }

    const result = await explainCulturalContext(phrase, lang.name);

    await db.aiUsageLog.create({
      data: {
        feature: "explain",
        languageId: lang.id,
        durationMs: result.durationMs,
        success: Boolean(result.explanation),
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/explain error:", err);
    return NextResponse.json(
      { error: "Gagal menjelaskan konteks" },
      { status: 500 }
    );
  }
}
