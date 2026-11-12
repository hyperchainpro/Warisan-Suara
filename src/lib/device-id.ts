// Device ID utility for anonymous user tracking (Cloudflare KV / D1 ready)
// Generates a stable per-browser identifier stored in localStorage

const DEVICE_ID_KEY = "warisan_suara_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    // Generate readable unique id
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    id = "dev_" + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
