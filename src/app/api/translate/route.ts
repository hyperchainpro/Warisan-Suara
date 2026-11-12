import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { translateText } from "@/lib/ai";

// POST /api/translate
// Body: { text: string, languageCode: string, direction?: 'to-id' | 'to-daerah' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, languageCode, direction = "to-id" } = body as {
      text?: string;
      languageCode?: string;
      direction?: "to-id" | "to-daerah";
    };

    if (!text || !languageCode) {
      return NextResponse.json(
        { error: "text dan languageCode diperlukan" },
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

    const result = await translateText(text, lang.name, direction);

    await db.aiUsageLog.create({
      data: {
        feature: "translate",
        languageId: lang.id,
        durationMs: result.durationMs,
        success: Boolean(result.translation),
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/translate error:", err);
    return NextResponse.json(
      { error: "Gagal menerjemahkan" },
      { status: 500 }
    );
  }
}
