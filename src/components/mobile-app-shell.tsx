"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Map as MapIcon,
  Mic,
  BookOpen,
  Library,
  Info,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/sections/hero";
import { LanguageMapSection } from "@/components/sections/language-map";
import { RecordingStudioSection } from "@/components/sections/recording-studio";
import { LearningModulesSection } from "@/components/sections/learning-modules";
import { AiTutorSection } from "@/components/sections/ai-tutor";
import { OralTraditionsSection } from "@/components/sections/oral-traditions";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { TeamSheet } from "@/components/team-sheet";

type TabId = "beranda" | "bahasa" | "rekam" | "belajar" | "arsip";

interface TabDef {
  id: TabId;
  label: string;
  icon: LucideIcon;
  elevated?: boolean; // center FAB-style
}

const TABS: TabDef[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "bahasa", label: "Bahasa", icon: MapIcon },
  { id: "rekam", label: "Rekam", icon: Mic, elevated: true },
  { id: "belajar", label: "Belajar", icon: BookOpen },
  { id: "arsip", label: "Arsip", icon: Library },
];

export function MobileAppShell() {
  // Sync with URL hash for deep-linking (e.g. ?action=record from PWA shortcut)
  // Read initial action on mount only, set state lazily to avoid set-state-in-effect
  const [initialTab] = useState<TabId>(() => {
    if (typeof window === "undefined") return "beranda";
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "record") return "rekam";
    if (action === "learn") return "belajar";
    if (action === "tutor") return "belajar";
    return "beranda";
  });
  const [activeTab, setActiveTabState] = useState<TabId>(initialTab);
  const setActiveTab = useCallback((t: TabId) => setActiveTabState(t), []);
  const [transitioning, setTransitioning] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    const main = document.getElementById("app-main");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const switchTab = useCallback((tab: TabId) => {
    setTransitioning(true);
    setActiveTab(tab);
    // Brief transition fade
    setTimeout(() => setTransitioning(false), 150);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ServiceWorkerRegister />

      {/* Mobile-style top status bar (decorative, shows app name) */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-md flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M3 12 Q 3 8 6 8 Q 9 8 9 12 Q 9 16 6 16 Q 3 16 3 12 Z" className="text-primary" />
                <path d="M 9.5 12 Q 9.5 5.5 12 5.5 Q 14.5 5.5 14.5 12 Q 14.5 18.5 12 18.5 Q 9.5 18.5 9.5 12 Z" className="text-primary" />
                <path d="M 15 12 Q 15 8 18 8 Q 21 8 21 12 Q 21 16 18 16 Q 15 16 15 12 Z" className="text-primary" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold text-foreground">Warisan Suara</p>
              <p className="text-[9px] text-muted-foreground tracking-wide">BUDAYA GO! 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:inline">
              {TABS.find((t) => t.id === activeTab)?.label}
            </span>
            <button
              onClick={() => setTeamOpen(true)}
              className="h-8 w-8 rounded-full bg-secondary/60 hover:bg-accent/30 flex items-center justify-center transition-colors"
              aria-label="Info Tim"
            >
              <Info className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content area - scrolls */}
      <main
        id="app-main"
        className={cn(
          "flex-1 overflow-y-auto pb-24 transition-opacity duration-150",
          transitioning ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Mobile-first: constrain width but allow desktop expansion */}
        <div className="mx-auto w-full max-w-md lg:max-w-2xl xl:max-w-4xl">
          {activeTab === "beranda" && <HeroSection onNavigate={switchTab} />}
          {activeTab === "bahasa" && <LanguageMapSection />}
          {activeTab === "rekam" && <RecordingStudioSection />}
          {activeTab === "belajar" && (
            <BelajarTab onNavigate={switchTab} />
          )}
          {activeTab === "arsip" && <OralTraditionsSection />}
        </div>
      </main>

      {/* Bottom Tab Bar - mobile app style */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Navigasi utama"
      >
        <div className="mx-auto max-w-md lg:max-w-2xl xl:max-w-4xl">
          <div className="grid grid-cols-5 items-end px-2 py-1.5 relative">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              if (tab.elevated) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className="flex flex-col items-center justify-center"
                    aria-label={tab.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center -mt-6 shadow-lg transition-all duration-200 border-4 border-background",
                        isActive
                          ? "bg-primary scale-110"
                          : "bg-primary/80 hover:bg-primary hover:scale-105"
                      )}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] mt-1 font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className="flex flex-col items-center justify-center gap-1 py-1.5 transition-colors"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all",
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Team Info Sheet */}
      <TeamSheet open={teamOpen} onClose={() => setTeamOpen(false)} />
    </div>
  );
}

// Belajar tab combines Learning Modules + AI Tutor with sub-toggle
function BelajarTab({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  const [subView, setSubView] = useState<"modul" | "tutor">("modul");
  return (
    <div>
      {/* Sub-tab toggle */}
      <div className="sticky top-[57px] z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md lg:max-w-2xl px-4 py-2">
          <div className="inline-flex w-full max-w-xs mx-auto bg-secondary/60 rounded-full p-1">
            <button
              onClick={() => setSubView("modul")}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-full transition-all",
                subView === "modul"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground"
              )}
            >
              Modul Belajar
            </button>
            <button
              onClick={() => setSubView("tutor")}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-full transition-all",
                subView === "tutor"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground"
              )}
            >
              Tutor AI
            </button>
          </div>
        </div>
      </div>
      {subView === "modul" ? <LearningModulesSection /> : <AiTutorSection />}
    </div>
  );
}
