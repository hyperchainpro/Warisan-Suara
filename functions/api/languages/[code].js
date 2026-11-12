import { json, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var code = context.params.code;
    var langs = await d1Query(`SELECT * FROM language WHERE code = ?`, [code], context.env);
    if (!langs.length) return json({ error: "Bahasa tidak ditemukan" }, 404);
    var traditions = await d1Query(`SELECT * FROM oral_tradition WHERE languageId = ? ORDER BY createdAt DESC`, [langs[0].id], context.env);
    var modules = await d1Query(`SELECT * FROM learning_module WHERE languageId = ? ORDER BY orderIdx ASC`, [langs[0].id], context.env);
    return json({ language: Object.assign({}, langs[0], { traditions: traditions, modules: modules, recordings: [] }) });
  } catch (e) { return json({ error: "Gagal memuat detail" }, 500); }
}
