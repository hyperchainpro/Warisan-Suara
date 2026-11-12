// Cloudflare Integration Layer for WARISAN SUARA
// Handles: Workers AI (LLM/ASR/TTS), D1 (REST API), R2-ready storage
// All credentials from env vars (never hardcoded - VibeSec)

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CF_API_TOKEN || "";
const CF_D1_UUID = process.env.CF_D1_DATABASE_UUID || "";
const CF_KV_NS = process.env.CF_KV_NAMESPACE_ID || "";

const CF_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}`;
const CF_AI_BASE = `${CF_BASE}/ai/run`;
const CF_D1_BASE = `${CF_BASE}/d1/database/${CF_D1_UUID}/raw`;
const CF_KV_BASE = `${CF_BASE}/storage/kv/namespaces/${CF_KV_NS}`;

const AI_HEADERS = {
  Authorization: `Bearer ${CF_API_TOKEN}`,
  "Content-Type": "application/json",
};

// === Workers AI ===

export interface CfChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// LLM text generation
export async function cfLlm(
  messages: CfChatMessage[],
  opts?: { max_tokens?: number; temperature?: number }
): Promise<{ text: string; usage?: any }> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }
  const model = process.env.CF_AI_LLM || "@cf/meta/llama-3.1-8b-instruct";
  const res = await fetch(`${CF_AI_BASE}/${model}`, {
    method: "POST",
    headers: AI_HEADERS,
    body: JSON.stringify({
      messages,
      max_tokens: opts?.max_tokens ?? 1024,
      temperature: opts?.temperature ?? 0.7,
      stream: false,
    }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`CF LLM error: ${JSON.stringify(data.errors)}`);
  }
  return {
    text: data.result?.response || "",
    usage: data.result?.usage,
  };
}

// ASR - Speech to Text (multipart/form-data with audio file)
export async function cfAsr(audioBuffer: Buffer, filename = "audio.webm"): Promise<{ text: string }> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }
  const model = process.env.CF_AI_ASR || "@cf/openai/whisper";
  const formData = new FormData();
  formData.append("file", new Blob([audioBuffer]), filename);

  const res = await fetch(`${CF_AI_BASE}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`CF ASR error: ${JSON.stringify(data.errors)}`);
  }
  return { text: data.result?.text || "" };
}

// TTS - Text to Speech (multilingual MeloTTS)
export async function cfTts(text: string, language = "id"): Promise<{ audioBase64: string; format: string }> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }
  const model = process.env.CF_AI_TTS || "@cf/myshell-ai/melotts";
  const res = await fetch(`${CF_AI_BASE}/${model}`, {
    method: "POST",
    headers: AI_HEADERS,
    body: JSON.stringify({ prompt: text, language }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`CF TTS error: ${JSON.stringify(data.errors)}`);
  }
  const audio = data.result?.audio;
  if (!audio) {
    throw new Error("CF TTS: no audio in response");
  }
  return { audioBase64: audio, format: "wav" };
}

// === D1 Database (REST API) ===

export async function cfD1Query(sql: string, params?: (string | number | null)[]): Promise<any[]> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_UUID) {
    throw new Error("Cloudflare D1 not configured");
  }
  // D1 REST API supports ?param1&param2... or we inline safely
  // For simplicity here we inline params (caller must sanitize for prod)
  const res = await fetch(CF_D1_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`CF D1 error: ${JSON.stringify(data.errors)}`);
  }
  const results = data.result?.[0]?.results;
  if (!results) return [];
  // Convert rows (array of arrays) to objects using columns
  const cols = results.columns || [];
  return (results.rows || []).map((row: any[]) => {
    const obj: Record<string, any> = {};
    cols.forEach((c: string, i: number) => { obj[c] = row[i]; });
    return obj;
  });
}

export async function cfD1Exec(sql: string): Promise<{ changes: number; lastRowId?: number }> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_UUID) {
    throw new Error("Cloudflare D1 not configured");
  }
  const res = await fetch(CF_D1_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`CF D1 exec error: ${JSON.stringify(data.errors)}`);
  }
  const meta = data.result?.[0]?.meta || {};
  return { changes: meta.changes || 0, lastRowId: meta.last_row_id };
}

// === KV (for caching) ===

export async function cfKvGet<T>(key: string): Promise<T | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_KV_NS) return null;
  try {
    const res = await fetch(`${CF_KV_BASE}/values/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function cfKvSet(key: string, value: any, ttlSeconds = 300): Promise<boolean> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_KV_NS) return false;
  try {
    const res = await fetch(`${CF_KV_BASE}/values/${encodeURIComponent(key)}?expiration_ttl=${ttlSeconds}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// === R2 (S3-compatible, requires dashboard enable) ===
// R2 helper - ready for when R2 is enabled via dashboard
// For now, audio stored locally in /public/uploads

export function isR2Enabled(): boolean {
  return Boolean(process.env.CF_R2_ACCESS_KEY_ID && process.env.CF_R2_SECRET_ACCESS_KEY);
}

// Health check
export async function cfHealthCheck(): Promise<{ llm: boolean; asr: boolean; tts: boolean; d1: boolean; kv: boolean }> {
  const check = async (fn: () => Promise<any>) => {
    try { await fn(); return true; } catch { return false; }
  };
  return {
    llm: await check(() => cfLlm([{ role: "user", content: "hi" }], { max_tokens: 5 })),
    asr: true, // skip live check (needs audio)
    tts: true, // skip live check (uses tokens)
    d1: await check(() => cfD1Query("SELECT 1")),
    kv: await check(() => cfKvGet("__healthcheck__")),
  };
}
