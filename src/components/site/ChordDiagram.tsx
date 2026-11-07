import type { Acorde } from "@/lib/blog";

const CASAS = 4;
const W = 120;
const H = 150;
const X0 = 18;
const Y0 = 28;
const GAP_X = (W - X0 * 2) / 5;
const GAP_Y = (H - Y0 - 12) / CASAS;

export function ChordDiagram({ acorde }: { acorde: Acorde }) {
  return (
    <figure className="flex flex-col items-center rounded-lg border border-border bg-card p-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[160px]"
        role="img"
        aria-label={`Desenho do acorde ${acorde.nome} (${acorde.cifra})`}
      >
        {/* pestana */}
        <line x1={X0} x2={W - X0} y1={Y0} y2={Y0} className="stroke-foreground" strokeWidth={4} />
        {Array.from({ length: CASAS }, (_, i) => (
          <line
            key={`f${i}`}
            x1={X0}
            x2={W - X0}
            y1={Y0 + GAP_Y * (i + 1)}
            y2={Y0 + GAP_Y * (i + 1)}
            className="stroke-muted-foreground"
            strokeWidth={1}
          />
        ))}
        {acorde.casas.map((casa, corda) => {
          const x = X0 + GAP_X * corda;
          return (
            <g key={corda}>
              <line x1={x} x2={x} y1={Y0} y2={Y0 + GAP_Y * CASAS} className="stroke-muted-foreground" strokeWidth={1} />
              {casa === null && (
                <text x={x} y={Y0 - 10} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  ×
                </text>
              )}
              {casa === 0 && (
                <circle cx={x} cy={Y0 - 14} r={4} className="fill-none stroke-foreground" strokeWidth={1.4} />
              )}
              {casa !== null && casa > 0 && (
                <circle cx={x} cy={Y0 + GAP_Y * (casa - 0.5)} r={6.5} className="fill-primary" />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-center">
        <span className="font-display text-2xl font-semibold">{acorde.nome}</span>{" "}
        <span className="text-primary">({acorde.cifra})</span>
      </figcaption>
    </figure>
  );
}
