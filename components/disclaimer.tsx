import Link from "next/link";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed text-faint ${className}`}>
      Candlevic es contenido educativo y no constituye asesoramiento financiero,
      recomendación de inversión ni señal de trading. Los datos pueden tener retraso o
      errores. Opera bajo tu responsabilidad y nunca inviertas dinero que no puedas
      permitirte perder.{" "}
      <Link href="/aprender/que-es-invertir" className="text-muted underline-offset-4 hover:text-fg hover:underline">
        Empieza por aquí
      </Link>
      .
    </p>
  );
}
