import type { DatasetId } from "@/lib/datasets";
import type { StrategyId } from "@/lib/backtest";

export type StrategyFamily =
  | "tendencia"
  | "ruptura"
  | "reversion"
  | "rango"
  | "pasiva"
  | "cripto";

export type StrategyDifficulty = "principiante" | "intermedio" | "avanzado";

export type StrategyChart = {
  dataset: DatasetId;
  from?: number;
  to?: number;
  overlays?: { type: "sma" | "ema"; period: number; color?: string }[];
  showRsi?: boolean;
  showBollinger?: boolean;
  showMacd?: boolean;
  showVolume?: boolean;
  priceLines?: number[];
  markers?: {
    index: number;
    text: string;
    color?: string;
    position?: "aboveBar" | "belowBar" | "inBar";
    shape?: "arrowUp" | "arrowDown" | "circle" | "square";
  }[];
  pattern?: "hch" | "triangle" | "flag";
  caption: string;
};

export type Strategy = {
  slug: string;
  name: string;
  family: StrategyFamily;
  familyLabel: string;
  horizon: string;
  difficulty: StrategyDifficulty;
  tagline: string;
  summary: string;
  context: string[];
  avoid: string[];
  entry: string[];
  stop: string;
  exit: string[];
  size: string;
  risk: {
    winRate: string;
    rr: string;
    drawdown: string;
    costs: string;
  };
  mistakes: string[];
  chart: StrategyChart;
  related: string[];
  backtest?: {
    strategy: StrategyId;
    dataset: DatasetId;
    label: string;
  };
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    wrong: string[];
  };
  accent: string;
};

export const STRATEGY_FAMILIES: { id: StrategyFamily | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "tendencia", label: "Tendencia" },
  { id: "ruptura", label: "Ruptura" },
  { id: "reversion", label: "Reversión" },
  { id: "rango", label: "Rango" },
  { id: "pasiva", label: "Pasiva" },
  { id: "cripto", label: "Cripto" },
];

export const STRATEGY_DIFFICULTIES: {
  id: StrategyDifficulty | "todas";
  label: string;
}[] = [
  { id: "todas", label: "Todas" },
  { id: "principiante", label: "Principiante" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
];

export const STRATEGIES: Strategy[] = [
  {
    slug: "cruce-de-medias",
    name: "Cruce de medias",
    family: "tendencia",
    familyLabel: "Tendencia",
    horizon: "Swing / posición",
    difficulty: "principiante",
    tagline: "Dos medias que se cruzan para detectar el cambio de impulso.",
    summary:
      "Cuando la media rápida cruza por encima de la lenta, el impulso reciente mejora. Es simple, pero llega tarde y sufre en rangos.",
    context: [
      "Mercados con tendencias sostenidas.",
      "Activos líquidos y temporalidades altas (diario o 4 horas).",
      "Cuando toleras entrar y salir con retraso.",
    ],
    avoid: [
      "Rangos laterales: los cruces se multiplican y las comisiones también.",
      "Temporalidades de minutos sin experiencia.",
      "Optimizar periodos hasta que el pasado quede perfecto.",
    ],
    entry: [
      "La media de 20 cruza por encima de la de 50.",
      "El precio cierra por encima de ambas.",
      "Volumen por encima de la media, si está disponible.",
    ],
    stop: "Por debajo del último mínimo relevante o a 1,5–2 ATR.",
    exit: [
      "Cruce inverso de las medias.",
      "Stop o trailing stop.",
      "Objetivo mínimo de 2R.",
    ],
    size: "1 % del capital por operación. El tamaño se calcula desde el stop.",
    risk: {
      winRate: "35–45 %",
      rr: "1:2 – 1:3",
      drawdown: "15–25 %",
      costs: "Moderados: pocas operaciones en diario.",
    },
    mistakes: [
      "Cambiar los periodos para que el último año se vea mejor.",
      "Operar todos los cruces dentro de un rango.",
      "Entrar sin stop porque 'la media protege'.",
      "Ignorar los costes.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 500,
      to: 700,
      overlays: [
        { type: "sma", period: 20, color: "#f0b429" },
        { type: "sma", period: 50, color: "#5aa9ff" },
      ],
      showVolume: true,
      caption:
        "BTC diario con SMA 20 (ámbar) y SMA 50 (azul). El cruce describe el cambio de impulso, no el techo ni el suelo.",
    },
    related: ["medias-moviles", "tendencia", "backtesting"],
    backtest: { strategy: "sma", dataset: "btc-1d", label: "Cruce SMA 20/50" },
    quiz: {
      question: "¿En qué contexto falla más un cruce de medias?",
      options: [
        "En una tendencia fuerte",
        "En un rango lateral",
        "En un activo con alta liquidez",
        "En temporalidad diaria",
      ],
      correct: 1,
      explanation:
        "En un rango, las medias se cruzan una y otra vez y cada cruce genera una operación con costes. El contexto es lo que decide.",
      wrong: [
        "En una tendencia fuerte puede funcionar, aunque llegue tarde.",
        "",
        "La liquidez ayuda a ejecutar, no a que la señal funcione.",
        "El diario es una temporalidad válida; el problema es el contexto.",
      ],
    },
    accent: "#f0b429",
  },
  {
    slug: "pullback-media",
    name: "Pullback a media",
    family: "tendencia",
    familyLabel: "Tendencia",
    horizon: "Swing",
    difficulty: "intermedio",
    tagline: "Comprar el retroceso, no la ruptura.",
    summary:
      "En una tendencia, el precio suele volver a la media antes de continuar. El pullback busca una entrada mejor y un riesgo más cercano.",
    context: [
      "Tendencia alcista clara, con el precio por encima de la SMA 50.",
      "Retroceso a la SMA 20 con volumen decreciente.",
      "Confirmación: cierre de vuelta por encima de la media.",
    ],
    avoid: [
      "Tendencias agotadas o sin estructura.",
      "Caídas verticales: el pullback puede ser el inicio de un cambio de tendencia.",
      "Medias demasiado cortas que se pegan al precio.",
    ],
    entry: [
      "Precio por encima de la SMA 50.",
      "Retroceso a la SMA 20.",
      "Cierre de vuelta por encima de la SMA 20 o vela de rechazo.",
    ],
    stop: "Por debajo del mínimo del pullback o de la SMA 50.",
    exit: [
      "Objetivo de 2R.",
      "Trailing si la tendencia continúa.",
      "Salida si el precio pierde la SMA 50.",
    ],
    size: "1 % del capital. Un stop más cercano permite más tamaño, no más riesgo.",
    risk: {
      winRate: "40–50 %",
      rr: "1:2",
      drawdown: "10–20 %",
      costs: "Moderados.",
    },
    mistakes: [
      "Comprar cualquier toque de media.",
      "No esperar confirmación.",
      "Colocar el stop demasiado ajustado.",
      "Promediar a la baja cuando el pullback falla.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 560,
      to: 700,
      overlays: [
        { type: "sma", period: 20, color: "#f0b429" },
        { type: "sma", period: 50, color: "#5aa9ff" },
      ],
      showVolume: true,
      caption:
        "BTC diario. La tendencia se apoya en la SMA 50 mientras los retrocesos llegan a la SMA 20.",
    },
    related: ["medias-moviles", "tendencia", "soporte-resistencia"],
    backtest: { strategy: "pullback", dataset: "btc-1d", label: "Pullback SMA 20" },
    quiz: {
      question: "¿Qué hace válido un pullback?",
      options: [
        "Que el precio toque la media",
        "Que la tendencia siga intacta y haya confirmación",
        "Que el RSI esté alto",
        "Que el volumen desaparezca",
      ],
      correct: 1,
      explanation:
        "El toque de la media no es una señal por sí solo. La tendencia debe seguir y el precio debe mostrar confirmación de vuelta.",
      wrong: [
        "Tocar la media no garantiza que el retroceso termine.",
        "",
        "Un RSI alto no confirma un pullback; puede indicar fuerza o agotamiento.",
        "El volumen bajo puede acompañar el retroceso, pero no confirma la entrada.",
      ],
    },
    accent: "#34d399",
  },
  {
    slug: "ruptura-donchian",
    name: "Ruptura Donchian",
    family: "ruptura",
    familyLabel: "Ruptura",
    horizon: "Swing",
    difficulty: "intermedio",
    tagline: "El precio sale del rango y tú sigues la ruptura.",
    summary:
      "Donchian compra cuando el precio supera el máximo de N periodos y vende cuando pierde el mínimo de M. Es la base de muchos sistemas de tendencia.",
    context: [
      "Rangos o compresiones que preceden a un movimiento.",
      "Volumen por encima de la media en la ruptura.",
      "Tendencias que empiezan o se reanudan.",
    ],
    avoid: [
      "Rangos muy estrechos con falsas rupturas.",
      "Mercados sin liquidez.",
      "Perseguir una vela ya extendida.",
    ],
    entry: [
      "Cierre por encima del máximo de 20 periodos.",
      "Volumen superior a la media.",
      "Confirmación con cierre, no solo con la mecha.",
    ],
    stop: "Mínimo de 10 periodos o 2 ATR.",
    exit: [
      "Mínimo de 10 periodos.",
      "Trailing stop.",
      "Objetivo de 2–3R.",
    ],
    size: "1 % del capital.",
    risk: {
      winRate: "30–40 %",
      rr: "1:2 – 1:3",
      drawdown: "15–25 %",
      costs: "Medios: más operaciones que un cruce lento.",
    },
    mistakes: [
      "Comprar la mecha en lugar del cierre.",
      "No filtrar por volumen.",
      "No aceptar que habrá fakeouts.",
      "Mover el stop cuando la ruptura falla.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 560,
      to: 700,
      priceLines: [61825, 87396],
      showVolume: true,
      caption:
        "BTC diario con dos zonas de referencia. La ruptura se confirma con cierre y volumen, no con una mecha.",
    },
    related: ["patrones", "soporte-resistencia", "tendencia"],
    backtest: {
      strategy: "donchian",
      dataset: "btc-1d",
      label: "Donchian 20/10",
    },
    quiz: {
      question: "¿Qué distingue una ruptura de un fakeout?",
      options: [
        "Una vela verde",
        "Cierre fuera del nivel con volumen",
        "Un RSI alto",
        "Una noticia en redes",
      ],
      correct: 1,
      explanation:
        "La ruptura se confirma con cierre fuera del nivel y participación. Sin volumen, puede ser una trampa.",
      wrong: [
        "Una vela aislada no confirma nada.",
        "",
        "El RSI puede estar alto en una tendencia sana o en un agotamiento.",
        "Las noticias no sustituyen la estructura ni el volumen.",
      ],
    },
    accent: "#5aa9ff",
  },
  {
    slug: "ruptura-patron-volumen",
    name: "Ruptura de patrón con volumen",
    family: "ruptura",
    familyLabel: "Ruptura",
    horizon: "Swing",
    difficulty: "intermedio",
    tagline: "Patrones que se resuelven con participación.",
    summary:
      "H-C-H, triángulos y banderas describen compresión o agotamiento. La ruptura con volumen es la señal; el patrón solo es el mapa.",
    context: [
      "Patrón claro con al menos dos toques.",
      "Volumen creciente en la ruptura.",
      "Tendencia previa definida.",
    ],
    avoid: [
      "Patrones forzados con la imaginación.",
      "Rupturas sin volumen.",
      "Patrones en temporalidades muy bajas.",
    ],
    entry: [
      "Cierre fuera del patrón.",
      "Volumen superior a la media de 20.",
      "Retest opcional del nivel roto.",
    ],
    stop: "Dentro del patrón, al otro lado del nivel roto.",
    exit: [
      "Objetivo medido: la altura del patrón.",
      "Trailing stop.",
      "Mínimo de 2R.",
    ],
    size: "1 % del capital.",
    risk: {
      winRate: "35–45 %",
      rr: "1:2",
      drawdown: "15–25 %",
      costs: "Medios.",
    },
    mistakes: [
      "Anticipar la ruptura antes del cierre.",
      "Ignorar el volumen.",
      "No definir el objetivo medido.",
      "Convertir un patrón fallido en una tesis de largo plazo.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 600,
      to: 700,
      pattern: "hch",
      overlays: [{ type: "sma", period: 50, color: "#5aa9ff" }],
      showVolume: true,
      caption:
        "Esquema de H-C-H y contexto real. La línea del cuello y el volumen son la referencia, no el dibujo.",
    },
    related: ["patrones", "tendencia", "soporte-resistencia"],
    backtest: {
      strategy: "donchian",
      dataset: "btc-1d",
      label: "Ruptura Donchian (aproximación)",
    },
    quiz: {
      question: "¿Qué confirma la ruptura de un patrón?",
      options: [
        "El patrón en sí",
        "Cierre fuera del nivel y volumen",
        "Una mecha que lo atraviesa",
        "Un RSI bajo",
      ],
      correct: 1,
      explanation:
        "El patrón describe una tensión; la confirmación es el cierre fuera del nivel con participación.",
      wrong: [
        "El patrón sin confirmación es solo un dibujo.",
        "",
        "Una mecha puede ser un rechazo, no una ruptura.",
        "El RSI no confirma la ruptura de un patrón.",
      ],
    },
    accent: "#a78bfa",
  },
  {
    slug: "reversion-rsi-bollinger",
    name: "Reversión con RSI/Bollinger",
    family: "reversion",
    familyLabel: "Reversión",
    horizon: "Swing",
    difficulty: "intermedio",
    tagline: "Comprar el exceso, no la tendencia.",
    summary:
      "En un rango, los extremos de RSI o de las bandas pueden ofrecer rebotes. En tendencia, suelen ser señales de continuación.",
    context: [
      "Rango lateral con extremos claros.",
      "RSI por debajo de 30 o precio en la banda inferior.",
      "Confirmación de giro antes de entrar.",
    ],
    avoid: [
      "Tendencias fuertes: la sobreventa puede durar semanas.",
      "Activos sin liquidez.",
      "Promediar a la baja cuando el precio sigue cayendo.",
    ],
    entry: [
      "El RSI cruza 30 hacia arriba o el precio vuelve dentro de la banda.",
      "Vela de confirmación.",
      "Contexto de rango, no de tendencia.",
    ],
    stop: "Por debajo del mínimo del rango o del último swing.",
    exit: [
      "Media de las bandas o RSI 50–70.",
      "Objetivo de 1–1,5R.",
      "Cerrar si el rango se rompe.",
    ],
    size: "0,5–1 % del capital.",
    risk: {
      winRate: "50–60 %",
      rr: "1:1 – 1:1,5",
      drawdown: "10–20 %",
      costs: "Altos: muchas operaciones y comisiones.",
    },
    mistakes: [
      "Usarla en una tendencia fuerte.",
      "Comprar sin confirmación.",
      "No aceptar que el rebote puede fallar.",
      "Aumentar el tamaño para compensar los fallos.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 580,
      to: 700,
      showRsi: true,
      showBollinger: true,
      caption:
        "BTC diario con RSI y Bandas de Bollinger. En tendencia, la sobreventa puede ser una pausa, no un giro.",
    },
    related: ["rsi", "macd-bollinger", "soporte-resistencia"],
    backtest: { strategy: "rsi", dataset: "btc-1d", label: "RSI 30/70" },
    quiz: {
      question: "¿Cuándo tiene más sentido una reversión a la media?",
      options: [
        "En una tendencia fuerte",
        "En un rango lateral",
        "En un gap de resultados",
        "En un activo ilíquido",
      ],
      correct: 1,
      explanation:
        "La reversión busca que el precio vuelva a la media. En un rango, ese retorno es parte del comportamiento normal.",
      wrong: [
        "En tendencia fuerte, la sobreventa puede durar mucho.",
        "",
        "Un gap puede cambiar la estructura y no volver a la media.",
        "La falta de liquidez aumenta el riesgo de ejecución.",
      ],
    },
    accent: "#22d3ee",
  },
  {
    slug: "rango-soporte-resistencia",
    name: "Rango con soporte y resistencia",
    family: "rango",
    familyLabel: "Rango",
    horizon: "Swing / intradía",
    difficulty: "principiante",
    tagline: "Compra cerca del suelo del rango, vende cerca del techo.",
    summary:
      "En un rango claro, el precio rebota entre dos zonas. La estrategia busca comprar cerca del soporte y vender cerca de la resistencia, con stop fuera del rango.",
    context: [
      "Rango con al menos dos toques en cada extremo.",
      "Volumen estable.",
      "Temporalidad alta para que el rango sea significativo.",
    ],
    avoid: [
      "Rangos que se están comprimiendo para romper.",
      "Noticias macro que pueden romper el rango.",
      "Rangos demasiado estrechos para cubrir costes.",
    ],
    entry: [
      "Precio en la zona de soporte.",
      "Vela de rechazo o confirmación.",
      "Objetivo en la resistencia.",
    ],
    stop: "Fuera del rango, con margen suficiente.",
    exit: [
      "Resistencia o 1,5R.",
      "Cerrar si el rango se rompe con volumen.",
      "No mover el stop para 'darle espacio'.",
    ],
    size: "1 % del capital.",
    risk: {
      winRate: "45–55 %",
      rr: "1:1 – 1:1,5",
      drawdown: "10–15 %",
      costs: "Altos si operas muchas veces.",
    },
    mistakes: [
      "Comprar en el soporte sin confirmación.",
      "Mantener la posición cuando el rango se rompe.",
      "No ajustar el stop al ancho del rango.",
      "Operar rangos demasiado estrechos.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 560,
      to: 700,
      priceLines: [61825, 87396],
      showVolume: true,
      caption:
        "BTC diario con dos zonas de referencia. El rango es una hipótesis que se invalida cuando el precio lo rompe.",
    },
    related: ["soporte-resistencia", "tendencia", "patrones"],
    backtest: { strategy: "range", dataset: "btc-1d", label: "Rango 20" },
    quiz: {
      question: "¿Qué haces si el precio rompe el rango con volumen?",
      options: [
        "Comprar más cerca del soporte",
        "Cerrar y replantear la hipótesis",
        "Ignorarlo y esperar",
        "Mover el stop al otro lado",
      ],
      correct: 1,
      explanation:
        "Una ruptura con volumen invalida la idea de rango. Lo correcto es cerrar y volver a analizar, no insistir.",
      wrong: [
        "Comprar más en una ruptura es aumentar el riesgo contra la nueva estructura.",
        "",
        "Ignorar la ruptura puede convertir una pérdida controlada en una pérdida abierta.",
        "Mover el stop no cambia la estructura del mercado.",
      ],
    },
    accent: "#fb923c",
  },
  {
    slug: "dca",
    name: "DCA / aportación periódica",
    family: "pasiva",
    familyLabel: "Pasiva",
    horizon: "Meses / años",
    difficulty: "principiante",
    tagline: "Reparte el tiempo de entrada y deja de adivinar.",
    summary:
      "El DCA invierte una cantidad fija cada periodo. Reduce el impacto de entrar en un mal día, pero no elimina el riesgo del activo.",
    context: [
      "Horizonte de largo plazo.",
      "Activos diversificados, como índices o una cesta de cripto.",
      "Cuando no quieres dedicar tiempo al timing.",
    ],
    avoid: [
      "Activos individuales sin tesis.",
      "Dinero que necesitas a corto plazo.",
      "Usar apalancamiento.",
    ],
    entry: [
      "Aporte fijo cada mes o semana, sin mirar el precio.",
      "Automatiza la compra si puedes.",
      "Mantén el plan en las caídas.",
    ],
    stop: "No hay stop técnico. El control está en el tamaño y la diversificación.",
    exit: [
      "Cuando cambie tu objetivo o necesites el dinero.",
      "Rebalanceo periódico.",
      "No vender por pánico.",
    ],
    size: "Una cantidad que puedas mantener en el tiempo sin comprometer tu colchón.",
    risk: {
      winRate: "Depende del activo",
      rr: "No aplica",
      drawdown: "30–50 % en activos volátiles",
      costs: "Bajos.",
    },
    mistakes: [
      "Parar de aportar en las caídas.",
      "Concentrar todo en una sola cripto.",
      "Confundir DCA con una garantía.",
      "Usar dinero que necesitas pronto.",
    ],
    chart: {
      dataset: "spy-1d",
      from: 0,
      to: 501,
      overlays: [{ type: "sma", period: 50, color: "#5aa9ff" }],
      caption:
        "SPY: incluso un índice diversificado tiene caídas. El DCA reparte el momento de entrada, no elimina el riesgo.",
    },
    related: ["dca-vs-trading", "expectativas-realistas", "costes"],
    backtest: { strategy: "dca", dataset: "spy-1d", label: "DCA 500 $/mes" },
    quiz: {
      question: "¿Qué hace el DCA?",
      options: [
        "Comprar todo de una vez en el mejor momento",
        "Comprar una cantidad fija de forma periódica",
        "Vender en los máximos",
        "Usar apalancamiento para promediar",
      ],
      correct: 1,
      explanation:
        "El DCA reparte las compras en el tiempo con una cantidad fija. Reduce el riesgo de timing, no el riesgo del activo.",
      wrong: [
        "El DCA renuncia a adivinar el mejor momento.",
        "",
        "El DCA no vende en máximos: compra con una regla temporal.",
        "El apalancamiento contradice la lógica del DCA.",
      ],
    },
    accent: "#2fd47c",
  },
  {
    slug: "carry-funding",
    name: "Carry y funding en perpetuos",
    family: "cripto",
    familyLabel: "Cripto",
    horizon: "Días / semanas",
    difficulty: "avanzado",
    tagline: "Cobrar funding, no predecir el precio.",
    summary:
      "En perpetuos, el funding paga a un lado del mercado. Una posición delta-neutral puede cobrarlo, pero asume riesgo de exchange, liquidación y cambios de funding.",
    context: [
      "Funding positivo persistente.",
      "Capacidad de cubrir spot y perpetuo.",
      "Exchange solvente y con liquidez.",
    ],
    avoid: [
      "Sin cobertura completa.",
      "Con apalancamiento alto.",
      "En exchanges sin reputación.",
      "Si no entiendes la liquidación.",
    ],
    entry: [
      "Comprar spot y vender el mismo valor en perpetuo.",
      "O al revés si el funding es negativo.",
      "Revisar el funding cada periodo.",
    ],
    stop: "No es un stop de precio: es control de delta, margen y contraparte.",
    exit: [
      "Cuando el funding deja de compensar.",
      "Si el basis se estrecha.",
      "Si cambia el riesgo del exchange.",
    ],
    size: "Una fracción pequeña. Nunca todo el capital en un solo exchange.",
    risk: {
      winRate: "Depende del funding",
      rr: "No aplica",
      drawdown: "Riesgo operativo alto",
      costs: "Comisiones y funding variable.",
    },
    mistakes: [
      "Llamarlo 'libre de riesgo'.",
      "No cubrir todo el delta.",
      "Ignorar el riesgo de exchange.",
      "Usar demasiado apalancamiento.",
    ],
    chart: {
      dataset: "btc-1d",
      from: 580,
      to: 700,
      showVolume: true,
      caption:
        "El funding no se ve en el gráfico de precio: se paga cada periodo. El riesgo principal no es la dirección, es la contraparte.",
    },
    related: ["perpetuos-funding", "apalancamiento", "stablecoins"],
    quiz: {
      question: "¿Qué riesgo sigue existiendo en un carry delta-neutral?",
      options: [
        "Ninguno: está cubierto",
        "Solo el precio",
        "Exchange, liquidación y funding",
        "El volumen",
      ],
      correct: 2,
      explanation:
        "El delta-neutral reduce el riesgo de dirección, pero no elimina el riesgo de exchange, de liquidación del hedge ni de que el funding cambie.",
      wrong: [
        "Ninguna cobertura elimina todos los riesgos.",
        "El precio está cubierto si el hedge es completo.",
        "",
        "El volumen no es el riesgo principal.",
      ],
    },
    accent: "#f59e0b",
  },
];

export function getStrategy(slug: string) {
  return STRATEGIES.find((strategy) => strategy.slug === slug);
}
