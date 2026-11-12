"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FlaskConical, Radio, Wallet, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/aprender", label: "Aprender", icon: BookOpen },
  { href: "/radar", label: "Radar", icon: Radio },
  { href: "/lab", label: "Lab", icon: FlaskConical },
  { href: "/demo", label: "Demo", icon: Wallet },
  { href: "/progreso", label: "Progreso", icon: Zap },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-nav safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-bg md:hidden"
      aria-label="Navegación principal"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                active ? "text-accent" : "text-faint hover:text-muted",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_10px_rgba(240,180,41,0.35)]")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
