import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Accesibilidad",
  description:
    "Compromiso de accesibilidad de Candlevic: temas, lectura, teclado, movimiento reducido y gráficos con datos alternativos.",
};

export default function AccesibilidadPage() {
  return (
    <LegalPage title="Accesibilidad" updated="12 de noviembre de 2026">
      <p>
        Candlevic quiere ser una web que se pueda leer y usar en un móvil
        corriente, con poca luz, con vista cansada o con un lector de pantalla.
        No siempre lo conseguimos, pero es el objetivo.
      </p>

      <h2>Qué incluimos</h2>
      <ul>
        <li>Cuatro temas: Noche, Grafito, Papel y Sepia, con detección del sistema.</li>
        <li>Tamaño de letra, interlineado y ancho de lectura ajustables.</li>
        <li>Modo concentración para leer sin distracciones.</li>
        <li>Respeto a <code>prefers-reduced-motion</code> y opción de movimiento reducido.</li>
        <li>Modo daltónico con velas huecas y rellenas, no solo color.</li>
        <li>Tabla de datos OHLCV y resumen textual en los gráficos.</li>
        <li>Foco visible, etiquetas ARIA y navegación por teclado en diálogos y menús.</li>
        <li>Contraste revisado para texto principal y secundario.</li>
      </ul>

      <h2>Limitaciones conocidas</h2>
      <ul>
        <li>Los gráficos son canvas: ofrecemos tabla y resumen, pero no son navegables vela a vela con teclado.</li>
        <li>Algunos titulares y enlaces externos dependen de los medios de origen.</li>
        <li>El panel de RSI/MACD comparte escala visual con el gráfico principal; estamos mejorando su separación.</li>
        <li>La app está en español; el inglés llegará más adelante.</li>
      </ul>

      <h2>Objetivo</h2>
      <p>
        Aspiramos a WCAG 2.2 nivel AA. Si encuentras una barrera concreta, abre una
        incidencia en{" "}
        <a
          href="https://github.com/jaervic/candlevic/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{" "}
        indicando la página y el problema. Es la forma más rápida de arreglarlo.
      </p>

      <h2>Contacto</h2>
      <p>
        También puedes usar el botón de ajustes de lectura para cambiar el tema y
        el tamaño de letra sin salir de la página.
      </p>
    </LegalPage>
  );
}
