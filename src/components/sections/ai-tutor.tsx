"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  MessageCircle,
  Volume2,
  Loader2,
  Sparkles,
  RotateCcw,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getDeviceId } from "@/lib/device-id";

interface Language {
  id: string;
  code: string;
  name: string;
  region: string;
  greetingText: string;
  vitality: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  translation?: string;
  ts: number;
}

export function AiTutorSection() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load languages
  useEffect(() => {
    fetch("/api/languages")
      .then((r) => r.json())
      .then((data) => {
        setLanguages(data.languages ?? []);
        if (data.languages?.length > 0) setSelectedLang(data.languages[0].code);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedLanguage = languages.find((l) => l.code === selectedLang);

  const startConversation = () => {
    if (!selectedLanguage) return;
    setMessages([
      {
        role: "assistant",
        content: selectedLanguage.greetingText,
        translation: "Sapaan pembuka",
        ts: Date.now(),
      },
    ]);
    setSessionId(null);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedLang || loading) return;
    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      ts: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          languageCode: selectedLang,
          sessionId,
          deviceId: getDeviceId(),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply,
        translation: data.translation,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (data.sessionId) setSessionId(data.sessionId);
    } catch (err) {
      toast({
        title: "Gagal mengirim pesan",
        description: "Coba lagi sebentar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playTts = async (text: string, idx: number) => {
    if (playingIdx === idx) return;
    setPlayingIdx(idx);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, languageCode: selectedLang }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.onended = () => setPlayingIdx(null);
        audio.play();
      } else {
        toast({ title: "Audio tidak tersedia", variant: "destructive" });
        setPlayingIdx(null);
      }
    } catch {
      toast({ title: "Gagal memutar audio", variant: "destructive" });
      setPlayingIdx(null);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setSessionId(null);
    startConversation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="tutor" className="py-16 sm:py-20 border-b border-border bg-batik-pattern">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Conversational
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Tutor AI Bahasa Daerah
          </h2>
          <p className="text-muted-foreground">
            Berlatih percakapan langsung dengan AI yang memahami bahasa daerah
            Nusantara. AI akan membalas dalam bahasa yang dipilih, lengkap dengan
            terjemahan dan koreksi pelafalan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Sidebar: language selector */}
          <Card className="lg:col-span-1 p-5 space-y-4 h-fit">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Bahasa Daerah
              </label>
              <Select
                value={selectedLang}
                onValueChange={(v) => {
                  setSelectedLang(v);
                  setMessages([]);
                  setSessionId(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLanguage && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sapaan Khas</p>
                  <p className="text-sm font-semibold text-foreground italic">
                    &ldquo;{selectedLanguage.greetingText}&rdquo;
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Region</p>
                  <p className="text-sm text-foreground">{selectedLanguage.region}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className="text-xs">
                    {selectedLanguage.vitality.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              onClick={resetConversation}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Percakapan
            </Button>

            <div className="pt-3 border-t border-border">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Tips:</strong> Ketik dalam bahasa Indonesia atau
                bahasa daerah. AI akan membalas dalam bahasa yang dipilih + terjemahan.
              </p>
            </div>
          </Card>

          {/* Chat panel */}
          <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden min-h-[500px] max-h-[600px]">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tutor AI</p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedLanguage?.name ?? "Pilih bahasa"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {messages.length} pesan
              </Badge>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef as never}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Mulai percakapan dengan Tutor AI
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Klik tombol di bawah untuk menyapa dalam{" "}
                    {selectedLanguage?.name ?? "bahasa daerah"}
                  </p>
                  <Button
                    onClick={startConversation}
                    size="sm"
                    className="mt-4 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Mulai Percakapan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-2.5",
                        msg.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          msg.role === "assistant"
                            ? "bg-primary/15"
                            : "bg-accent/30"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-accent-foreground" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg px-3.5 py-2.5 max-w-[80%]",
                          msg.role === "assistant"
                            ? "bg-secondary/50 border border-border"
                            : "bg-primary/10 border border-primary/20"
                        )}
                      >
                        <p className="text-sm text-foreground leading-relaxed italic">
                          {msg.content}
                        </p>
                        {msg.translation && (
                          <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-border/50">
                            <span className="font-semibold">ID:</span> {msg.translation}
                          </p>
                        )}
                        {msg.role === "assistant" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 mt-2 px-2 text-xs text-primary hover:bg-primary/10"
                            onClick={() => playTts(msg.content, idx)}
                            disabled={playingIdx !== null}
                          >
                            {playingIdx === idx ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Volume2 className="h-3 w-3 mr-1" />
                            )}
                            {playingIdx === idx ? "Memutar..." : "Dengar"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="rounded-lg px-3.5 py-2.5 bg-secondary/50 border border-border">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-3 bg-background">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ketik dalam ${selectedLanguage?.name ?? "bahasa"} atau Bahasa Indonesia...`}
                  className="min-h-[44px] max-h-24 resize-none text-sm"
                  rows={1}
                  disabled={loading || messages.length === 0}
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  className="h-11 w-11 flex-shrink-0 bg-primary hover:bg-primary/90"
                  disabled={!input.trim() || loading || messages.length === 0}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
                Tekan Enter untuk kirim · Shift+Enter untuk baris baru
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
