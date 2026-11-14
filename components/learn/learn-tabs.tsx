import Link from "next/link";

const TABS = [
  { href: "/aprender", label: "Módulos" },
  { href: "/aprender/rutas", label: "Rutas" },
  { href: "/aprender/estrategias", label: "Estrategias" },
  { href: "/aprender/estudios", label: "Estudios" },
  { href: "/aprender/biblioteca", label: "Biblioteca" },
  { href: "/aprender/glosario", label: "Glosario" },
];

export function LearnTabs({ active }: { active: string }) {
  return (
    <nav
      className="-mx-1 flex flex-wrap gap-1.5 px-1 pb-1"
      aria-label="Secciones de Aprender"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={
            tab.href === active
              ? "shrink-0 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[12px] font-medium text-fg sm:px-3"
              : "shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:bg-surface-2/60 hover:text-fg sm:px-3"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
