type PatternType = "hch" | "triangle" | "flag";

const TITLES: Record<PatternType, string> = {
  hch: "Hombro-cabeza-hombro",
  triangle: "Triángulo convergente",
  flag: "Bandera",
};

export function PatternChart({
  type,
  caption,
}: {
  type: PatternType;
  caption?: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <svg
        viewBox="0 0 360 180"
        className="w-full"
        role="img"
        aria-label={`Esquema de ${TITLES[type]}`}
      >
        <g stroke="var(--color-line)" strokeWidth="1" opacity="0.55">
          <line x1="0" y1="45" x2="360" y2="45" />
          <line x1="0" y1="90" x2="360" y2="90" />
          <line x1="0" y1="135" x2="360" y2="135" />
        </g>

        {type === "hch" && (
          <>
            <polyline
              points="20,140 65,75 105,115 165,45 225,115 265,75 330,140"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="40"
              y1="115"
              x2="320"
              y2="115"
              stroke="var(--color-info)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <g fill="var(--color-muted)" fontSize="8" fontFamily="inherit">
              <text x="52" y="66">Hombro</text>
              <text x="150" y="36">Cabeza</text>
              <text x="250" y="66">Hombro</text>
              <text x="40" y="108">Cuello</text>
              <text x="288" y="132">Ruptura</text>
            </g>
          </>
        )}

        {type === "triangle" && (
          <>
            <line
              x1="20"
              y1="45"
              x2="330"
              y2="105"
              stroke="var(--color-down)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="20"
              y1="150"
              x2="330"
              y2="105"
              stroke="var(--color-up)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g fill="var(--color-muted)" fontSize="8" fontFamily="inherit">
              <text x="26" y="38">Máximos descendentes</text>
              <text x="26" y="164">Mínimos ascendentes</text>
              <text x="292" y="98">Ruptura</text>
            </g>
          </>
        )}

        {type === "flag" && (
          <>
            <line
              x1="25"
              y1="150"
              x2="95"
              y2="45"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="45"
              x2="185"
              y2="70"
              stroke="var(--color-info)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="85"
              x2="185"
              y2="110"
              stroke="var(--color-info)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="185"
              y1="70"
              x2="185"
              y2="110"
              stroke="var(--color-info)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <g fill="var(--color-muted)" fontSize="8" fontFamily="inherit">
              <text x="40" y="100">Mástil</text>
              <text x="120" y="62">Bandera</text>
              <text x="196" y="98">Ruptura</text>
            </g>
          </>
        )}
      </svg>
      <figcaption className="border-t border-line/70 px-3 py-1.5 text-[10px] text-faint">
        {caption ?? "Esquema idealizado. En un gráfico real, el contexto manda."}
      </figcaption>
    </figure>
  );
}
