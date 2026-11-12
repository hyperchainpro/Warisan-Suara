import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext for Cloudflare - enables Next.js 16 deployment to Cloudflare Workers/Pages
// Docs: https://opennext.js.org/cloudflare
export default defineCloudflareConfig({
  // The AI service is abstracted in src/lib/ai.ts
  // When deployed to Cloudflare, set USE_CLOUDFLARE_AI=1 and the AI module
  // will use Cloudflare Workers AI bindings (env.AI) instead of z-ai-web-dev-sdk.
  //
  // Bindings available in production:
  //   env.DB          — Cloudflare D1 (SQLite at edge)
  //   env.AUDIO_BUCKET — Cloudflare R2 (audio file storage)
  //   env.AI          — Cloudflare Workers AI (ASR/TTS/LLM)
  //   env.CACHE       — Cloudflare KV (response caching)
  //   env.ASSETS      — Cloudflare Pages static assets
});
