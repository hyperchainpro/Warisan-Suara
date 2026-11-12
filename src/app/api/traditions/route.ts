import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/traditions - list oral traditions, filter by ?type= or ?languageCode=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const languageCode = searchParams.get("languageCode");

    const traditions = await db.oralTradition.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(languageCode ? { language: { code: languageCode } } : {}),
      },
      include: {
        language: {
          select: { code: true, name: true, region: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ traditions });
  } catch (err) {
    console.error("GET /api/traditions error:", err);
    return NextResponse.json(
      { error: "Gagal memuat tradisi lisan" },
      { status: 500 }
    );
  }
}
