import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/stats - dashboard statistics for showcase
export async function GET() {
  try {
    const [
      totalLanguages,
      totalTraditions,
      totalModules,
      totalRecordings,
      vitalities,
      aiUsage,
    ] = await Promise.all([
      db.language.count(),
      db.oralTradition.count(),
      db.learningModule.count(),
      db.recording.count(),
      db.language.groupBy({
        by: ["vitality"],
        _count: true,
      }),
      db.aiUsageLog.groupBy({
        by: ["feature"],
        _count: true,
      }),
    ]);

    const totalSpeakers = await db.language.aggregate({
      _sum: { speakers: true },
    });

    return NextResponse.json({
      totalLanguages,
      totalTraditions,
      totalModules,
      totalRecordings,
      totalSpeakersCovered: totalSpeakers._sum.speakers ?? 0,
      vitalities: vitalities.reduce((acc, v) => {
        acc[v.vitality] = v._count;
        return acc;
      }, {} as Record<string, number>),
      aiUsage: aiUsage.reduce((acc, u) => {
        acc[u.feature] = u._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      { error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
