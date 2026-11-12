"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  className?: string;
}

// Cloudflare Turnstile widget
// In dev (no sitekey): auto-passes with a mock token
// In prod (TURNSTILE_SITE_KEY set): renders real Turnstile widget
export function TurnstileWidget({ onVerify, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<"loading" | "verified" | "dev-mode">("loading");
  const [error, setError] = useState(false);

  // Sitekey from env (set TURNSTILE_SITE_KEY in production)
  // For dev/demo we use Cloudflare's test sitekey that always passes
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"; // Cloudflare test key (always passes)
  const isProd = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  const loadScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.turnstile) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject());
        return;
      }
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Turnstile"));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const renderWidget = async () => {
      // Dev mode (no prod sitekey): skip real widget, auto-verify with mock token
      if (!isProd) {
        setStatus("dev-mode");
        // Slight delay to show loading state briefly
        setTimeout(() => {
          if (!cancelled) onVerify("dev-mock-token");
        }, 600);
        return;
      }
      // Production: render real Turnstile widget
      try {
        await loadScript();
        if (cancelled || !containerRef.current || !window.turnstile) return;
        if (widgetIdRef.current) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "light",
          size: "compact",
          callback: (token: string) => {
            setStatus("verified");
            onVerify(token);
          },
          "error-callback": () => {
            setError(true);
            setStatus("loading");
          },
          "expired-callback": () => {
            setStatus("loading");
            onVerify("");
          },
        });
      } catch {
        setStatus("dev-mode");
        onVerify("dev-mock-token");
      }
    };
    renderWidget();
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
      }
    };
  }, [siteKey, onVerify]);

  return (
    <div className={className}>
      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-secondary/30">
        <div className="flex-shrink-0 mt-0.5">
          {status === "verified" ? (
            <ShieldCheck className="h-4 w-4 text-primary" />
          ) : status === "dev-mode" ? (
            <ShieldCheck className="h-4 w-4 text-accent-foreground" />
          ) : (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground leading-tight">
            {status === "verified"
              ? "Verifikasi keamanan berhasil"
              : status === "dev-mode"
              ? "Mode dev: verifikasi dilewati"
              : "Memverifikasi..."}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Dilindungi Cloudflare Turnstile (anti-bot)
          </p>
        </div>
      </div>
      {/* Turnstile widget container - only rendered in production */}
      {isProd && (
        <div ref={containerRef} className="mt-2" />
      )}
      {error && (
        <p className="text-[10px] text-destructive mt-1">
          Gagal verifikasi. Muat ulang halaman.
        </p>
      )}
    </div>
  );
}
