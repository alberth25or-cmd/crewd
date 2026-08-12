import type { FundingSummary } from "@/lib/chain/read";
import { formatAmount } from "@/lib/chain/token";

/**
 * Cifras de la tesorería para tarjetas de listado.
 *
 * Aportar no es cosa de un tipo de usuario: quien construye, quien colabora y
 * quien entró solo a mirar pueden hacerlo por igual. Si las cifras no se ven
 * en el listado, nadie descubre que puede apoyar.
 *
 * Componente de presentación puro: recibe importes ya serializados a texto,
 * así funciona igual dentro de un componente de cliente.
 */
export function FundingBadge({ summary }: { summary: FundingSummary }) {
  const raised = BigInt(summary.totalRaised);
  const released = BigInt(summary.totalReleased);
  const escrow = BigInt(summary.escrow);

  const releasedPct = raised === 0n ? 0 : Number((released * 10_000n) / raised) / 100;
  const nothingYet = raised === 0n;

  return (
    <div className="mt-4 rounded-xl bg-surface-2 px-3.5 py-3">
      <p className="label">Recaudado</p>

      <p className="figure mt-0.5 text-2xl font-semibold">
        {formatAmount(raised, summary.decimals)}
        <span className="ml-1.5 text-[12px] font-normal text-dim">{summary.symbol}</span>
      </p>

      {nothingYet ? (
        <p className="label mt-1.5 leading-relaxed">
          Tesorería abierta · sé el primero en aportar
        </p>
      ) : (
        <>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${releasedPct}%` }}
            />
          </div>
          <p className="label mt-1.5 leading-relaxed">
            {formatAmount(escrow, summary.decimals)} retenido en depósito ·{" "}
            {formatAmount(released, summary.decimals)} liberado por hitos
          </p>
        </>
      )}
    </div>
  );
}
