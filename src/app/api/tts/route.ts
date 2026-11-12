import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { synthesizeSpeech } from "@/lib/ai";

// POST /api/tts - Text to Speech
// Body: { text: string, voice?: string, languageCode?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice, languageCode } = body as {
      text?: string;
      voice?: string;
      languageCode?: string;
    };

    if (!text) {
      return NextResponse.json(
        { error: "text diperlukan" },
        { status: 400 }
      );
    }

    const result = await synthesizeSpeech(text, voice);

    await db.aiUsageLog.create({
      data: {
        feature: "tts",
        languageId: languageCode
          ? (await db.language.findUnique({
              where: { code: languageCode },
              select: { id: true },
            }))?.id
          : null,
        durationMs: result.durationMs,
        success: Boolean(result.audioBase64),
      },
    });

    return NextResponse.json({
      audioBase64: result.audioBase64,
      format: result.format,
      durationMs: result.durationMs,
    });
  } catch (err) {
    console.error("POST /api/tts error:", err);
    return NextResponse.json(
      { error: "Gagal membuat audio" },
      { status: 500 }
    );
  }
}
