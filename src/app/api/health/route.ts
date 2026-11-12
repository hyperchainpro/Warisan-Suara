import { NextResponse } from "next/server";
import { cfHealthCheck } from "@/lib/cloudflare";
import { AI_PROVIDER } from "@/lib/ai";

// GET /api/health - Cloudflare integration health check
export async function GET() {
  const useCf = process.env.USE_CLOUDFLARE_AI === "1";
  let cfStatus: any = null;
  if (useCf) {
    try {
      cfStatus = await cfHealthCheck();
    } catch (err) {
      cfStatus = { error: String(err) };
    }
  }
  return NextResponse.json({
    status: "ok",
    aiProvider: AI_PROVIDER,
    useCloudflare: useCf,
    cloudflare: cfStatus,
    resources: {
      d1: {
        name: process.env.CF_D1_DATABASE_NAME,
        uuid: process.env.CF_D1_DATABASE_UUID,
      },
      kv: {
        namespaceId: process.env.CF_KV_NAMESPACE_ID,
      },
      r2: {
        bucket: process.env.CF_R2_BUCKET,
        enabled: Boolean(process.env.CF_R2_ACCESS_KEY_ID),
      },
      workersAi: {
        llm: process.env.CF_AI_LLM,
        asr: process.env.CF_AI_ASR,
        tts: process.env.CF_AI_TTS,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
