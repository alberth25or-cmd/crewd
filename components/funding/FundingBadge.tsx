import { Heart } from "lucide-react";
import type { FundingSummary } from "@/lib/chain/read";
import { formatAmount } from "@/lib/chain/token";

/**
 * Resumen de financiamiento para tarjetas de listado.
 *
 * Aportar no es cosa de un tipo de usuario: quien construye, quien colabora
 * y quien solo entró a mirar pueden hacerlo por igual. Por eso las cifras
 * viven en el listado y no escondidas en el detalle — si no se ven, nadie
 * descubre que puede apoyar.
 *
 * Es un componente de presentación puro: recibe importes ya serializados a
 * texto, así funciona igual dentro de un componente de cliente.
 */
export function FundingBadge({ summary }: { summary: FundingSummary }) {
  const raised = BigInt(summary.totalRaised);
  const released = BigInt(summary.totalReleased);
  const escrow = BigInt(summary.escrow);

  const releasedPct = raised === 0n ? 0 : Number((released * 10_000n) / raised) / 100;
  const nothingYet = raised === 0n;

  return (
    <div className="mt-3 rounded-xl bg-surface-2 px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="figure text-[15px] font-semibold">
          {formatAmount(raised, summary.decimals)}
          <span className="ml-1 text-[11px] font-normal text-dim">{summary.symbol}</span>
        </span>
        <span className="label inline-flex items-center gap-1 text-brand">
          <Heart className="h-3 w-3" />
          {nothingYet ? "Sé el primero" : "Aportar"}
        </span>
      </div>

      {!nothingYet && (
        <>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${releasedPct}%` }}
            />
          </div>
          <p className="label mt-1.5">
            {formatAmount(escrow, summary.decimals)} en depósito ·{" "}
            {formatAmount(released, summary.decimals)} liberado
          </p>
        </>
      )}

      {nothingYet && (
        <p className="label mt-1">Tesorería abierta, sin aportes todavía</p>
      )}
    </div>
  );
}
