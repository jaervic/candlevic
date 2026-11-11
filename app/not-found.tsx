import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <p className="num text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-3 text-xl font-semibold">Esta página no existe</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Puede que la lección todavía no esté publicada o que el enlace esté mal.
      </p>
      <Link
        href="/aprender"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la ruta
      </Link>
    </div>
  );
}
