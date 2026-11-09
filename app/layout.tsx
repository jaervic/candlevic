import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Onboarding } from "@/components/onboarding";
import { ProgressSync } from "@/components/progress/progress-sync";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://candlevic.com"),
  title: {
    default: "Candlevic — Aprende trading viendo velas",
    template: "%s · Candlevic",
  },
  description:
    "Aprende trading de acciones y cripto con lecciones cortas, gráficos interactivos, quizzes y un laboratorio para practicar. Gratis, en español y sin registro.",
  applicationName: "Candlevic",
  keywords: [
    "aprender trading",
    "curso de trading gratis",
    "análisis técnico",
    "criptomonedas",
    "velas japonesas",
    "educación financiera",
  ],
  openGraph: {
    title: "Candlevic — Aprende trading viendo velas",
    description:
      "Lecciones cortas, gráficos interactivos y práctica real. Gratis y sin registro.",
    type: "website",
    locale: "es_ES",
    siteName: "Candlevic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Candlevic — Aprende trading viendo velas",
    description:
      "Lecciones cortas, gráficos interactivos y práctica real. Gratis y sin registro.",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#07090c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Header />
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:pb-16">
          {children}
        </main>
        <BottomNav />
        <Onboarding />
        <ProgressSync />
        <PwaRegister />
      </body>
    </html>
  );
}
