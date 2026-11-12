import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso de Candlevic: contenido educativo, riesgo y responsabilidad.",
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de uso" updated="12 de noviembre de 2026">
      <p>
        Al usar Candlevic aceptas estos términos. Si no estás de acuerdo, no uses
        la web.
      </p>

      <h2>Contenido educativo, no asesoramiento</h2>
      <p>
        Todo el contenido es educativo e informativo. No constituye asesoramiento
        financiero, legal ni fiscal, ni una recomendación de compra o venta de
        ningún activo. Las decisiones que tomes son tuyas y bajo tu
        responsabilidad.
      </p>

      <h2>Riesgo</h2>
      <p>
        Operar en mercados financieros implica riesgo de pérdida. Puedes perder
        parte o todo el capital. El apalancamiento y los productos derivados
        pueden ampliar las pérdidas. No inviertas dinero que no puedas permitirte
        perder.
      </p>

      <h2>Datos y disponibilidad</h2>
      <p>
        Los datos de mercado pueden tener retrasos, errores o interrupciones. Los
        precios en vivo dependen de proveedores externos (Binance, Coinbase) y
        los datasets de acciones son históricos. El simulador usa dinero virtual y
        no envía órdenes reales.
      </p>
      <p>
        No garantizamos que la web esté disponible de forma ininterrumpida ni que
        el contenido esté libre de errores.
      </p>

      <h2>Sin garantía de resultados</h2>
      <p>
        No prometemos rentabilidad ni resultados. Los ejemplos, backtests y casos
        históricos no garantizan el comportamiento futuro del mercado.
      </p>

      <h2>Uso permitido</h2>
      <ul>
        <li>Puedes usar la web para aprender y practicar.</li>
        <li>No puedes revender el contenido como si fuera propio.</li>
        <li>No puedes intentar interrumpir el servicio ni extraer datos de forma abusiva.</li>
        <li>No puedes usar la web para actividades ilegales.</li>
      </ul>

      <h2>Propiedad intelectual</h2>
      <p>
        El código es abierto bajo licencia MIT. Los textos, gráficos y fichas son
        originales de Candlevic. Las marcas, libros, estudios y noticias
        pertenecen a sus autores y medios. Los resúmenes de libros son
        interpretaciones educativas y no reproducciones.
      </p>

      <h2>Enlaces a terceros</h2>
      <p>
        La web enlaza a medios, proveedores de datos y repositorios externos. No
        controlamos su contenido ni sus políticas y no somos responsables de
        ellos.
      </p>

      <h2>Cambios</h2>
      <p>
        Podemos actualizar estos términos y el contenido. La fecha de la parte
        superior indica la última revisión. Si un cambio es relevante, se
        reflejará en esta página.
      </p>

      <h2>Contacto</h2>
      <p>
        Para dudas sobre estos términos, abre una incidencia en{" "}
        <a
          href="https://github.com/jaervic/candlevic/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </LegalPage>
  );
}
