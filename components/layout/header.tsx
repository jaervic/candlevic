"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Flame, FlaskConical, Radio, Search, Settings2, Wallet, Zap } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { totalXp, useProgress } from "@/lib/progress";
import { useUI } from "@/lib/ui";

const NAV = [
  { href: "/aprender", label: "Aprender", icon: BookOpen },
  { href: "/radar", label: "Radar", icon: Radio },
  { href: "/lab", label: "Lab", icon: FlaskConical },
  { href: "/demo", label: "Demo", icon: Wallet },
  { href: "/progreso", label: "Progreso", icon: Zap },
];

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);
  const streak = useProgress((s) => s.streak.current);
  const xp = hydrated ? totalXp(lessons) : 0;
  const openSettings = useUI((s) => s.openSettings);
  const openSearch = useUI((s) => s.openSearch);

  return (
    <header className="app-header sticky top-0 z-40 border-b border-line/70 bg-bg/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-surface-2 text-fg"
                    : "text-muted hover:bg-surface-2/60 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openSearch}
            aria-label="Buscar"
            title="Buscar (⌘K)"
            className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface px-2.5 text-[12px] text-muted transition-colors hover:border-line-strong hover:text-fg md:px-3"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Buscar</span>
            <kbd className="hidden rounded border border-line px-1 text-[9px] text-faint md:inline">
              ⌘K
            </kbd>
          </button>
          <span
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-[12px] text-muted"
            title="Racha de días seguidos"
          >
            <Flame className={cn("h-3.5 w-3.5", streak > 0 ? "text-accent" : "text-faint")} />
            <span className="num text-fg">{hydrated ? streak : 0}</span>
          </span>
          <span
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-[12px] text-muted"
            title="Experiencia acumulada"
          >
            <Zap className="h-3.5 w-3.5 text-info" />
            <span className="num text-fg">{xp}</span>
            <span className="hidden sm:inline">XP</span>
          </span>
          <button
            onClick={openSettings}
            aria-label="Ajustes de lectura"
            title="Ajustes de lectura"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
