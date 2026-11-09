export type TraderStyle = "scalping" | "day" | "swing" | "position";

export type StyleInfo = {
  id: TraderStyle;
  name: string;
  tagline: string;
  horizon: string;
  screenTime: string;
  stress: string;
  capital: string;
  description: string;
  watchOut: string;
  lessons: string[];
  plan: { week: string; focus: string; tasks: string[] }[];
  accent: string;
};

export const STYLES: Record<TraderStyle, StyleInfo> = {
  scalping: {
    id: "scalping",
    name: "Scalping",
    tagline: "Muchas operaciones, segundos o minutos",
    horizon: "Segundos a minutos",
    screenTime: "3–6 h al día, muy concentrado",
    stress: "Muy alto",
    capital: "Requiere comisiones muy bajas y ejecución rápida",
    description:
      "Busca capturar movimientos pequeños muchas veces al día. Depende de la ejecución, el spread y la disciplina más que del análisis.",
    watchOut:
      "Es el estilo con mayor tasa de abandono y donde las comisiones pueden comerse cualquier ventaja. No es recomendable para empezar.",
    lessons: ["costes", "estilos", "stop-loss"],
    plan: [
      { week: "Semana 1", focus: "Entender los costes", tasks: ["Calcula cuánto pagas por operación", "Simula 20 operaciones sin dinero real", "Mide cuánto se lleva el spread"] },
      { week: "Semana 2", focus: "Lectura de flujo", tasks: ["Estudia volumen y spread en 1m", "Identifica 10 falsas rupturas", "Anota qué te hizo dudar"] },
      { week: "Semana 3", focus: "Proceso", tasks: ["Define reglas de entrada y salida", "Fija un máximo de operaciones diarias", "Registra cada operación en un diario"] },
      { week: "Semana 4", focus: "Revisión", tasks: ["Calcula tu esperanza matemática", "Compara resultados con y sin comisiones", "Decide si el estilo encaja contigo"] },
    ],
    accent: "#ff5c6c",
  },
  day: {
    id: "day",
    name: "Day trading",
    tagline: "Abres y cierras el mismo día",
    horizon: "Minutos a horas",
    screenTime: "2–4 h al día",
    stress: "Alto",
    capital: "Necesita margen para la volatilidad intradía",
    description:
      "Opera dentro de la sesión y cierra antes del final para no dormir con el riesgo abierto. Requiere rutina y horarios claros.",
    watchOut:
      "El ruido intradía genera muchas señales falsas. Sin un plan escrito, es fácil sobreoperar.",
    lessons: ["estilos", "temporalidades", "soporte-resistencia"],
    plan: [
      { week: "Semana 1", focus: "Base", tasks: ["Elige una sola temporalidad", "Marca soportes y resistencias de 10 sesiones", "Observa sin operar"] },
      { week: "Semana 2", focus: "Estructura", tasks: ["Identifica tendencia y rango", "Anota 10 rupturas y su resultado", "Mide el ATR diario"] },
      { week: "Semana 3", focus: "Plan", tasks: ["Escribe entrada, stop y objetivo", "Define un máximo de 2 operaciones al día", "Prueba en el replay del laboratorio"] },
      { week: "Semana 4", focus: "Métrica", tasks: ["Calcula win rate y R medio", "Revisa las 3 peores operaciones", "Ajusta una sola variable"] },
    ],
    accent: "#f0b429",
  },
  swing: {
    id: "swing",
    name: "Swing trading",
    tagline: "Días o semanas, sin vivir pegado al gráfico",
    horizon: "Días a semanas",
    screenTime: "30–60 min al día",
    stress: "Medio",
    capital: "Compatible con una cuenta pequeña",
    description:
      "Busca movimientos de varios días. Se analiza en diario o 4h y se puede compaginar con un trabajo. Es el punto de entrada más razonable para la mayoría.",
    watchOut:
      "Los gaps de apertura y las noticias pueden saltarse el stop. Hay que aceptar riesgo durante la noche.",
    lessons: ["tendencia", "medias-moviles", "ratio-riesgo-beneficio"],
    plan: [
      { week: "Semana 1", focus: "Estructura", tasks: ["Analiza 5 activos en diario", "Marca tendencia, soporte y resistencia", "Elige uno y síguelo"] },
      { week: "Semana 2", focus: "Entradas", tasks: ["Define qué es un pullback válido", "Estudia 10 rupturas con volumen", "Anota el contexto de cada una"] },
      { week: "Semana 3", focus: "Riesgo", tasks: ["Calcula el tamaño de posición", "Fija stops por ATR", "Simula 5 operaciones completas"] },
      { week: "Semana 4", focus: "Diario", tasks: ["Registra cada decisión", "Compara plan vs. ejecución", "Escribe tus 3 reglas personales"] },
    ],
    accent: "#2fd47c",
  },
  position: {
    id: "position",
    name: "Position trading / DCA",
    tagline: "Meses o años, con poco ruido",
    horizon: "Meses a años",
    screenTime: "15 min a la semana",
    stress: "Bajo",
    capital: "Apto para empezar con poco",
    description:
      "Prioriza la tendencia de largo plazo y las compras periódicas. Menos decisiones, menos costes y más dependencia de la paciencia.",
    watchOut:
      "Requiere tolerar drawdowns grandes sin vender en pánico. La paciencia es la estrategia.",
    lessons: ["que-es-invertir", "expectativas-realistas", "costes"],
    plan: [
      { week: "Semana 1", focus: "Expectativas", tasks: ["Define tu horizonte real", "Calcula cuánto puedes aportar al mes", "Lee sobre drawdowns históricos"] },
      { week: "Semana 2", focus: "Estrategia", tasks: ["Elige 2–3 activos diversificados", "Define una aportación periódica", "Evita mirar el precio a diario"] },
      { week: "Semana 3", focus: "Custodia", tasks: ["Revisa dónde guardas tus activos", "Comprueba comisiones anuales", "Configura un registro simple"] },
      { week: "Semana 4", focus: "Revisión", tasks: ["Revisa la asignación una vez", "Escribe tu plan ante caídas del 30%", "No cambies nada por una noticia"] },
    ],
    accent: "#5aa9ff",
  },
};

export type ProfileQuestion = {
  id: string;
  question: string;
  options: { label: string; scores: Partial<Record<TraderStyle, number>> }[];
};

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: "tiempo",
    question: "¿Cuánto tiempo real puedes dedicar al mercado cada día?",
    options: [
      { label: "Menos de 30 minutos", scores: { position: 3, swing: 1 } },
      { label: "Entre 30 minutos y 2 horas", scores: { swing: 3, position: 1 } },
      { label: "Toda la sesión de mercado", scores: { day: 3, swing: 1 } },
      { label: "Puedo estar pegado a la pantalla muchas horas", scores: { scalping: 3, day: 1 } },
    ],
  },
  {
    id: "estres",
    question: "¿Cómo llevas ver la cuenta en rojo durante horas?",
    options: [
      { label: "Me pone muy nervioso", scores: { position: 3, swing: 1 } },
      { label: "Lo tolero si tengo un plan", scores: { swing: 3, day: 1 } },
      { label: "Me motiva, pero necesito cerrar el día tranquilo", scores: { day: 3 } },
      { label: "La adrenalina no me afecta", scores: { scalping: 3 } },
    ],
  },
  {
    id: "frecuencia",
    question: "¿Con qué frecuencia te gustaría tomar decisiones?",
    options: [
      { label: "Una vez al mes o menos", scores: { position: 3 } },
      { label: "Unas pocas veces por semana", scores: { swing: 3, position: 1 } },
      { label: "Varias veces al día", scores: { day: 3 } },
      { label: "Decenas de veces al día", scores: { scalping: 3 } },
    ],
  },
  {
    id: "capital",
    question: "¿Qué parte de tus ahorros vas a dedicar a esto?",
    options: [
      { label: "Una cantidad pequeña que puedo permitirme perder", scores: { position: 2, swing: 2 } },
      { label: "Una parte moderada, con colchón aparte", scores: { swing: 3 } },
      { label: "Capital suficiente para operar activamente", scores: { day: 2, swing: 1 } },
      { label: "Aún no lo sé; quiero aprender primero", scores: { position: 3 } },
    ],
  },
  {
    id: "motivacion",
    question: "¿Qué te atrae más de aprender trading?",
    options: [
      { label: "Entender y hacer crecer mis ahorros con calma", scores: { position: 3 } },
      { label: "Aprovechar movimientos de varios días", scores: { swing: 3 } },
      { label: "Operar con método durante la sesión", scores: { day: 3 } },
      { label: "La intensidad y la velocidad del mercado", scores: { scalping: 3 } },
    ],
  },
];

export function scoreProfile(answers: number[]): TraderStyle {
  const totals: Record<TraderStyle, number> = {
    scalping: 0,
    day: 0,
    swing: 0,
    position: 0,
  };

  answers.forEach((optionIndex, questionIndex) => {
    const option = PROFILE_QUESTIONS[questionIndex]?.options[optionIndex];
    if (!option) return;
    for (const [style, points] of Object.entries(option.scores)) {
      totals[style as TraderStyle] += points;
    }
  });

  return (Object.entries(totals) as [TraderStyle, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}
