import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Sobre Candlevic",
  description:
    "Qué es Candlevic, cómo se crea el contenido y por qué es gratuito, independiente y educativo.",
};

export default function SobrePage() {
  return (
    <LegalPage title="Sobre Candlevic" updated="12 de noviembre de 2026">
      <p>
        Candlevic nace de una idea sencilla: aprender trading no debería depender
        de un curso caro, de un grupo de señales o de un vídeo que promete
        rentabilidades imposibles.
      </p>
      <p>
        Es una web educativa, gratuita y sin registro para aprender trading de
        acciones y cripto con lecciones cortas, gráficos interactivos, ejercicios
        y un laboratorio para practicar.
      </p>

      <h2>Qué es</h2>
      <ul>
        <li>Un curso estructurado de fundamentos, análisis técnico, riesgo y psicología.</li>
        <li>Un laboratorio para practicar con datos reales y un simulador con dinero virtual.</li>
        <li>Un radar de noticias con contexto, no una fuente de señales.</li>
        <li>Una biblioteca de ideas de libros clásicos, resumidas y citadas.</li>
      </ul>

      <h2>Qué no es</h2>
      <ul>
        <li>No es asesoramiento financiero ni una recomendación de inversión.</li>
        <li>No vende señales, cursos, gestión de fondos ni enlaces de afiliado.</li>
        <li>No promete rentabilidad ni resultados.</li>
        <li>No sustituye la lectura de las fuentes originales ni el criterio propio.</li>
      </ul>

      <h2>Cómo se crea el contenido</h2>
      <p>
        Cada lección se escribe a partir de fuentes públicas, libros de referencia
        y datos de mercado. Los resúmenes de libros son originales y no
        reproducen texto de las obras. Las afirmaciones técnicas se contrastan con
        los gráficos y, cuando aplica, con evidencia publicada.
      </p>
      <p>
        El contenido puede cambiar cuando encontramos un error o una explicación
        mejor. Si detectas uno, puedes abrir una incidencia en{" "}
        <a
          href="https://github.com/jaervic/candlevic/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>

      <h2>Independencia</h2>
      <p>
        Candlevic no tiene publicidad, patrocinios ni enlaces de afiliado. El
        código es abierto bajo licencia MIT. Eso no garantiza que sea perfecto,
        pero sí que puedes revisar cómo funciona y reutilizarlo.
      </p>

      <h2>Empieza por aquí</h2>
      <p>
        Si es tu primera vez, lee{" "}
        <Link href="/aprender/que-es-invertir">¿Invertir, especular o apostar?</Link>{" "}
        y después sigue la ruta del principiante.
      </p>

      <p className="text-[11px] text-faint">
        Candlevic es contenido educativo. No es asesoramiento financiero. Nunca
        inviertas dinero que no puedas permitirte perder.
      </p>
    </LegalPage>
  );
}
