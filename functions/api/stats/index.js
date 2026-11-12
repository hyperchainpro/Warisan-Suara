import { json, d1Query, handleCORS } from "../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var totalLangs = await d1Query(`SELECT COUNT(*) as c FROM language`, [], context.env);
    var totalTrad = await d1Query(`SELECT COUNT(*) as c FROM oral_tradition`, [], context.env);
    var totalMod = await d1Query(`SELECT COUNT(*) as c FROM learning_module`, [], context.env);
    var totalSpeak = await d1Query(`SELECT SUM(speakers) as s FROM language`, [], context.env);
    var vitals = await d1Query(`SELECT vitality, COUNT(*) as c FROM language GROUP BY vitality`, [], context.env);
    var vitalities = {};
    vitals.forEach(function(v) { vitalities[v.vitality] = v.c; });
    return json({ totalLanguages: totalLangs[0] && totalLangs[0].c || 0, totalTraditions: totalTrad[0] && totalTrad[0].c || 0, totalModules: totalMod[0] && totalMod[0].c || 0, totalRecordings: 0, totalSpeakersCovered: totalSpeak[0] && totalSpeak[0].s || 0, vitalities: vitalities, aiUsage: {} });
  } catch (e) { return json({ error: "Gagal memuat statistik" }, 500); }
}
