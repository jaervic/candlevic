export type ModuleId =
  | "m0"
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "m6"
  | "m7"
  | "m8";

export type CourseModule = {
  id: ModuleId;
  title: string;
  short: string;
  description: string;
  icon:
    | "brain"
    | "landmark"
    | "timer"
    | "chart"
    | "trend"
    | "gauge"
    | "shield"
    | "target"
    | "bitcoin";
  accent: string;
};

export const MODULES: CourseModule[] = [
  {
    id: "m0",
    title: "Mentalidad y expectativas",
    short: "Mentalidad",
    description:
      "Qué significa invertir de verdad, qué esperar y cómo evitar las trampas más comunes.",
    icon: "brain",
    accent: "#a78bfa",
  },
  {
    id: "m1",
    title: "Fundamentos del mercado",
    short: "Fundamentos",
    description:
      "Acciones, cripto, órdenes, spread, comisiones y todo lo que ocurre cuando pulsas comprar.",
    icon: "landmark",
    accent: "#5aa9ff",
  },
  {
    id: "m2",
    title: "Estilos de trading",
    short: "Estilos",
    description:
      "Scalping, day trading, swing, posición… cuál encaja con tu tiempo, tu capital y tu cabeza.",
    icon: "timer",
    accent: "#f0b429",
  },
  {
    id: "m3",
    title: "Leer un gráfico",
    short: "Gráficos",
    description:
      "Velas japonesas, temporalidades, volumen y escala. El alfabeto del análisis técnico.",
    icon: "chart",
    accent: "#2fd47c",
  },
  {
    id: "m4",
    title: "Análisis técnico I: tendencia",
    short: "Tendencia",
    description:
      "Teoría de Dow, estructura de máximos y mínimos, soportes, resistencias y rupturas.",
    icon: "trend",
    accent: "#34d399",
  },
  {
    id: "m5",
    title: "Análisis técnico II: indicadores",
    short: "Indicadores",
    description:
      "Medias móviles, RSI, MACD, Bollinger y volumen. Qué miden, qué no y cuándo engañan.",
    icon: "gauge",
    accent: "#22d3ee",
  },
  {
    id: "m6",
    title: "Gestión de riesgo",
    short: "Riesgo",
    description:
      "Lo único que separa a un trader que aguanta de uno que desaparece: sobrevivir.",
    icon: "shield",
    accent: "#fb923c",
  },
  {
    id: "m7",
    title: "Estrategia y psicología",
    short: "Estrategia",
    description:
      "Tu plan, tu diario, tus sesgos. Cómo convertir ideas en un proceso repetible.",
    icon: "target",
    accent: "#f472b6",
  },
  {
    id: "m8",
    title: "Cripto en la práctica",
    short: "Cripto",
    description:
      "Wallets, custodia, stablecoins, funding y las reglas propias de un mercado 24/7.",
    icon: "bitcoin",
    accent: "#f59e0b",
  },
];

export const MODULE_MAP = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
) as Record<ModuleId, CourseModule>;

export function moduleIndex(id: ModuleId) {
  return MODULES.findIndex((m) => m.id === id);
}
