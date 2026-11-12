import { json, aiLlm, d1Query, handleCORS } from "../../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    if (!body.messages || !body.languageCode) return json({ error: "messages dan languageCode wajib" }, 400);
    var langs = await d1Query(`SELECT * FROM language WHERE code = ?`, [body.languageCode], context.env);
    if (!langs.length) return json({ error: "Bahasa tidak ditemukan" }, 404);
    var lang = langs[0];
    var sys = `Anda adalah tutor ${lang.name} yang sabar. Jawab dalam ${lang.name} dengan ejaan benar. Setelah jawaban, berikan terjemahan [ID: ...]. Jawab ringkas (2-3 kalimat). Gunakan sapaan "${lang.greetingText}".`;
    var reply = await aiLlm([{ role: "system", content: sys }].concat(body.messages), { max_tokens: 400, temperature: 0.7 }, context.env);
    var translation = "";
    var m = reply.match(/\[ID:\s*(.+?)\]/);
    if (m) translation = m[1].trim();
    var cleanReply = reply.replace(/\[ID:\s*.+?\]/, "").trim();
    return json({ reply: cleanReply, translation: translation, durationMs: 0 });
  } catch (e) { return json({ error: "Gagal tutor" }, 500); }
}
