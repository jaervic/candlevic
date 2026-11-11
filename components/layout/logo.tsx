import Link from "next/link";
import { cn } from "@/lib/utils";

export function CandleMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-accent/25 bg-accent/10",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path d="M6 3v4.2M6 12.8V17" style={{ stroke: "var(--color-accent)" }} strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        <rect x="4" y="7.2" width="4" height="5.6" rx="1" style={{ fill: "var(--color-accent)" }} />
        <path d="M14 5v2.6M14 14.4V17" style={{ stroke: "var(--color-up)" }} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <rect x="12" y="7.6" width="4" height="6.8" rx="1" style={{ fill: "var(--color-up)" }} />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Candlevic, inicio"
    >
      <CandleMark />
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        candlevic
      </span>
    </Link>
  );
}
