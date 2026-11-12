export function EquitySparkline({
  points,
}: {
  points: { at: number; value: number }[];
}) {
  if (points.length < 2) {
    return (
      <div className="flex h-16 items-center justify-center text-[10px] text-faint">
        La curva aparecerá después de tu primera operación.
      </div>
    );
  }

  const width = 300;
  const height = 70;
  const pad = 4;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const coords = points.map((point, index) => [
    pad + (index / (points.length - 1)) * (width - pad * 2),
    height - pad - ((point.value - min) / span) * (height - pad * 2),
  ]);

  const path = coords
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`,
    )
    .join(" ");

  const last = points[points.length - 1].value;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full"
      role="img"
      aria-label={`Curva de equity. Valor actual ${last.toFixed(2)} dólares.`}
    >
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
