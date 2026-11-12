import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/languages - list all languages
export async function GET() {
  try {
    const languages = await db.language.findMany({
      orderBy: [{ vitality: "asc" }, { speakers: "desc" }],
      include: {
        _count: {
          select: {
            recordings: true,
            traditions: true,
            modules: true,
          },
        },
      },
    });
    return NextResponse.json({ languages });
  } catch (err) {
    console.error("GET /api/languages error:", err);
    return NextResponse.json(
      { error: "Gagal memuat daftar bahasa" },
      { status: 500 }
    );
  }
}
