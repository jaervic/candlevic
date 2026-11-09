export type Book = {
  slug: string;
  title: string;
  author: string;
  year: number;
  idea: string;
  keys: string[];
  critique: string;
  modules: string[];
  level: "principiante" | "intermedio" | "avanzado";
  accent: string;
};

export const BOOKS: Book[] = [
  {
    slug: "murphy-analisis-tecnico",
    title: "Technical Analysis of the Financial Markets",
    author: "John J. Murphy",
    year: 1999,
    idea: "El manual de referencia del análisis técnico: si quieres una base ordenada, empieza por aquí.",
    keys: [
      "La Teoría de Dow: el precio descuenta todo y las tendencias persisten hasta que se demuestra lo contrario.",
      "Una tendencia se define por máximos y mínimos crecientes (o decrecientes), no por una línea dibujada.",
      "Soporte y resistencia son zonas, no niveles exactos.",
      "El volumen confirma el precio; sin volumen, una ruptura es sospechosa.",
      "Los indicadores son derivados del precio: nunca deben sustituir la lectura de la estructura.",
    ],
    critique:
      "Publicado antes de la era cripto y con ejemplos de mercados muy distintos. Algunos patrones están descritos de forma más rígida de lo que funciona en la práctica.",
    modules: ["m4", "m5"],
    level: "principiante",
    accent: "#5aa9ff",
  },
  {
    slug: "nison-velas",
    title: "Japanese Candlestick Charting Techniques",
    author: "Steve Nison",
    year: 1991,
    idea: "El libro que popularizó las velas japonesas en Occidente y sigue siendo la mejor introducción a sus patrones.",
    keys: [
      "Cada vela cuenta una batalla entre compradores y vendedores en un periodo concreto.",
      "El contexto manda: un martillo en soporte no es lo mismo que en mitad de la nada.",
      "Los patrones de varias velas (envolvente, estrella) pesan más que una vela aislada.",
      "Las mechas muestran rechazo de precios; el cuerpo, dominio de un lado.",
      "Ningún patrón tiene probabilidad suficiente para operar sin gestión de riesgo.",
    ],
    critique:
      "El catálogo de patrones es enorme y algunos tienen poca evidencia estadística. Úsalo como vocabulario visual, no como sistema de señales.",
    modules: ["m3"],
    level: "principiante",
    accent: "#2fd47c",
  },
  {
    slug: "elder-trading-for-a-living",
    title: "Trading for a Living",
    author: "Alexander Elder",
    year: 1993,
    idea: "Une psicología, análisis técnico y gestión de dinero en un solo sistema: el triple screen.",
    keys: [
      "El triple screen combina una temporalidad mayor para la tendencia y una menor para el timing.",
      "La psicología del trader explica más pérdidas que el análisis.",
      "El objetivo no es acertar, sino gestionar el riesgo de forma repetible.",
      "Lleva un diario: sin registro no hay aprendizaje.",
      "El apalancamiento excesivo es la vía rápida a la ruina.",
    ],
    critique:
      "Algunas ideas sobre psicología son anecdóticas y el estilo es muy opinado. La parte de gestión de riesgo sigue siendo excelente.",
    modules: ["m5", "m6"],
    level: "intermedio",
    accent: "#fb923c",
  },
  {
    slug: "douglas-trading-in-the-zone",
    title: "Trading in the Zone",
    author: "Mark Douglas",
    year: 2000,
    idea: "El trading es un juego de probabilidades: tu trabajo es ejecutar el proceso, no adivinar cada resultado.",
    keys: [
      "Cada operación es un evento independiente; el resultado individual no valida tu sistema.",
      "Piensa en probabilidades, no en certezas.",
      "Aceptar el riesgo antes de entrar elimina la mayor parte del estrés.",
      "Las reglas existen para protegerte de ti mismo.",
      "El mercado no te debe nada: no hay injusticia en una pérdida.",
    ],
    critique:
      "Es más filosofía que técnica. Sin un sistema con esperanza positiva, la mentalidad correcta no genera beneficios.",
    modules: ["m0", "m7"],
    level: "principiante",
    accent: "#a78bfa",
  },
  {
    slug: "tharp-position-sizing",
    title: "Trade Your Way to Financial Freedom",
    author: "Van Tharp",
    year: 2006,
    idea: "El tamaño de la posición importa más que la señal de entrada. Aquí está la matemática del riesgo.",
    keys: [
      "Define el riesgo por operación en porcentaje del capital, no en dinero absoluto.",
      "Calcula el tamaño desde el stop: riesgo / distancia al stop.",
      "Piensa en múltiplos R: +2R, -1R, +0,5R.",
      "La esperanza matemática decide si un sistema gana a largo plazo.",
      "Reducir el tamaño cuando hay drawdown evita la ruina.",
    ],
    critique:
      "La segunda mitad del libro se dispersa en temas de psicología y sistemas. La parte de position sizing es la joya.",
    modules: ["m6"],
    level: "intermedio",
    accent: "#f0b429",
  },
  {
    slug: "oneil-canslim",
    title: "How to Make Money in Stocks",
    author: "William J. O'Neil",
    year: 1988,
    idea: "El método CANSLIM: combinar fundamentales, rupturas con volumen y disciplina de stops.",
    keys: [
      "Las grandes ganadoras suelen romper máximos históricos con volumen muy superior a la media.",
      "Los fundamentales (beneficios, ventas) filtran las rupturas que merecen atención.",
      "El stop de pérdida es parte del sistema, no un castigo.",
      "Evita comprar extended: entrar tarde empeora el R:B.",
      "La mayoría de los intentos de ruptura fallan; el filtro es la clave.",
    ],
    critique:
      "Muy centrado en acciones de crecimiento de EE. UU. y en un contexto de mercado concreto. El sesgo de supervivencia de sus ejemplos es alto.",
    modules: ["m5", "m7"],
    level: "intermedio",
    accent: "#34d399",
  },
  {
    slug: "reminiscences",
    title: "Reminiscences of a Stock Operator",
    author: "Edwin Lefèvre",
    year: 1923,
    idea: "Novela basada en Jesse Livermore: las lecciones sobre paciencia, tips y ego siguen vigentes un siglo después.",
    keys: [
      "No hay nada nuevo en el mercado: la psicología se repite.",
      "Los tips y las opiniones ajenas son una vía rápida a perder dinero.",
      "Estar en lo correcto y no actuar a tiempo equivale a estar equivocado.",
      "Las grandes ganancias se construyen esperando, no operando más.",
      "El mercado puede permanecer irracional más tiempo del que tu cuenta aguanta.",
    ],
    critique:
      "Es literatura, no un manual. Livermore terminó arruinándose varias veces: úsalo para entender la psicología, no como estrategia.",
    modules: ["m0", "m7"],
    level: "principiante",
    accent: "#f472b6",
  },
  {
    slug: "wyckoff",
    title: "The Wyckoff Methodology in Depth",
    author: "Rubén Villahermosa",
    year: 2019,
    idea: "Leer el mercado como una batalla entre acumulación institucional y distribución.",
    keys: [
      "Las fases de acumulación y distribución preceden a los grandes movimientos.",
      "El volumen y el spread de las velas revelan quién está absorbiendo la oferta.",
      "Un spring es una falsa ruptura bajista que agota la venta.",
      "El contexto estructural pesa más que el patrón aislado.",
      "Sin gestión de riesgo, incluso una lectura correcta puede arruinarte.",
    ],
    critique:
      "La interpretación es subjetiva y difícil de automatizar. Requiere mucha práctica para no ver patrones donde no los hay.",
    modules: ["m4", "m5"],
    level: "avanzado",
    accent: "#22d3ee",
  },
  {
    slug: "graham-intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    year: 1949,
    idea: "El contrapeso perfecto al análisis técnico: valor, margen de seguridad y una mirada de largo plazo.",
    keys: [
      "El margen de seguridad protege de los errores de valoración.",
      "El inversor y el especulador son dos actividades distintas; no las mezcles.",
      "El señor Mercado ofrece precios, no verdades: no tienes que aceptarlos.",
      "La diversificación reduce el riesgo específico.",
      "El largo plazo perdona más errores que el corto plazo.",
    ],
    critique:
      "Pensado para acciones industriales del siglo XX y con poco espacio para cripto. Su marco mental sigue siendo valioso aunque el análisis técnico no sea su foco.",
    modules: ["m0", "m2"],
    level: "intermedio",
    accent: "#94a3b8",
  },
  {
    slug: "brooks-price-action",
    title: "Reading Price Charts Bar by Bar",
    author: "Al Brooks",
    year: 2009,
    idea: "Price action puro: leer la intención de compradores y vendedores vela a vela, sin indicadores.",
    keys: [
      "Cada vela es una oportunidad de medir la fuerza de compradores y vendedores.",
      "Las tendencias suelen tener dos piernas; los rangos, muchas.",
      "Las barras de señal y las barras de entrada son cosas distintas.",
      "El contexto (tendencia, rango, volatilidad) define si una señal es válida.",
      "La gestión de la posición es tan importante como la entrada.",
    ],
    critique:
      "Extremadamente denso y subjetivo. Es un libro de práctica intensiva, no de lectura rápida; puede generar análisis-parálisis.",
    modules: ["m4", "m5"],
    level: "avanzado",
    accent: "#818cf8",
  },
];

export function getBook(slug: string) {
  return BOOKS.find((b) => b.slug === slug);
}
