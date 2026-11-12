"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Loader2,
  Save,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TurnstileWidget } from "@/components/turnstile";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Language {
  id: string;
  code: string;
  name: string;
  region: string;
  vitality: string;
}

type RecorderState = "idle" | "recording" | "stopped" | "processing";

export function RecordingStudioSection() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Metadata form
  const [title, setTitle] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerAge, setSpeakerAge] = useState("");
  const [speakerRole, setSpeakerRole] = useState("");
  const [context, setContext] = useState("");

  // Results
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [asrDurationMs, setAsrDurationMs] = useState<number | null>(null);
  const [savedRecording, setSavedRecording] = useState<{ id: string; audioUrl: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Timer
  useEffect(() => {
    if (recorderState === "recording") {
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recorderState]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecorderState("stopped");
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start();
      setRecorderState("recording");
      setRecordingTime(0);
      setTranscription("");
      setTranslation("");
      setSavedRecording(null);
      toast({ title: "Merekam...", description: "Bicara dengan jelas" });
    } catch (err) {
      toast({
        title: "Gagal mengakses mikrofon",
        description: "Izinkan akses mikrofon di browser Anda",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl("");
    setTranscription("");
    setTranslation("");
    setRecorderState("idle");
    setRecordingTime(0);
    setSavedRecording(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const transcribe = async () => {
    if (!audioBlob || !selectedLang) return;
    setRecorderState("processing");
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/asr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio: base64,
            languageCode: selectedLang,
          }),
        });
        const data = await res.json();
        setTranscription(data.text || "");
        setTranslation(data.translation || "");
        setAsrDurationMs(data.durationMs ?? null);
        setRecorderState("stopped");
        toast({
          title: "Transkripsi selesai",
          description: data.text ? "Lihat hasil di bawah" : "Audio terlalu pendek / tidak terdeteksi",
        });
      };
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      setRecorderState("stopped");
      toast({
        title: "Gagal transkripsi",
        description: "Coba lagi",
        variant: "destructive",
      });
    }
  };

  const saveRecording = async () => {
    if (!audioBlob || !selectedLang || !title || !speakerName) {
      toast({
        title: "Data belum lengkap",
        description: "Judul, nama penutur, dan bahasa wajib diisi",
        variant: "destructive",
      });
      return;
    }
    if (!turnstileToken) {
      toast({
        title: "Verifikasi keamanan belum selesai",
        description: "Tunggu hingga Turnstile selesai memverifikasi",
        variant: "destructive",
      });
      return;
    }
    setRecorderState("processing");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/recordings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: base64,
            title,
            speakerName,
            languageCode: selectedLang,
            turnstileToken,
            speakerAge: speakerAge ? parseInt(speakerAge) : undefined,
            speakerRole: speakerRole || undefined,
            context: context || undefined,
          }),
        });
        const data = await res.json();
        setSavedRecording({ id: data.recording?.id, audioUrl: data.recording?.audioUrl });
        setTranscription(data.transcription || "");
        setTranslation(data.translation || "");
        setRecorderState("stopped");
        toast({
          title: "Rekaman tersimpan",
          description: "Berhasil didokumentasikan ke arsip Warisan Suara",
        });
      };
      reader.readAsDataURL(audioBlob);
    } catch {
      setRecorderState("stopped");
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    }
  };

  const selectedLanguage = languages.find((l) => l.code === selectedLang);

  return (
    <section id="studio-rekam" className="py-16 sm:py-20 border-b border-border bg-secondary/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Mic className="h-3 w-3 mr-1" />
            Fitur Utama
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Studio Rekam Tradisi Lisan
          </h2>
          <p className="text-muted-foreground">
            Rekam suara penutur asli bahasa daerah. AI akan otomatis
            mentranskripsi dan menerjemahkan ke Bahasa Indonesia — menyelamatkan
            khazanah lisan sebelum hilang bersama tetua adat.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Recorder panel */}
          <Card className="lg:col-span-3 p-6 sm:p-8 space-y-6">
            {/* Language selector */}
            <div className="space-y-2">
              <Label htmlFor="lang-select">Bahasa Daerah</Label>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger id="lang-select" className="w-full">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name} — {l.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLanguage && (
                <p className="text-xs text-muted-foreground">
                  Status: {selectedLanguage.vitality.replace(/_/g, " ")}
                </p>
              )}
            </div>

            {/* Recorder visual */}
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-border rounded-xl bg-background/50">
              {recorderState === "recording" && (
                <div className="flex items-end gap-1 h-12 mb-3">
                  {[60, 90, 40, 100, 70, 30, 85, 55, 95, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-destructive rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              )}

              {recorderState === "idle" && (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="rounded-full h-20 w-20 p-0 bg-destructive hover:bg-destructive/90 shadow-lg"
                  aria-label="Mulai rekam"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}

              {recorderState === "recording" && (
                <Button
                  size="lg"
                  onClick={stopRecording}
                  className="rounded-full h-20 w-20 p-0 bg-primary hover:bg-primary/90 shadow-lg animate-pulse"
                  aria-label="Stop rekam"
                >
                  <Square className="h-7 w-7" />
                </Button>
              )}

              {(recorderState === "stopped" || recorderState === "processing") && audioUrl && (
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="rounded-full h-20 w-20 p-0 bg-primary hover:bg-primary/90 shadow-lg"
                    disabled={recorderState === "processing"}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              <div className="mt-4 text-center">
                {recorderState === "idle" && (
                  <p className="text-sm text-muted-foreground">
                    Klik mikrofon untuk mulai merekam
                  </p>
                )}
                {recorderState === "recording" && (
                  <p className="text-sm font-mono text-destructive">
                    ● REC {formatTime(recordingTime)}
                  </p>
                )}
                {recorderState === "stopped" && (
                  <p className="text-sm text-muted-foreground">
                    Durasi: {formatTime(recordingTime)}
                  </p>
                )}
                {recorderState === "processing" && (
                  <p className="text-sm text-primary flex items-center gap-1.5 justify-center">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Memproses AI...
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {audioBlob && recorderState === "stopped" && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={transcribe}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Transkripsi AI
                </Button>
                <Button variant="outline" onClick={resetRecording} className="sm:w-auto">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rekam Ulang
                </Button>
              </div>
            )}
          </Card>

          {/* Metadata + Results panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Metadata form */}
            <Card className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Save className="h-4 w-4 text-primary" />
                Metadata Rekaman
              </h3>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs">Judul</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="cth: Sapaan tetua adat..."
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="speaker" className="text-xs">Nama Penutur</Label>
                  <Input
                    id="speaker"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    placeholder="cth: Pak Maman"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs">Usia</Label>
                  <Input
                    id="age"
                    type="number"
                    value={speakerAge}
                    onChange={(e) => setSpeakerAge(e.target.value)}
                    placeholder="cth: 67"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs">Peran (opsional)</Label>
                <Input
                  id="role"
                  value={speakerRole}
                  onChange={(e) => setSpeakerRole(e.target.value)}
                  placeholder="cth: Tetua adat, Maestro..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctx" className="text-xs">Konteks (opsional)</Label>
                <Textarea
                  id="ctx"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Kapan dan dalam situasi apa rekaman ini dibuat?"
                  className="text-sm min-h-[60px]"
                />
              </div>
              {/* Cloudflare Turnstile anti-bot protection */}
              <TurnstileWidget onVerify={setTurnstileToken} />
              <Button
                onClick={saveRecording}
                disabled={!audioBlob || recorderState === "processing" || !title || !speakerName || !turnstileToken}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {savedRecording ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Tersimpan ke Arsip
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan ke Arsip
                  </>
                )}
              </Button>
            </Card>

            {/* Transcription result */}
            {(transcription || translation) && (
              <Card className="p-5 space-y-3 border-primary/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    Hasil AI
                  </h3>
                  {asrDurationMs && (
                    <Badge variant="outline" className="text-[10px]">
                      {asrDurationMs}ms
                    </Badge>
                  )}
                </div>
                {transcription && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Transkripsi ({selectedLanguage?.name}):
                    </Label>
                    <p className="text-sm font-medium text-foreground bg-secondary/40 p-2.5 rounded-md italic">
                      &ldquo;{transcription}&rdquo;
                    </p>
                  </div>
                )}
                {translation && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Languages className="h-3 w-3" />
                      Terjemahan (Bahasa Indonesia):
                    </Label>
                    <p className="text-sm text-foreground bg-accent/20 p-2.5 rounded-md">
                      {translation}
                    </p>
                  </div>
                )}
                {!transcription && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Audio belum ditranskripsi. Klik &ldquo;Transkripsi AI&rdquo;.
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-8 rounded-lg border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
          <Volume2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Catatan teknis:</strong> Audio
            diproses via <strong className="text-primary">Cloudflare Workers AI</strong> (Whisper ASR)
            untuk transkripsi dan <strong className="text-primary">LLM</strong> untuk terjemahan.
            Saat ini prototype berjalan dengan AI SDK lokal; produksi penuh akan menggunakan
            Cloudflare AI bindings. Semua rekaman disimpan di <strong className="text-primary">Cloudflare R2</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}
