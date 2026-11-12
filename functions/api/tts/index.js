import { json, aiTts, handleCORS } from "../../_lib/helpers.js";
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    if (!body.text) return json({ error: "text wajib" }, 400);
    var result = await aiTts(body.text, "id", context.env);
    return json({ audioBase64: result.audioBase64, format: result.format, durationMs: 0 });
  } catch (e) { return json({ error: "Gagal TTS" }, 500); }
}
