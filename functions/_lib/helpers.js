// Shared helpers for Cloudflare Pages Functions (plain JS)
// VibeSec: All credentials via environment variables (no hardcoded secrets)
// Set via: wrangler pages secret put CF_API_TOKEN (etc)
// OR via Cloudflare Pages dashboard > Settings > Environment variables

function getConfig(env) {
  // Pages Functions env vars come from context.env
  // Fallback to process.env for local dev with wrangler
  var e = env || process.env || {};
  return {
    CF_ACCOUNT: e.CF_ACCOUNT_ID || "",
    CF_TOKEN: e.CF_API_TOKEN || "",
    D1_UUID: e.CF_D1_DATABASE_UUID || "",
    KV_NS: e.CF_KV_NAMESPACE_ID || "",
  };
}

export function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function d1Query(sql, params, env) {
  var cfg = getConfig(env);
  if (!cfg.CF_ACCOUNT || !cfg.CF_TOKEN || !cfg.D1_UUID) {
    console.error("D1 not configured: set CF_ACCOUNT_ID, CF_API_TOKEN, CF_D1_DATABASE_UUID");
    return [];
  }
  var D1_URL = "https://api.cloudflare.com/client/v4/accounts/" + cfg.CF_ACCOUNT + "/d1/database/" + cfg.D1_UUID + "/raw";
  try {
    var res = await fetch(D1_URL, {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.CF_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ sql: sql, params: params || [] }),
    });
    var d = await res.json();
    if (!d.success) { console.error("D1 error:", JSON.stringify(d.errors)); return []; }
    var results = d.result && d.result[0] && d.result[0].results;
    if (!results) return [];
    var cols = results.columns || [];
    return (results.rows || []).map(function(row) {
      var obj = {};
      cols.forEach(function(c, i) { obj[c] = row[i]; });
      return obj;
    });
  } catch (e) {
    console.error("D1 exception:", String(e));
    return [];
  }
}

export async function d1Exec(sql, env) {
  var cfg = getConfig(env);
  if (!cfg.CF_ACCOUNT || !cfg.CF_TOKEN || !cfg.D1_UUID) return { changes: 0 };
  var D1_URL = "https://api.cloudflare.com/client/v4/accounts/" + cfg.CF_ACCOUNT + "/d1/database/" + cfg.DF_UUID + "/raw";
  try {
    var res = await fetch(D1_URL, {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.CF_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ sql: sql }),
    });
    var d = await res.json();
    if (!d.success) console.error("D1 exec error:", JSON.stringify(d.errors));
    return { changes: (d.result && d.result[0] && d.result[0].meta && d.result[0].meta.changes) || 0 };
  } catch (e) {
    console.error("D1 exec exception:", String(e));
    return { changes: 0 };
  }
}

export async function aiLlm(messages, opts, env) {
  var cfg = getConfig(env);
  if (!cfg.CF_ACCOUNT || !cfg.CF_TOKEN) {
    console.error("Workers AI not configured: set CF_ACCOUNT_ID, CF_API_TOKEN");
    return "";
  }
  var model = "@cf/meta/llama-3.1-8b-instruct";
  var AI_URL = "https://api.cloudflare.com/client/v4/accounts/" + cfg.CF_ACCOUNT + "/ai/run";
  opts = opts || {};
  try {
    var res = await fetch(AI_URL + "/" + model, {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.CF_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages,
        max_tokens: opts.max_tokens || 1024,
        temperature: opts.temperature || 0.7,
        stream: false,
      }),
    });
    var d = await res.json();
    if (!d.success) { console.error("AI LLM error:", JSON.stringify(d.errors)); return ""; }
    return (d.result && d.result.response) || "";
  } catch (e) {
    console.error("AI LLM exception:", String(e));
    return "";
  }
}

export async function aiAsr(audioBase64, env) {
  var cfg = getConfig(env);
  if (!cfg.CF_ACCOUNT || !cfg.CF_TOKEN) return "";
  var model = "@cf/openai/whisper";
  var AI_URL = "https://api.cloudflare.com/client/v4/accounts/" + cfg.CF_ACCOUNT + "/ai/run";
  try {
    var base64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
    var binary = atob(base64);
    var buffer = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    var formData = new FormData();
    formData.append("file", new Blob([buffer]), "audio.webm");
    var res = await fetch(AI_URL + "/" + model, {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.CF_TOKEN },
      body: formData,
    });
    var d = await res.json();
    if (!d.success) { console.error("AI ASR error:", JSON.stringify(d.errors)); return ""; }
    return (d.result && d.result.text) || "";
  } catch (e) {
    console.error("AI ASR exception:", String(e));
    return "";
  }
}

export async function aiTts(text, language, env) {
  var cfg = getConfig(env);
  if (!cfg.CF_ACCOUNT || !cfg.CF_TOKEN) return { audioBase64: "", format: "wav" };
  var model = "@cf/myshell-ai/melotts";
  var AI_URL = "https://api.cloudflare.com/client/v4/accounts/" + cfg.CF_ACCOUNT + "/ai/run";
  try {
    var res = await fetch(AI_URL + "/" + model, {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.CF_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text, language: language || "id" }),
    });
    var d = await res.json();
    if (!d.success) { console.error("AI TTS error:", JSON.stringify(d.errors)); return { audioBase64: "", format: "wav" }; }
    return { audioBase64: (d.result && d.result.audio) || "", format: "wav" };
  } catch (e) {
    console.error("AI TTS exception:", String(e));
    return { audioBase64: "", format: "wav" };
  }
}

export function handleCORS(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return null;
}
