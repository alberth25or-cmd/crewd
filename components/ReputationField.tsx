import type { Reputation } from "@/lib/types";

/**
 * ELEMENTO FIRMA — Campo de reputación.
 *
 * El prototipo anterior calificaba con cinco estrellas sobre cinco
 * categorías y las promediaba a un solo 5.0. Eso rompe dos reglas del
 * documento a la vez: los ejes son explícitamente independientes ("un
 * crack impuntual y un mediocre confiable no pueden tener el mismo
 * número") y hay que mostrar la distribución, no la media.
 *
 * Un plano resuelve ambas: cada evaluación es un punto, la nube muestra
 * la dispersión y la cruz marca el centro. Dos personas con 4.5/4.5 —
 * una consistente y otra errática — se ven distintas de un vistazo, que
 * es justo la diferencia que un líder necesita antes de aceptar a
 * alguien.
 */

/**
 * Dispersión determinista: dos evaluaciones idénticas se superpondrían y
 * la nube perdería densidad.
 *
 * Usa aritmética entera (mulberry32) a propósito. La versión obvia —
 * `Math.sin(i * k) * 43758.5453` — parece determinista pero no lo es
 * entre motores: la especificación deja la precisión de las funciones
 * trascendentes a la implementación, y Node y el navegador difieren
 * alrededor del decimal 11. Suficiente para romper la hidratación de
 * React en cada punto de la nube.
 *
 * Math.imul y los operadores de bits sí están definidos al bit.
 */
function jitter(index: number, axis: 0 | 1): number {
  let h = (index + 1) * 0x9e3779b1 + axis * 0x85ebca6b;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  h ^= h >>> 15;
  return ((h >>> 0) / 4294967296 - 0.5) * 3.4;
}

const toX = (v: number) => 8 + (v / 5) * 84;
const toY = (v: number) => 92 - (v / 5) * 84;

export function ReputationField({
  reputation,
  size = 200,
  showAxes = true,
}: {
  reputation: Reputation;
  size?: number;
  showAxes?: boolean;
}) {
  const { reliability, skill, count, samples } = reputation;
  const empty = count === 0;

  return (
    <div className="inline-flex flex-col gap-2">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="block rounded-card border border-line bg-surface-2"
        role="img"
        aria-label={
          empty
            ? "Sin evaluaciones todavía"
            : `Confiabilidad ${reliability} de 5, habilidad ${skill} de 5, según ${count} evaluaciones`
        }
      >
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <g key={v} stroke="var(--line)" strokeWidth="0.4">
            <line x1={toX(v)} y1={8} x2={toX(v)} y2={92} />
            <line x1={8} y1={toY(v)} x2={92} y2={toY(v)} />
          </g>
        ))}

        {empty ? (
          <g>
            <rect
              x={8}
              y={8}
              width={84}
              height={84}
              fill="none"
              stroke="var(--text-dim)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <text
              x="50"
              y="52"
              textAnchor="middle"
              fill="var(--text-dim)"
              style={{ font: "500 5px var(--font-mono)", letterSpacing: "0.1em" }}
            >
              SIN DATOS
            </text>
          </g>
        ) : (
          <>
            {/* La nube: una marca por evaluación real. */}
            {samples.map((s, i) => (
              <circle
                key={i}
                cx={toX(s.reliability) + jitter(i, 0)}
                cy={toY(s.skill) + jitter(i, 1)}
                r="1.7"
                fill="var(--brand-2)"
                opacity="0.35"
              />
            ))}

            {/* El centro, proyectado sobre ambos ejes. */}
            <g stroke="var(--brand-2)" strokeWidth="0.5" strokeDasharray="1.5 1.5">
              <line x1={toX(reliability)} y1={toY(skill)} x2={toX(reliability)} y2={92} />
              <line x1={toX(reliability)} y1={toY(skill)} x2={8} y2={toY(skill)} />
            </g>
            <circle cx={toX(reliability)} cy={toY(skill)} r="2.6" fill="var(--brand-2)" />
          </>
        )}
      </svg>

      {showAxes && (
        <div className="flex items-baseline justify-between" style={{ width: size }}>
          <span className="label">→ Confiabilidad</span>
          <span className="label">↑ Habilidad</span>
        </div>
      )}
    </div>
  );
}

/** Lectura numérica del campo, separada del gráfico porque algunas
 *  pantallas necesitan el número sin el plano y viceversa. */
export function ReputationReadout({
  reputation,
  completionRate,
}: {
  reputation: Reputation;
  completionRate: number | null;
}) {
  const { reliability, skill, count } = reputation;

  if (count === 0) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          {["Confiabilidad", "Habilidad", "Finalización"].map((t) => (
            <div key={t} className="rounded-card bg-surface-2 px-2 py-2.5 text-center">
              <p className="figure text-xl text-dim">—</p>
              <p className="label mt-0.5">{t}</p>
            </div>
          ))}
        </div>
        <p className="label mt-2 text-center">Sin evaluaciones todavía</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-card bg-surface-2 px-2 py-2.5 text-center">
          <p className="figure text-xl font-semibold">{reliability.toFixed(1)}</p>
          <p className="label mt-0.5">Confiabilidad</p>
        </div>
        <div className="rounded-card bg-surface-2 px-2 py-2.5 text-center">
          <p className="figure text-xl font-semibold">{skill.toFixed(1)}</p>
          <p className="label mt-0.5">Habilidad</p>
        </div>
        <div className="rounded-card bg-surface-2 px-2 py-2.5 text-center">
          <p className="figure text-xl font-semibold">
            {completionRate === null ? "—" : `${Math.round(completionRate * 100)}%`}
          </p>
          <p className="label mt-0.5">Finalización</p>
        </div>
      </div>
      <p className="label mt-2 text-center">
        Sostenido por {count} evaluación{count === 1 ? "" : "es"} de compañeros de equipo
      </p>
    </div>
  );
}
