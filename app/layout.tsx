import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Onboarding } from "@/components/onboarding";
import { ProgressSync } from "@/components/progress/progress-sync";
import { PwaRegister } from "@/components/pwa-register";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  preload: true,
});

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
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const THEME_INIT = `(function(){try{
var raw=localStorage.getItem("candlevic:prefs:v1");
var s=raw?JSON.parse(raw).state:null;
var mode=(s&&s.theme)||"system";
var dark=window.matchMedia("(prefers-color-scheme: dark)").matches;
var t=mode==="system"?(dark?"noche":"papel"):mode;
var r=document.documentElement;
r.setAttribute("data-theme",t);
var ambient=(s&&s.ambient)||"auto";
var desktop=window.matchMedia("(min-width: 768px)").matches;
var ambientOn=ambient==="on"||(ambient==="auto"&&desktop);
r.setAttribute("data-ambient",ambientOn?"on":"off");
var motion=(s&&s.motion)||"system";
var reduced=motion==="reduced"||window.matchMedia("(prefers-reduced-motion: reduce)").matches;
r.setAttribute("data-reduced-motion",reduced?"true":"false");
if(s){
if(typeof s.readingSize==="number")r.style.setProperty("--cv-reading-size",s.readingSize+"px");
if(typeof s.readingLeading==="number")r.style.setProperty("--cv-reading-leading",String(s.readingLeading));
if(typeof s.readingWidth==="number")r.style.setProperty("--cv-reading-width",s.readingWidth+"ch");
}
var meta=document.querySelector('meta[name="theme-color"]');
if(meta)meta.setAttribute("content",t==="papel"?"#f7f5f0":t==="sepia"?"#f3ead8":t==="grafito"?"#15181c":"#0b0f14");
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <AmbientBackground />
        <ThemeProvider>
          <Header />
          <main className="app-main mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:pb-16">
            {children}
          </main>
          <BottomNav />
          <Onboarding />
          <ProgressSync />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
