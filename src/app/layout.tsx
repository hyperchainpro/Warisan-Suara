import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warisan Suara — Pelestarian Bahasa & Tradisi Lisan Nusantara",
  description:
    "Platform AI untuk mendokumentasikan, mempelajari, dan mewariskan bahasa daerah serta tradisi lisan Nusantara yang terancam punah. Dibangun untuk BUDAYA GO! 2026.",
  keywords: [
    "bahasa daerah",
    "tradisi lisan",
    "pelestarian budaya",
    "Nusantara",
    "budaya Indonesia",
    "pemajuan kebudayaan",
    "Warisan Suara",
    "BUDAYA GO 2026",
  ],
  authors: [{ name: "Warisan Suara Team" }],
  applicationName: "Warisan Suara",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Warisan Suara",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "Warisan Suara — Pelestarian Bahasa & Tradisi Lisan Nusantara",
    description:
      "Platform AI untuk mendokumentasikan dan mewariskan bahasa daerah serta tradisi lisan Nusantara.",
    type: "website",
    locale: "id_ID",
    siteName: "Warisan Suara",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warisan Suara",
    description: "Pelestarian Bahasa & Tradisi Lisan Nusantara dengan AI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a85c32" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
