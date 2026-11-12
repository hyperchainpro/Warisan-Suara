import { json, d1Query, d1Exec, handleCORS } from "../../../_lib/helpers.js";
export async function onRequestGet(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var url = new URL(context.request.url);
    var deviceId = url.searchParams.get("deviceId");
    if (!deviceId) return json({ progress: [] });
    var progress = await d1Query(`SELECT * FROM user_progress WHERE deviceId = ?`, [deviceId], context.env);
    return json({ progress: progress });
  } catch (e) { return json({ error: "Gagal memuat progres" }, 500); }
}
export async function onRequestPost(context) {
  var cors = handleCORS(context.request);
  if (cors) return cors;
  try {
    var body = await context.request.json();
    var deviceId = body.deviceId, moduleId = body.moduleId, lessonIdx = body.lessonIdx, completed = body.completed;
    if (!deviceId || !moduleId) return json({ error: "deviceId dan moduleId wajib" }, 400);
    var did = deviceId.replace(/'/g, "''");
    var mid = moduleId.replace(/'/g, "''");
    await d1Exec(`DELETE FROM user_progress WHERE deviceId = '${did}' AND moduleId = '${mid}'`, context.env);
    await d1Exec(`INSERT INTO user_progress (id, deviceId, moduleId, lessonIdx, completed, lastStudied) VALUES ('${Date.now()}', '${did}', '${mid}', ${lessonIdx||0}, ${completed?1:0}, datetime('now'))`, context.env);
    return json({ progress: { deviceId: deviceId, moduleId: moduleId, lessonIdx: lessonIdx||0, completed: !!completed } });
  } catch (e) { return json({ error: "Gagal simpan" }, 500); }
}
