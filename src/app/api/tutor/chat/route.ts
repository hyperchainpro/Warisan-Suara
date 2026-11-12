import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tutorChat, TutorMessage } from "@/lib/ai";

// POST /api/tutor/chat
// Body: { messages: TutorMessage[], languageCode: string, sessionId?: string, deviceId?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      languageCode,
      sessionId,
      deviceId = "anon",
    } = body as {
      messages?: TutorMessage[];
      languageCode?: string;
      sessionId?: string;
      deviceId?: string;
    };

    if (!messages || !languageCode) {
      return NextResponse.json(
        { error: "messages dan languageCode diperlukan" },
        { status: 400 }
      );
    }

    const lang = await db.language.findUnique({
      where: { code: languageCode },
      select: { id: true, name: true, greetingText: true },
    });
    if (!lang) {
      return NextResponse.json(
        { error: "Bahasa tidak ditemukan" },
        { status: 404 }
      );
    }

    const result = await tutorChat(messages, lang.name, lang.greetingText);

    // Persist session (or create new one)
    const updatedMessages = [
      ...messages,
      { role: "assistant" as const, content: result.reply },
    ];
    if (sessionId) {
      await db.tutorSession.update({
        where: { id: sessionId },
        data: { messagesJson: JSON.stringify(updatedMessages) },
      });
    } else {
      const session = await db.tutorSession.create({
        data: {
          languageId: lang.id,
          deviceId,
          messagesJson: JSON.stringify(updatedMessages),
        },
      });
      return NextResponse.json({
        ...result,
        sessionId: session.id,
      });
    }

    await db.aiUsageLog.create({
      data: {
        feature: "tutor",
        languageId: lang.id,
        deviceId,
        durationMs: result.durationMs,
        success: Boolean(result.reply),
      },
    });

    return NextResponse.json({
      ...result,
      sessionId,
    });
  } catch (err) {
    console.error("POST /api/tutor/chat error:", err);
    return NextResponse.json(
      { error: "Gagal memproses percakapan" },
      { status: 500 }
    );
  }
}
