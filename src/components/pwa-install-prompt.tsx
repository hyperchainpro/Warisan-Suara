"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  // Check if already installed (standalone mode) - lazy initial state
  const [installed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });

  useEffect(() => {
    if (installed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setShowPrompt(false));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [installed]);

  if (installed || !showPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  // Don't show if dismissed this session
  if (sessionStorage.getItem("pwa-prompt-dismissed")) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[55] mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-primary/30 bg-background/95 backdrop-blur-lg shadow-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Pasang Aplikasi</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Install Warisan Suara ke layar utama untuk akses cepat & offline.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="h-7 w-7 rounded-full hover:bg-secondary flex items-center justify-center flex-shrink-0"
            aria-label="Tutup"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        <Button
          onClick={handleInstall}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-xs h-9"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Pasang Sekarang
        </Button>
      </div>
    </div>
  );
}
