import { json, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var url = new URL(context.request.url);
    var type = url.searchParams.get("type");
    var languageCode = url.searchParams.get("languageCode");
    var sql = `SELECT t.*, l.code as langCode, l.name as langName, l.region as langRegion FROM oral_tradition t JOIN language l ON t.languageId = l.id WHERE 1=1`;
    var params = [];
    if (type) { sql += ` AND t.type = ?`; params.push(type); }
    if (languageCode) { sql += ` AND l.code = ?`; params.push(languageCode); }
    sql += ` ORDER BY t.createdAt DESC`;
    var traditions = await d1Query(sql, params, context.env);
    return json({ traditions: traditions.map(function(t) { return Object.assign({}, t, { language: { code: t.langCode, name: t.langName, region: t.langRegion } }); }) });
  } catch (e) { return json({ error: "Gagal memuat tradisi" }, 500); }
}
