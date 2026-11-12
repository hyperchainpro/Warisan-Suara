import { json, d1Query, handleCORS } from "../../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var url = new URL(context.request.url);
    var languageCode = url.searchParams.get("languageCode");
    var sql = `SELECT m.*, l.code as langCode, l.name as langName FROM learning_module m JOIN language l ON m.languageId = l.id`;
    var params = [];
    if (languageCode) { sql += ` WHERE l.code = ?`; params.push(languageCode); }
    sql += ` ORDER BY m.languageId, m.orderIdx ASC`;
    var modules = await d1Query(sql, params, context.env);
    return json({ modules: modules.map(function(m) { return Object.assign({}, m, { language: { code: m.langCode, name: m.langName } }); }) });
  } catch (e) { return json({ error: "Gagal memuat modul" }, 500); }
}
