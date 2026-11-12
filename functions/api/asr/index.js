import { json, aiAsr, aiLlm, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    if (!body.audio) return json({ error: "Audio diperlukan" }, 400);
    var text = await aiAsr(body.audio, context.env);
    var translation = "";
    if (text && body.languageCode) {
      var langs = await d1Query(`SELECT name FROM language WHERE code = ?`, [body.languageCode], context.env);
      var langName = langs[0] && langs[0].name || "Bahasa Daerah";
      translation = await aiLlm([{ role: "system", content: `Terjemahkan dari ${langName} ke Bahasa Indonesia. Jawab HANYA terjemahan.` }, { role: "user", content: text }], { max_tokens: 256, temperature: 0.3 }, context.env);
    }
    return json({ text: text, translation: translation, durationMs: 0 });
  } catch (e) { return json({ error: "Gagal ASR" }, 500); }
}
