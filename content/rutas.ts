export type PathIcon = "sparkles" | "shield" | "chart" | "bitcoin";

export type LearningPath = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  level: "principiante" | "intermedio" | "avanzado";
  icon: PathIcon;
  accent: string;
  outcomes: string[];
  lessons: string[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "desde-cero",
    name: "Empieza desde cero",
    tagline: "El orden que yo seguiría si hoy supiera lo que sé.",
    description:
      "Nueve lecciones para pasar de no saber qué es una vela a tener un plan con riesgo definido. Sin atajos y sin señales.",
    level: "principiante",
    icon: "sparkles",
    accent: "#f0b429",
    outcomes: [
      "Entender qué estás comprando y qué esperar del mercado",
      "Leer un gráfico y reconocer una tendencia",
      "Definir un stop y un tamaño de posición antes de entrar",
    ],
    lessons: [
      "que-es-invertir",
      "expectativas-realistas",
      "acciones-y-cripto",
      "ordenes",
      "costes",
      "velas",
      "tipos-de-grafico",
      "stop-loss",
      "plan-de-trading",
    ],
  },
  {
    slug: "riesgo",
    name: "Gestión de riesgo",
    tagline: "Sobrevivir primero. Ganar, después.",
    description:
      "Ocho lecciones para que ninguna operación pueda sacarte del juego. Tamaño, drawdown, esperanza y repaso de errores.",
    level: "intermedio",
    icon: "shield",
    accent: "#fb923c",
    outcomes: [
      "Calcular cuánto arriesgar en cada operación",
      "Entender el drawdown y el riesgo de ruina",
      "Medir una estrategia con esperanza y muestra",
    ],
    lessons: [
      "stop-loss",
      "ratio-riesgo-beneficio",
      "apalancamiento",
      "drawdown-riesgo-ruina",
      "expectativa-matematica",
      "backtesting",
      "diario-de-trading",
      "psicologia-drawdown",
    ],
  },
  {
    slug: "graficos",
    name: "Leer gráficos con criterio",
    tagline: "Del ruido de las velas a una estructura que se puede explicar.",
    description:
      "Ocho lecciones de análisis técnico sin humo: estructura, niveles, medias e indicadores, con sus límites.",
    level: "principiante",
    icon: "chart",
    accent: "#5aa9ff",
    outcomes: [
      "Identificar tendencia, rango y niveles relevantes",
      "Usar medias e indicadores como contexto, no como señales",
      "Reconocer patrones y saber cuándo fallan",
    ],
    lessons: [
      "velas",
      "tipos-de-grafico",
      "tendencia",
      "soporte-resistencia",
      "medias-moviles",
      "rsi",
      "macd-bollinger",
      "patrones",
    ],
  },
  {
    slug: "cripto",
    name: "Cripto sin humo",
    tagline: "Custodia, estafas y perpetuos antes que predicciones.",
    description:
      "Ocho lecciones para entender qué hay debajo de una criptomoneda, cómo guardarla y qué riesgos no desaparecen.",
    level: "intermedio",
    icon: "bitcoin",
    accent: "#f59e0b",
    outcomes: [
      "Distinguir una wallet de un exchange y sus riesgos",
      "Reconocer estafas y malas prácticas habituales",
      "Entender funding, apalancamiento y liquidación",
    ],
    lessons: [
      "acciones-y-cripto",
      "wallets-custodia",
      "stablecoins",
      "estafas-seguridad",
      "on-chain",
      "perpetuos-funding",
      "apalancamiento",
      "dca-vs-trading",
    ],
  },
];

export function getLearningPath(slug: string) {
  return LEARNING_PATHS.find((path) => path.slug === slug);
}
