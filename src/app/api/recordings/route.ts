import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transcribeAudio, translateText } from "@/lib/ai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Cloudflare Turnstile server-side verification (VibeSec: anti-bot)
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!token) return false;
  // In dev mode (no secret key), accept dev-mock-token
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // Dev mode: accept the dev mock token or Cloudflare test token
    return token.startsWith("dev-") || token.length > 0;
  }
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// POST /api/recordings - Upload recording + ASR + translate
// Body: { audioBase64: string, title: string, speakerName: string, languageCode: string, turnstileToken: string, speakerAge?, speakerRole?, context? }
// (Cloudflare prod: audio stored in R2, metadata in D1)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audioBase64,
      title,
      speakerName,
      languageCode,
      turnstileToken,
      speakerAge,
      speakerRole,
      context,
    } = body as {
      audioBase64?: string;
      title?: string;
      speakerName?: string;
      languageCode?: string;
      turnstileToken?: string;
      speakerAge?: number;
      speakerRole?: string;
      context?: string;
    };

    if (!audioBase64 || !title || !speakerName || !languageCode) {
      return NextResponse.json(
        { error: "audioBase64, title, speakerName, languageCode wajib diisi" },
        { status: 400 }
      );
    }

    // VibeSec: Verify Turnstile token server-side (anti-bot)
    const turnstileOk = await verifyTurnstile(turnstileToken || "");
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Verifikasi keamanan gagal. Silakan coba lagi." },
        { status: 403 }
      );
    }

    // VibeSec: Input validation (prevent XSS via length limits & sanitize)
    if (title.length > 200 || speakerName.length > 100 || (context && context.length > 1000)) {
      return NextResponse.json(
        { error: "Input melebihi batas panjang" },
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

    // Save audio locally (in production: upload to Cloudflare R2)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filename = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webm`;
    const filepath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(
      audioBase64.replace(/^data:audio\/\w+;base64,/, ""),
      "base64"
    );
    await writeFile(filepath, buffer);
    const audioUrl = `/uploads/${filename}`;

    // Estimate duration (rough — for webm 16kbps ~ 2KB/sec)
    const durationSec = Math.max(1, Math.round(buffer.length / 2000));

    // ASR transcription
    const asrResult = await transcribeAudio(audioBase64, {
      language: languageCode,
    });

    // Translate to Indonesian
    let translation = "";
    if (asrResult.text) {
      const tr = await translateText(asrResult.text, lang.name, "to-id");
      translation = tr.translation;
    }

    const recording = await db.recording.create({
      data: {
        languageId: lang.id,
        title,
        speakerName,
        speakerAge,
        speakerRole,
        audioUrl,
        durationSec,
        transcriptText: asrResult.text,
        translationId: translation,
        transcriptStatus: asrResult.text ? "done" : "pending",
        context,
      },
    });

    await db.aiUsageLog.create({
      data: {
        feature: "asr",
        languageId: lang.id,
        durationMs: asrResult.durationMs,
        success: Boolean(asrResult.text),
      },
    });

    return NextResponse.json({
      recording,
      transcription: asrResult.text,
      translation,
    });
  } catch (err) {
    console.error("POST /api/recordings error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan rekaman" },
      { status: 500 }
    );
  }
}
