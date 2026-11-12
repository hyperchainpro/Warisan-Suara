import { json, aiLlm, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    if (!body.phrase || !body.languageCode) return json({ error: "phrase dan languageCode wajib" }, 400);
    var langs = await d1Query(`SELECT name FROM language WHERE code = ?`, [body.languageCode], context.env);
    var langName = langs[0] && langs[0].name || "Bahasa Daerah";
    var explanation = await aiLlm([{ role: "system", content: `Jelaskan konteks budaya frasa "${body.phrase}" dalam ${langName}. Ringkas 3-5 kalimat dalam Bahasa Indonesia.` }, { role: "user", content: body.phrase }], { max_tokens: 400, temperature: 0.5 }, context.env);
    return json({ explanation: explanation, durationMs: 0 });
  } catch (e) { return json({ error: "Gagal explain" }, 500); }
}
