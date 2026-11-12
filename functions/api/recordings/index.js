import { json, aiAsr, aiLlm, d1Exec, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    if (!body.audioBase64 || !body.title || !body.speakerName || !body.languageCode) return json({ error: "audioBase64, title, speakerName, languageCode wajib" }, 400);
    var langs = await d1Query(`SELECT id, name FROM language WHERE code = ?`, [body.languageCode], context.env);
    if (!langs.length) return json({ error: "Bahasa tidak ditemukan" }, 404);
    var lang = langs[0];
    var text = await aiAsr(body.audioBase64, context.env);
    var translation = "";
    if (text) translation = await aiLlm([{ role: "system", content: `Terjemahkan dari ${lang.name} ke Bahasa Indonesia. Jawab HANYA terjemahan.` }, { role: "user", content: text }], { max_tokens: 256, temperature: 0.3 }, context.env);
    var id = "rec_" + Date.now();
    var title = body.title.replace(/'/g, "''"), speakerName = body.speakerName.replace(/'/g, "''"), ctxVal = body.context ? "'" + body.context.replace(/'/g, "''") + "'" : "NULL";
    await d1Exec(`INSERT INTO recording (id, languageId, title, speakerName, speakerAge, speakerRole, audioUrl, durationSec, transcriptText, translationId, transcriptStatus, context, createdAt, updatedAt) VALUES ('${id}', '${lang.id}', '${title}', '${speakerName}', ${body.speakerAge||"NULL"}, ${body.speakerRole?"'"+body.speakerRole.replace(/'/g,"''")+"'":"NULL"}, '', 0, '${text.replace(/'/g,"''")}', '${translation.replace(/'/g,"''")}', '${text?"done":"pending"}', ${ctxVal}, datetime('now'), datetime('now'))`, context.env);
    return json({ recording: { id: id, title: body.title, audioUrl: "" }, transcription: text, translation: translation });
  } catch (e) { return json({ error: "Gagal rekaman" }, 500); }
}
