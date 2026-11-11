# Candlevic

**Aprende trading viendo velas.**

Web app educativa, gratuita y mobile-first para aprender trading de acciones y cripto: lecciones cortas, gráficos interactivos, quizzes, laboratorio de práctica y un radar de noticias con contexto.

> Candlevic es contenido educativo. No es asesoramiento financiero, no da señales y no promete rentabilidad.

| Móvil | Laboratorio |
| --- | --- |
| ![Inicio en móvil](docs/home-mobile.png) | ![Laboratorio en escritorio](docs/lab-desktop.png) |


## Qué incluye

- **14 lecciones** repartidas en 7 módulos: mentalidad, fundamentos, estilos de trading, velas, tendencia, indicadores y gestión de riesgo.
- **Cuatro temas** (Noche, Grafito, Papel y Sepia) con detección del sistema, tipografía Inter y ajustes de lectura: tamaño, interlineado, ancho, modo concentración y fondo ambiente.
- **Buscador global (⌘K)** en lecciones, glosario, libros, estudios, explicadores y páginas.
- **Índice de lección** en escritorio y hoja inferior en móvil, con seguimiento de la sección activa.
- **Repaso espaciado** a nivel de lección y **dominio por módulo**, con señal de confianza en los quizzes.
- **Quizzes con explicación de cada opción incorrecta**, no solo de la correcta.
- **Gráficos reales interactivos** con velas, medias móviles, RSI, volumen, marcadores y líneas de precio.
- **Quizzes y ejercicios** con explicación de cada respuesta.
- **Laboratorio**: indicadores, replay de velas, líneas horizontales y datos en vivo de Binance.
- **Radar**: titulares en español de cripto, bolsa y macro, calendario de eventos y explicadores permanentes.
- **Estudios**: casos históricos (LUNA, COVID) y evidencia científica (Barber & Odean, SPIVA, Dalbar…).
- **Biblioteca**: fichas originales de 10 libros clave del trading.
- **Glosario** con buscador y categorías.
- **Test “¿Qué trader eres?”** con plan de 30 días.
- **Progreso local** con XP, racha y logros. Respaldo con un código de guardado: corto y cifrado si hay nube (Upstash), o autónomo y sin servidor si no la hay. Sin email ni contraseña.
- **PWA** instalable y con soporte offline para el contenido ya visitado.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Inter variable autoalojada (48 KB, subset latino)
- lightweight-charts (TradingView)
- Zustand para el progreso local
- MDX para el contenido
- Upstash Redis (opcional) para el respaldo cifrado
- Vitest para tests

## Empezar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

### Variables de entorno (opcional)

El respaldo en la nube usa Upstash Redis. Sin estas variables la app funciona igual: el respaldo se desactiva y queda la exportación/importación de un archivo JSON.

```bash
cp .env.example .env.local
```

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

En desarrollo, si no hay Upstash, el respaldo se guarda en `.data/progress-backups.json` (ignorado por git).

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servidor de producción
npm test           # tests (indicadores + cifrado)
npm run typecheck  # TypeScript
node scripts/fetch-data.mjs   # refresca los datasets desde Binance y Yahoo
```

## Estructura

```
app/                  rutas y API
content/              lecciones, estudios, radar, biblioteca, glosario
components/           UI, gráficos, lecciones, laboratorio, progreso
lib/                  indicadores, datos, contenido, progreso, cifrado, noticias
data/                 datasets OHLCV incluidos
scripts/              descarga de datos y generación de iconos
```

## Añadir una lección

Crea un archivo en `content/lecciones/mi-leccion.mdx`:

```mdx
---
title: "Mi lección"
module: "m4"
order: 1
minutes: 4
level: "principiante"
summary: "Resumen de una frase."
objectives:
  - "Objetivo 1"
dataset: "btc-1d"
related: ["tendencia"]
tags: ["tendencia"]
---

Texto de la lección.

<Callout type="tip">Un consejo.</Callout>

<DatasetChart dataset="btc-1d" from={600} to={700} showVolume />

<Quiz
  question="¿Pregunta?"
  options={["A", "B", "C"]}
  correct={1}
  explanation="Por qué."
/>
```

El frontmatter se valida con Zod en el build: si falta un campo, el build falla con un mensaje claro.

> El MDX se compila con `blockJS: false` porque el contenido es propio y de confianza (usa props JSX como `from={600}` o `markers={[...]}`). No se renderiza MDX enviado por usuarios.

## Despliegue

Pensado para Vercel:

1. Importa el repositorio en Vercel.
2. Añade `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` si quieres activar el respaldo.
3. Deploy.

También funciona en cualquier hosting que soporte Next.js.

## Privacidad y datos

- El progreso se guarda en el navegador (localStorage).
- El respaldo se cifra en el cliente con AES-GCM y una clave derivada del código mediante PBKDF2. El servidor solo almacena un blob cifrado y no puede leerlo.
- No hay cuentas, email ni analítica de terceros.
- Las noticias enlazan siempre a la fuente original.

## Derechos de autor

Las fichas de libros y los resúmenes de estudios son originales y educativos. No reproducen texto de las obras citadas. Las noticias pertenecen a sus respectivos medios y se muestran solo como titular, extracto corto y enlace.

## Licencia

MIT. Ver [LICENSE](./LICENSE).
