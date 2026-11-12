// WARISAN SUARA - AI Service Layer
// PRIMARY: Cloudflare Workers AI (LLM/ASR/TTS via REST API)
// FALLBACK: z-ai-web-dev-sdk (for dev without Cloudflare creds)
// Controlled by USE_CLOUDFLARE_AI env var

import { cfLlm, cfAsr, cfTts, type CfChatMessage } from "@/lib/cloudflare";

export interface AsrResult {
  text: string;
  language?: string;
  durationMs: number;
}

export interface TranslateResult {
  translation: string;
  notes?: string;
  durationMs: number;
}

export interface TtsResult {
  audioBase64: string;
  format: string;
  durationMs: number;
}

export interface TutorMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface TutorResult {
  reply: string;
  translation: string;
  durationMs: number;
}

const USE_CLOUDFLARE = process.env.USE_CLOUDFLARE_AI === "1" && Boolean(process.env.CF_ACCOUNT_ID);

// === Fallback: z-ai-web-dev-sdk ===
import ZAI from "z-ai-web-dev-sdk";
let zaiInstance: ZAI | null = null;
async function getZAI(): Promise<ZAI> {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

// === ASR - Speech to Text ===
export async function transcribeAudio(
  audioBase64OrUrl: string,
  opts?: { language?: string }
): Promise<AsrResult> {
  const start = Date.now();
  try {
    if (USE_CLOUDFLARE) {
      // Extract base64 data from data URL
      const base64 = audioBase64OrUrl.replace(/^data:audio\/\w+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");
      const result = await cfAsr(buffer, "audio.webm");
      return {
        text: result.text,
        language: opts?.language,
        durationMs: Date.now() - start,
      };
    }
    // Fallback: z-ai-web-dev-sdk
    const zai = await getZAI();
    const result = await zai.audio.asr.create({ file_base64: audioBase64OrUrl });
    const text = typeof result === "string" ? result : (result?.text ?? result?.transcript ?? "");
    return { text: text || "", language: opts?.language, durationMs: Date.now() - start };
  } catch (err) {
    console.error("ASR error:", err);
    return { text: "", language: opts?.language, durationMs: Date.now() - start };
  }
}

// === Translation via LLM ===
export async function translateText(
  text: string,
  fromLanguage: string,
  direction: "to-id" | "to-daerah" = "to-id"
): Promise<TranslateResult> {
  const start = Date.now();
  try {
    const sysPrompt =
      direction === "to-id"
        ? `Anda adalah ahli bahasa Nusantara. Terjemahkan teks berikut dari ${fromLanguage} ke Bahasa Indonesia standar. Pertahankan makna kontekstual dan budaya. Jika ada kata yang tidak memiliki padanan langsung, berikan catatan singkat. Jawab HANYA dengan terjemahan, dipisahkan dengan tanda || lalu catatan (jika ada).`
        : `Anda adalah ahli bahasa Nusantara. Terjemahkan teks Bahasa Indonesia berikut ke ${fromLanguage}. Gunakan ejaan dan diksi yang alami untuk penutur asli. Jawab HANYA dengan terjemahan.`;

    const messages: CfChatMessage[] = [
      { role: "system", content: sysPrompt },
      { role: "user", content: text },
    ];

    let raw = "";
    if (USE_CLOUDFLARE) {
      const result = await cfLlm(messages, { max_tokens: 512, temperature: 0.3 });
      raw = result.text;
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({ messages, stream: false });
      raw = completion?.choices?.[0]?.message?.content ?? completion?.content ?? "";
    }

    const [translation, notes] = raw.split("||");
    return {
      translation: translation.trim(),
      notes: notes?.trim() || undefined,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    console.error("Translate error:", err);
    return { translation: "", durationMs: Date.now() - start };
  }
}

// === TTS - Text to Speech ===
export async function synthesizeSpeech(
  text: string,
  voice?: string
): Promise<TtsResult> {
  const start = Date.now();
  try {
    if (USE_CLOUDFLARE) {
      // Cloudflare MeloTTS (multilingual, supports Indonesian)
      const result = await cfTts(text, "id");
      return {
        audioBase64: result.audioBase64,
        format: result.format,
        durationMs: Date.now() - start,
      };
    }
    // Fallback: z-ai-web-dev-sdk
    const zai = await getZAI();
    const result = await zai.audio.tts.create({
      input: text,
      voice: voice,
      response_format: "mp3",
    });
    let audioBase64 = "";
    if (typeof result === "string") audioBase64 = result;
    else if (result?.audio || result?.data) audioBase64 = result.audio || result.data;
    else if (result?.base64) audioBase64 = result.base64;
    return { audioBase64, format: "mp3", durationMs: Date.now() - start };
  } catch (err) {
    console.error("TTS error:", err);
    return { audioBase64: "", format: "mp3", durationMs: Date.now() - start };
  }
}

// === AI Tutor - Conversational practice ===
export async function tutorChat(
  messages: TutorMessage[],
  languageName: string,
  greeting: string
): Promise<TutorResult> {
  const start = Date.now();
  try {
    const systemPrompt = `Anda adalah tutor ${languageName} yang sabar dan ramah. Tugas Anda membantu pengguna belajar ${languageName} melalui percakapan.

Aturan:
1. Jawab dalam ${languageName} dengan ejaan yang benar.
2. Setelah jawaban ${languageName}, berikan terjemahan dalam Bahasa Indonesia di baris baru dengan prefix [ID: ].
3. Jika pengguna membuat kesalahan, koreksi dengan sopan.
4. Gunakan sapaan "${greeting}" jika memungkinkan.
5. Topik percakapan: kehidupan sehari-hari, budaya, keluarga, makanan, tradisi.
6. Jawab ringkas (maksimal 2-3 kalimat) agar mudah dipelajari.

Contoh format jawaban:
"Sampurasun, kumaha damang abi? [ID: Selamat datang, apa kabarmu?]"

Mulailah percakapan yang bermakna dan edukatif.`;

    const fullMessages: CfChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    let reply = "";
    if (USE_CLOUDFLARE) {
      const result = await cfLlm(fullMessages, { max_tokens: 400, temperature: 0.7 });
      reply = result.text;
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({ messages: fullMessages, stream: false });
      reply = completion?.choices?.[0]?.message?.content ?? completion?.content ?? "";
    }

    // Extract [ID: ...] translation
    let translation = "";
    const match = reply.match(/\[ID:\s*(.+?)\]/);
    if (match) translation = match[1].trim();
    const cleanReply = reply.replace(/\[ID:\s*.+?\]/, "").trim();

    return { reply: cleanReply, translation, durationMs: Date.now() - start };
  } catch (err) {
    console.error("Tutor error:", err);
    return { reply: "", translation: "", durationMs: Date.now() - start };
  }
}

// === Explain cultural context ===
export async function explainCulturalContext(
  phrase: string,
  languageName: string
): Promise<{ explanation: string; durationMs: number }> {
  const start = Date.now();
  try {
    const messages: CfChatMessage[] = [
      {
        role: "system",
        content: `Anda adalah ahli budaya Nusantara. Jelaskan konteks budaya dari frasa "${phrase}" dalam ${languageName}. Sertakan: kapan digunakan, siapa yang biasanya menggunakannya, dan makna tersirat jika ada. Jawab dalam Bahasa Indonesia, ringkas (3-5 kalimat).`,
      },
      { role: "user", content: phrase },
    ];
    let explanation = "";
    if (USE_CLOUDFLARE) {
      const result = await cfLlm(messages, { max_tokens: 400, temperature: 0.5 });
      explanation = result.text;
    } else {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({ messages, stream: false });
      explanation = completion?.choices?.[0]?.message?.content ?? completion?.content ?? "";
    }
    return { explanation, durationMs: Date.now() - start };
  } catch (err) {
    console.error("Explain error:", err);
    return { explanation: "", durationMs: Date.now() - start };
  }
}

// Export flag for health endpoint
export const AI_PROVIDER = USE_CLOUDFLARE ? "cloudflare-workers-ai" : "z-ai-web-dev-sdk (dev fallback)";
