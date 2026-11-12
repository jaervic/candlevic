import Link from "next/link";
import { Disclaimer } from "./disclaimer";

const LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/accesibilidad", label: "Accesibilidad" },
  { href: "/fuentes", label: "Fuentes" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer mt-10 border-t border-line pt-4">
      <nav
        aria-label="Información legal"
        className="flex flex-wrap gap-x-4 gap-y-2 text-[10.5px] text-faint"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-fg"
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://github.com/jaervic/candlevic"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          GitHub
        </a>
      </nav>
      <Disclaimer className="mt-2" />
    </footer>
  );
}
