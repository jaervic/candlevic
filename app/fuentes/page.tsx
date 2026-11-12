import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Fuentes y atribuciones",
  description:
    "Proveedores de datos, medios, libros, estudios y licencias que hacen posible Candlevic.",
};

export default function FuentesPage() {
  return (
    <LegalPage title="Fuentes y atribuciones" updated="12 de noviembre de 2026">
      <p>
        Candlevic usa datos y obras de terceros. Esta página resume las fuentes
        principales y sus condiciones.
      </p>

      <h2>Datos de mercado</h2>
      <ul>
        <li>
          <strong>Binance</strong> y <strong>Binance Vision</strong>: velas de
          cripto para el laboratorio y los datasets incluidos.
        </li>
        <li>
          <strong>Coinbase Exchange</strong>: respaldo de datos de cripto cuando
          Binance no está disponible en la región del servidor.
        </li>
        <li>
          <strong>Yahoo Finance</strong>: datos históricos de acciones y ETFs
          (SPY, TSLA, AAPL) incluidos como datasets.
        </li>
      </ul>
      <p>
        Los datos pueden tener retrasos o errores y no deben usarse para operar
        con dinero real.
      </p>

      <h2>Noticias</h2>
      <p>
        El radar enlaza titulares de Criptonoticias, Investing.com y El País
        (Economía). Los titulares y extractos pertenecen a sus medios; el enlace
        lleva siempre a la fuente original.
      </p>

      <h2>Libros</h2>
      <p>
        Las fichas de la biblioteca resumen ideas de obras de John J. Murphy,
        Steve Nison, Alexander Elder, Mark Douglas, Van Tharp, William O'Neil,
        Edwin Lefèvre, Rubén Villahermosa, Benjamin Graham y Al Brooks. Son
        resúmenes originales y educativos, no reproducciones. Los derechos
        pertenecen a sus autores y editoriales.
      </p>

      <h2>Estudios</h2>
      <p>
        Las fichas de evidencia resumen trabajos de Barber y Odean, Chague y
        De-Losso, Barber, Lee, Liu y Odean, SPIVA (S&amp;P Dow Jones Indices) y
        Dalbar. Se citan autor, año y fuente; las conclusiones son nuestras.
      </p>

      <h2>Software y tipografía</h2>
      <ul>
        <li>Next.js y React: licencia MIT.</li>
        <li>lightweight-charts (TradingView): licencia Apache 2.0.</li>
        <li>Inter: SIL Open Font License.</li>
        <li>Lucide: licencia ISC.</li>
        <li>Tailwind CSS: licencia MIT.</li>
      </ul>

      <h2>Atribución</h2>
      <p>
        Si reutilizas el código, conserva la licencia MIT y las atribuciones de
        las dependencias. Si citas el contenido, enlaza a la lección original.
      </p>
    </LegalPage>
  );
}
