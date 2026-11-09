import Link from "next/link";

const TABS = [
  { href: "/aprender", label: "Ruta" },
  { href: "/aprender/estudios", label: "Estudios" },
  { href: "/aprender/biblioteca", label: "Biblioteca" },
  { href: "/aprender/glosario", label: "Glosario" },
];

export function LearnTabs({ active }: { active: string }) {
  return (
    <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={
            tab.href === active
              ? "shrink-0 rounded-lg bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-fg"
              : "shrink-0 rounded-lg px-3 py-1.5 text-[12px] text-muted transition-colors hover:bg-surface-2/60 hover:text-fg"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
