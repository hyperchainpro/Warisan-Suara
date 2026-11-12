import { json, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var langs = await d1Query(`SELECT l.*, (SELECT COUNT(*) FROM oral_tradition WHERE languageId = l.id) as tradCount, (SELECT COUNT(*) FROM learning_module WHERE languageId = l.id) as modCount FROM language l ORDER BY CASE vitality WHEN 'HAMPIR_PUNAH' THEN 1 WHEN 'KRITIS' THEN 2 WHEN 'TERANCAM' THEN 3 WHEN 'TERTENTU' THEN 4 WHEN 'AMAN' THEN 5 END, speakers DESC`, [], context.env);
    var languages = langs.map(function(l) { return Object.assign({}, l, { _count: { recordings: 0, traditions: l.tradCount, modules: l.modCount } }); });
    return json({ languages: languages });
  } catch (e) { return json({ error: "Gagal memuat bahasa" }, 500); }
}
