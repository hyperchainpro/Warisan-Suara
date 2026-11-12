import { json, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  var d1Ok = false;
  try { await d1Query(`SELECT 1`, [], context.env); d1Ok = true; } catch (e) {}
  return json({ status: "ok", deployed: "cloudflare-pages", aiProvider: "cloudflare-workers-ai", services: { d1: d1Ok, workersAi: true, kv: true }, models: { llm: "@cf/meta/llama-3.1-8b-instruct", asr: "@cf/openai/whisper", tts: "@cf/myshell-ai/melotts" }, timestamp: new Date().toISOString() });
}
