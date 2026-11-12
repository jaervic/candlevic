import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Privacidad",
  description:
    "Qué datos guarda Candlevic, dónde se guardan y cómo puedes borrarlos.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Privacidad" updated="12 de noviembre de 2026">
      <p>
        Candlevic está diseñada para funcionar sin cuentas, sin email y sin
        rastreo publicitario. Esta página explica qué se guarda y dónde.
      </p>

      <h2>Datos en tu dispositivo</h2>
      <p>
        El progreso de las lecciones, las preferencias de lectura, tu plan de
        trading y la cartera del simulador se guardan en el almacenamiento local
        de tu navegador (<code>localStorage</code>). No se envían a nuestros
        servidores.
      </p>
      <ul>
        <li>Progreso: lecciones completadas, resultados de quizzes, racha y logros.</li>
        <li>Preferencias: tema, tamaño de letra, interlineado, ancho y modo daltónico.</li>
        <li>Plan de trading: los campos que rellenas en el constructor de plan.</li>
        <li>Cartera demo: efectivo, posiciones, operaciones y notas del simulador.</li>
      </ul>

      <h2>Respaldo cifrado opcional</h2>
      <p>
        Si creas un código de guardado, el progreso se cifra en tu navegador con
        AES-GCM y una clave derivada del código mediante PBKDF2. El servidor solo
        almacena un bloque cifrado y no puede leerlo. El código no se envía al
        servidor.
      </p>
      <p>
        En la versión sin nube, el código es autónomo: contiene el progreso
        codificado y no depende de ningún servidor.
      </p>

      <h2>Noticias y enlaces externos</h2>
      <p>
        El radar muestra titulares y enlaces a medios externos. Al hacer clic,
        entras en su web y se aplican sus políticas de privacidad. No enviamos
        datos personales a esos medios.
      </p>

      <h2>Analítica</h2>
      <p>
        Candlevic puede activar una analítica agregada y sin cookies (Umami) para
        saber qué lecciones se abandonan y mejorar el contenido. Si está activa,
        no se usan datos personales, no se crean perfiles y no se comparte
        información con anunciantes. Si el operador no configura la analítica, no
        se carga ningún script.
      </p>

      <h2>Lo que no hacemos</h2>
      <ul>
        <li>No vendemos datos.</li>
        <li>No creamos cuentas ni pedimos email.</li>
        <li>No usamos píxeles publicitarios ni cookies de seguimiento.</li>
        <li>No compartimos tu progreso con terceros.</li>
      </ul>

      <h2>Cómo borrar tus datos</h2>
      <p>
        Puedes borrar el progreso local desde{" "}
        <a href="/progreso">Progreso</a> o borrando los datos del sitio en tu
        navegador. El respaldo en la nube, si existe, se elimina al dejar de usar
        el código; no está vinculado a tu identidad.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier duda de privacidad, abre una incidencia en{" "}
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
