import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/languages/[code] - detail bahasa + traditions + modules
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const language = await db.language.findUnique({
      where: { code },
      include: {
        traditions: {
          orderBy: { createdAt: "desc" },
        },
        modules: {
          orderBy: { orderIdx: "asc" },
        },
        recordings: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
    if (!language) {
      return NextResponse.json(
        { error: "Bahasa tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ language });
  } catch (err) {
    console.error("GET /api/languages/[code] error:", err);
    return NextResponse.json(
      { error: "Gagal memuat detail bahasa" },
      { status: 500 }
    );
  }
}
