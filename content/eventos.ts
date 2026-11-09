export type MarketEvent = {
  name: string;
  cadence: string;
  what: string;
  why: string;
  link: string;
  impact: "alto" | "medio";
};

export const MARKET_EVENTS: MarketEvent[] = [
  {
    name: "Reunión del FOMC (Fed)",
    cadence: "8 veces al año",
    what: "El comité de la Reserva Federal decide los tipos de interés de EE. UU. y publica sus proyecciones.",
    why: "Los tipos mueven el coste del dinero. Subidas suelen presionar a la baja los activos de riesgo; recortes, lo contrario. La reacción depende de lo que el mercado ya descontaba.",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    impact: "alto",
  },
  {
    name: "IPC / CPI (inflación EE. UU.)",
    cadence: "Mensual",
    what: "Dato de inflación de precios al consumidor. Se publica a media mañana (hora del Este).",
    why: "Si la inflación sorprende al alza, el mercado suele anticipar tipos más altos durante más tiempo. Es uno de los datos con más volatilidad inmediata en cripto y acciones.",
    link: "https://www.bls.gov/cpi/",
    impact: "alto",
  },
  {
    name: "Nóminas no agrícolas (NFP)",
    cadence: "Primer viernes de cada mes",
    what: "Empleo creado en EE. UU. fuera del sector agrícola, con tasa de paro y salarios.",
    why: "Un mercado laboral fuerte puede mantener la inflación alta y retrasar recortes de tipos. Genera movimientos bruscos en minutos.",
    link: "https://www.bls.gov/news.release/empsit.nr0.htm",
    impact: "alto",
  },
  {
    name: "Resultados empresariales",
    cadence: "Trimestral",
    what: "Las empresas cotizadas publican ingresos y beneficios. Las grandes tecnológicas arrastran al índice.",
    why: "Mueven acciones concretas y, por contagio, al mercado entero. Un gap tras resultados puede saltarse tu stop.",
    link: "https://finance.yahoo.com/calendar/earnings",
    impact: "medio",
  },
  {
    name: "Halving de Bitcoin",
    cadence: "Cada ~4 años (próximo ~2028)",
    what: "La emisión de nuevos bitcoins se reduce a la mitad cada 210.000 bloques.",
    why: "Reduce la oferta nueva. La narrativa de escasez influye en el ciclo, pero el efecto no es inmediato ni garantizado.",
    link: "https://www.bitcoinblockhalf.com/",
    impact: "medio",
  },
  {
    name: "Desbloqueos de tokens",
    cadence: "Variable por proyecto",
    what: "Liberación de tokens antes bloqueados (inversores, equipo, fundación).",
    why: "Aumenta la oferta disponible. Un desbloqueo grande puede presionar el precio a la baja, especialmente en proyectos con poca liquidez.",
    link: "https://token.unlocks.app/",
    impact: "medio",
  },
  {
    name: "Vencimiento de opciones",
    cadence: "Tercer viernes de cada mes",
    what: "Vencen contratos de opciones y futuros sobre índices y acciones.",
    why: "Puede generar movimientos artificiales cerca de los precios con más contratos abiertos. No cambia el valor de largo plazo.",
    link: "https://www.cboe.com/",
    impact: "medio",
  },
  {
    name: "Decisiones regulatorias y ETF",
    cadence: "Variable",
    what: "Aprobaciones, demandas o cambios normativos de la SEC, CFTC u otros reguladores.",
    why: "Pueden abrir o cerrar el acceso institucional a un activo. El mercado suele anticiparlas, así que la reacción depende de la sorpresa.",
    link: "https://www.sec.gov/news/pressreleases",
    impact: "alto",
  },
];
