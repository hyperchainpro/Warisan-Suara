import { json, aiLlm, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    var text = body.text, languageCode = body.languageCode, direction = body.direction || "to-id";
    if (!text || !languageCode) return json({ error: "text dan languageCode wajib" }, 400);
    var langs = await d1Query(`SELECT name FROM language WHERE code = ?`, [languageCode], context.env);
    if (!langs.length) return json({ error: "Bahasa tidak ditemukan" }, 404);
    var langName = langs[0].name;
    var sys = direction === "to-id" ? `Terjemahkan dari ${langName} ke Bahasa Indonesia. Jawab HANYA terjemahan, dipisahkan || lalu catatan jika ada.` : `Terjemahkan dari Bahasa Indonesia ke ${langName}. Jawab HANYA terjemahan.`;
    var raw = await aiLlm([{ role: "system", content: sys }, { role: "user", content: text }], { max_tokens: 512, temperature: 0.3 }, context.env);
    var parts = raw.split("||");
    return json({ translation: parts[0].trim(), notes: parts[1] && parts[1].trim() || undefined, durationMs: 0 });
  } catch (e) { return json({ error: "Gagal terjemahan" }, 500); }
}
