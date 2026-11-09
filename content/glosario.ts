export type GlossaryCategory =
  | "fundamentos"
  | "tecnico"
  | "riesgo"
  | "cripto";

export type GlossaryTerm = {
  term: string;
  definition: string;
  category: GlossaryCategory;
  aliases?: string[];
};

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Acción", category: "fundamentos", definition: "Una parte de la propiedad de una empresa. Si la empresa crece y gana dinero, tu participación puede valer más; si pierde, puede valer menos." },
  { term: "ETF", category: "fundamentos", definition: "Fondo cotizado que agrupa muchos activos y se compra como una acción. Un ETF del S&P 500 te da exposición a 500 empresas con una sola orden." },
  { term: "Spread", category: "fundamentos", definition: "Diferencia entre el precio al que puedes comprar (ask) y el precio al que puedes vender (bid). Es un coste invisible que pagas en cada operación." },
  { term: "Liquidez", category: "fundamentos", definition: "Facilidad para comprar o vender sin mover el precio. Un mercado líquido tiene mucho volumen y spreads estrechos." },
  { term: "Volumen", category: "fundamentos", definition: "Cantidad de activos negociados en un periodo. Confirma si un movimiento tiene participación real detrás." },
  { term: "Orden a mercado", category: "fundamentos", definition: "Compra o vende ya, al mejor precio disponible. Rápida, pero no controlas el precio exacto." },
  { term: "Orden limitada", category: "fundamentos", definition: "Solo se ejecuta a tu precio o mejor. Controlas el precio, pero puede no ejecutarse nunca." },
  { term: "Stop loss", category: "fundamentos", definition: "Orden que cierra tu posición si el precio llega a un nivel que elegiste. Limita la pérdida máxima." },
  { term: "Comisión", category: "fundamentos", definition: "Lo que cobra el bróker o exchange por operar. En estrategias activas puede comerse buena parte del beneficio." },
  { term: "Bid / Ask", category: "fundamentos", definition: "Bid es el mejor precio de compra disponible; ask, el mejor de venta. La diferencia entre ambos es el spread." },
  { term: "Slippage", category: "fundamentos", definition: "Diferencia entre el precio esperado y el precio real de ejecución. Aparece en mercados rápidos o poco líquidos." },
  { term: "Bróker", category: "fundamentos", definition: "Intermediario que te permite operar en el mercado. Debe estar regulado en una jurisdicción seria." },
  { term: "Exchange", category: "fundamentos", definition: "Plataforma donde se compran y venden criptomonedas. Centralizado (CEX) o descentralizado (DEX)." },
  { term: "Tendencia", category: "tecnico", definition: "Dirección dominante del precio. Alcista si los máximos y mínimos suben; bajista si bajan; lateral si no hay dirección clara." },
  { term: "Soporte", category: "tecnico", definition: "Zona donde la demanda ha frenado las caídas varias veces. No es una línea mágica, sino un área." },
  { term: "Resistencia", category: "tecnico", definition: "Zona donde la oferta ha frenado las subidas varias veces. Al romperse, puede convertirse en soporte." },
  { term: "Vela japonesa", category: "tecnico", definition: "Representación de cuatro precios en un periodo: apertura, máximo, mínimo y cierre. El cuerpo va de apertura a cierre; las mechas, a los extremos." },
  { term: "Doji", category: "tecnico", definition: "Vela con apertura y cierre casi iguales. Indica indecisión, no una dirección." },
  { term: "Marubozu", category: "tecnico", definition: "Vela con cuerpo grande y mechas mínimas. Muestra que un lado dominó todo el periodo." },
  { term: "Martillo", category: "tecnico", definition: "Vela con cuerpo pequeño arriba y mecha inferior larga. Sugiere rechazo de precios bajos, pero necesita contexto." },
  { term: "Gap", category: "tecnico", definition: "Hueco entre el cierre de una vela y la apertura de la siguiente. Frecuente en acciones tras resultados o noticias." },
  { term: "Temporalidad", category: "tecnico", definition: "Duración de cada vela (1 min, 1 h, 1 día…). Cambia el ruido y el horizonte de la señal." },
  { term: "Máximo y mínimo", category: "tecnico", definition: "Puntos de referencia de la estructura. Un máximo más alto y un mínimo más alto definen una tendencia alcista." },
  { term: "Ruptura", category: "tecnico", definition: "Cuando el precio supera un nivel clave con convicción. Sin volumen, muchas rupturas son trampas (fakeouts)." },
  { term: "Fakeout", category: "tecnico", definition: "Ruptura falsa: el precio supera un nivel y vuelve rápidamente. Atrapa a los que compran tarde." },
  { term: "Pullback", category: "tecnico", definition: "Retroceso temporal dentro de una tendencia. Puede ser una oportunidad o el inicio de un cambio de tendencia." },
  { term: "H-C-H", category: "tecnico", definition: "Hombro-cabeza-hombro: patrón de tres picos con el central más alto. Sugiere posible agotamiento de una tendencia alcista." },
  { term: "Triángulo", category: "tecnico", definition: "Patrón de compresión en el que los extremos convergen. Indica acumulación de tensión, no dirección garantizada." },
  { term: "Media móvil", category: "tecnico", definition: "Promedio del precio de las últimas N velas. Suaviza el ruido y ayuda a visualizar la tendencia." },
  { term: "EMA", category: "tecnico", definition: "Media móvil exponencial: da más peso a los datos recientes que la media simple. Reacciona antes y también genera más señales falsas." },
  { term: "RSI", category: "tecnico", definition: "Oscilador de 0 a 100 que mide la fuerza relativa de las subidas frente a las bajadas. Sobrecompra no significa 'vender ya'." },
  { term: "MACD", category: "tecnico", definition: "Diferencia entre dos medias exponenciales y su media de señal. Mide impulso; no predice giros por sí solo." },
  { term: "Bandas de Bollinger", category: "tecnico", definition: "Media móvil con dos bandas a ±2 desviaciones estándar. Miden volatilidad y compresión, no direcciones." },
  { term: "ATR", category: "tecnico", definition: "Average True Range: mide la volatilidad media en unidades de precio. Útil para dimensionar stops de forma realista." },
  { term: "Divergencia", category: "tecnico", definition: "El precio hace un máximo nuevo pero el indicador no. Señal de debilidad, nunca certeza." },
  { term: "Volumen relativo", category: "tecnico", definition: "Volumen actual comparado con el promedio reciente. Ayuda a distinguir movimientos con participación de los que no." },
  { term: "Escala logarítmica", category: "tecnico", definition: "Escala donde distancias iguales representan porcentajes iguales. Útil para activos que se multiplican por 10 o se dividen por 10." },
  { term: "Apalancamiento", category: "riesgo", definition: "Operar con más dinero del que tienes. Multiplica ganancias y pérdidas; puede liquidar tu cuenta." },
  { term: "Liquidación", category: "riesgo", definition: "Cierre forzoso de una posición apalancada cuando las pérdidas agotan el margen. Puedes perder todo el capital depositado." },
  { term: "Margen", category: "riesgo", definition: "Dinero que el bróker te exige mantener como garantía para una posición apalancada." },
  { term: "Tamaño de posición", category: "riesgo", definition: "Cuánto capital arriesgas en una operación. Se calcula a partir del stop y del porcentaje de riesgo, no al revés." },
  { term: "Riesgo/beneficio (R:B)", category: "riesgo", definition: "Relación entre lo que arriesgas y lo que esperas ganar. Un R:B de 1:2 significa arriesgar 1 para buscar 2." },
  { term: "R múltiplo", category: "riesgo", definition: "Resultado expresado en unidades de riesgo. +2R significa ganar el doble de lo arriesgado; -1R, perder el máximo previsto." },
  { term: "Drawdown", category: "riesgo", definition: "Caída desde el máximo de tu cuenta hasta el mínimo posterior. Mide el dolor real, no solo el retorno." },
  { term: "Esperanza matemática", category: "riesgo", definition: "Ganancia media por operación a largo plazo: (probabilidad × ganancia) − (probabilidad × pérdida)." },
  { term: "Diversificación", category: "riesgo", definition: "Repartir el riesgo entre activos que no se mueven igual. No elimina el riesgo de mercado." },
  { term: "Correlación", category: "riesgo", definition: "Grado en que dos activos se mueven juntos. En pánico, correlaciones que parecían bajas se acercan a 1." },
  { term: "Stop de volatilidad", category: "riesgo", definition: "Stop colocado a una distancia basada en el ATR, no en una cifra arbitraria." },
  { term: "Riesgo de ruina", category: "riesgo", definition: "Probabilidad de perder el capital suficiente para no poder seguir operando. Se dispara al aumentar el tamaño por operación." },
  { term: "Bitcoin", category: "cripto", definition: "La primera criptomoneda, con oferta limitada a 21 millones de unidades y emisión decreciente cada cuatro años (halving)." },
  { term: "Altcoin", category: "cripto", definition: "Cualquier criptomoneda distinta de Bitcoin. Suelen tener más volatilidad y menor liquidez." },
  { term: "Stablecoin", category: "cripto", definition: "Criptomoneda diseñada para mantener un precio estable, normalmente ligada al dólar. Su estabilidad depende de sus reservas." },
  { term: "Wallet", category: "cripto", definition: "Herramienta que guarda las claves con las que controlas tus cripto. 'Not your keys, not your coins'." },
  { term: "Clave privada", category: "cripto", definition: "El secreto que demuestra que eres el dueño de una wallet. Quien la tiene, controla los fondos." },
  { term: "Seed phrase", category: "cripto", definition: "12 o 24 palabras que permiten recuperar una wallet. Nunca se comparte ni se guarda en una foto." },
  { term: "Custodia", category: "cripto", definition: "Quién controla tus activos. En un exchange, los controla el exchange; en tu wallet, tú." },
  { term: "Perpetuo", category: "cripto", definition: "Futuro sin fecha de vencimiento. Usa funding para acercar su precio al spot y permite apalancamiento alto." },
  { term: "Funding", category: "cripto", definition: "Pago periódico entre largos y cortos en perpetuos para mantener el precio alineado con el spot." },
  { term: "Spot", category: "cripto", definition: "Compra o venta del activo real, sin apalancamiento ni vencimiento." },
  { term: "On-chain", category: "cripto", definition: "Datos registrados en la blockchain: transacciones, direcciones activas, flujos de exchanges." },
  { term: "Halving", category: "cripto", definition: "Reducción a la mitad de la emisión de nuevos bitcoins cada ~210.000 bloques (unos cuatro años)." },
  { term: "Dominancia", category: "cripto", definition: "Porcentaje del valor total del mercado cripto que representa Bitcoin. Mide el apetito por riesgo." },
  { term: "Desbloqueo de tokens", category: "cripto", definition: "Liberación programada de tokens antes bloqueados. Puede aumentar la oferta disponible y presionar el precio." },
  { term: "DCA", category: "cripto", definition: "Dollar Cost Averaging: comprar una cantidad fija de forma periódica. Reduce el impacto del momento de entrada." },
];

export const GLOSSARY_CATEGORIES: {
  id: GlossaryCategory;
  label: string;
}[] = [
  { id: "fundamentos", label: "Fundamentos" },
  { id: "tecnico", label: "Análisis técnico" },
  { id: "riesgo", label: "Riesgo" },
  { id: "cripto", label: "Cripto" },
];
