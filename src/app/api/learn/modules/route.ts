import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/learn/modules?languageCode=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const languageCode = searchParams.get("languageCode");

    const modules = await db.learningModule.findMany({
      where: languageCode ? { language: { code: languageCode } } : {},
      include: { language: { select: { code: true, name: true } } },
      orderBy: [{ languageId: "asc" }, { orderIdx: "asc" }],
    });
    return NextResponse.json({ modules });
  } catch (err) {
    console.error("GET /api/learn/modules error:", err);
    return NextResponse.json(
      { error: "Gagal memuat modul belajar" },
      { status: 500 }
    );
  }
}
