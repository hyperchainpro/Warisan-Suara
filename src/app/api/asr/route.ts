import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transcribeAudio, translateText } from "@/lib/ai";

// POST /api/asr - Speech to Text
// Body: { audio: base64 string, languageCode?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audio, languageCode } = body as {
      audio?: string;
      languageCode?: string;
    };

    if (!audio) {
      return NextResponse.json(
        { error: "Audio diperlukan" },
        { status: 400 }
      );
    }

    let languageName = "Bahasa Daerah";
    if (languageCode) {
      const lang = await db.language.findUnique({
        where: { code: languageCode },
        select: { name: true },
      });
      if (lang) languageName = lang.name;
    }

    const asrResult = await transcribeAudio(audio, {
      language: languageCode,
    });

    // Optional: translate to Indonesian if languageCode provided
    let translation = "";
    if (asrResult.text && languageCode) {
      const tr = await translateText(asrResult.text, languageName, "to-id");
      translation = tr.translation;
    }

    // Log usage (anonymous)
    await db.aiUsageLog.create({
      data: {
        feature: "asr",
        languageId: languageCode ? (await db.language.findUnique({ where: { code: languageCode }, select: { id: true } }))?.id : null,
        durationMs: asrResult.durationMs,
        success: Boolean(asrResult.text),
      },
    });

    return NextResponse.json({
      text: asrResult.text,
      translation,
      language: languageName,
      durationMs: asrResult.durationMs,
    });
  } catch (err) {
    console.error("POST /api/asr error:", err);
    return NextResponse.json(
      { error: "Gagal memproses audio" },
      { status: 500 }
    );
  }
}
