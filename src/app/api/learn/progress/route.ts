import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/learn/progress?deviceId=&moduleId=
// POST /api/learn/progress { deviceId, moduleId, lessonIdx, completed? }
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");
    if (!deviceId) {
      return NextResponse.json({ progress: [] });
    }
    const progress = await db.userProgress.findMany({
      where: { deviceId },
      include: {
        module: { select: { id: true, title: true, totalLessons: true, languageId: true } },
      },
    });
    return NextResponse.json({ progress });
  } catch (err) {
    console.error("GET /api/learn/progress error:", err);
    return NextResponse.json(
      { error: "Gagal memuat progres" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, moduleId, lessonIdx, completed } = body as {
      deviceId?: string;
      moduleId?: string;
      lessonIdx?: number;
      completed?: boolean;
    };

    if (!deviceId || !moduleId) {
      return NextResponse.json(
        { error: "deviceId dan moduleId diperlukan" },
        { status: 400 }
      );
    }

    const progress = await db.userProgress.upsert({
      where: {
        deviceId_moduleId: { deviceId, moduleId },
      },
      update: {
        lessonIdx: lessonIdx ?? undefined,
        completed: completed ?? undefined,
        lastStudied: new Date(),
      },
      create: {
        deviceId,
        moduleId,
        lessonIdx: lessonIdx ?? 0,
        completed: completed ?? false,
      },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("POST /api/learn/progress error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan progres" },
      { status: 500 }
    );
  }
}
