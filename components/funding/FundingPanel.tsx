import { ExternalLink, ArrowDownLeft, ArrowUpRight, Undo2, XCircle } from "lucide-react";
import {
  chain,
  explorerAddressUrl,
  explorerBase,
  explorerTxUrl,
  isChainConfigured,
  shortAddress,
  stablecoinAddress,
} from "@/lib/chain/config";
import { getFundingState, getFundingTrace, type TraceEntry } from "@/lib/chain/read";
import { formatAmount, percentOf } from "@/lib/chain/token";
import { Card, Progress, ReservedSlot, SectionHead } from "@/components/ui";
import { DonateButton } from "./DonateButton";

/**
 * Panel de financiamiento de un proyecto.
 *
 * Componente de servidor: lee la cadena en el render, así el HTML ya llega
 * con las cifras. El único trozo que se ejecuta en el navegador es el
 * diálogo de donación, y solo si alguien lo abre.
 *
 * Degrada en tres niveles, y ninguno rompe la página:
 *   1. Sin contratos configurados → el hueco reservado de siempre.
 *   2. Con contratos pero el proyecto sin tesorería → aviso explícito.
 *   3. Con tesorería → cifras, reparto por hitos y trazabilidad.
 */
export async function FundingPanel({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  if (!isChainConfigured) {
    return (
      <ReservedSlot>
        Los aportes al proyecto se habilitan más adelante. Por ahora el trabajo
        es voluntario y así está declarado en cada rol.
      </ReservedSlot>
    );
  }

  const state = await getFundingState(slug);

  if (!state) {
    return (
      <ReservedSlot>
        Este proyecto todavía no tiene tesorería abierta. Se habilita cuando el
        equipo publica su roadmap definitivo.
      </ReservedSlot>
    );
  }

  const trace = await getFundingTrace(state.projectId);
  const { decimals, symbol } = state.token;
  const releasedPct = percentOf(state.totalReleased, state.totalRaised);

  return (
    <div className="space-y-4">
      {/* Cifras */}
      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="figure text-3xl font-semibold">
              {formatAmount(state.totalRaised, decimals)}
              <span className="ml-1.5 text-[15px] font-normal text-dim">{symbol}</span>
            </p>
            <p className="label mt-0.5">Recaudado en total</p>
          </div>
          <StatusChip status={state.status} />
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="label">Liberado al equipo</span>
            <span className="figure text-[12px] text-dim">{releasedPct.toFixed(0)}%</span>
          </div>
          <Progress value={releasedPct} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-surface-2 px-3 py-2.5">
            <dt className="label">En depósito</dt>
            <dd className="figure mt-0.5 text-[17px] font-semibold">
              {formatAmount(state.escrow, decimals)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-2 px-3 py-2.5">
            <dt className="label">Ya liberado</dt>
            <dd className="figure mt-0.5 text-[17px] font-semibold">
              {formatAmount(state.totalReleased, decimals)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-[13px] leading-relaxed text-dim">
          El dinero en depósito no lo controla el equipo. Se libera por tramos
          conforme se verifica cada hito, y si el proyecto se detiene vuelve a
          quien aportó.
        </p>

        <div className="mt-4">
          <DonateButton
            projectTitle={title}
            projectId={state.projectId.toString()}
            fundingAddress={state.contractAddress}
            tokenAddress={stablecoinAddress!}
            tokenSymbol={symbol}
            tokenDecimals={decimals}
            chainId={chain.id}
            chainName={chain.name}
            explorerBase={explorerBase}
            hasFaucet={symbol === "mUSDC"}
            disabled={state.status !== "activo"}
            disabledReason={
              state.status === "completado"
                ? "Este proyecto ya terminó y su tesorería está cerrada."
                : "Este proyecto se detuvo. Quien aportó puede reclamar su reembolso."
            }
          />
        </div>
      </Card>

      {/* Reparto por hitos */}
      <div>
        <SectionHead
          title="Liberación por hitos"
          aside={
            <span className="label">
              {state.milestonesApproved} de {state.milestoneCount}
            </span>
          }
        />
        <Card className="p-0">
          {state.milestones.map((m) => (
            <div
              key={m.index}
              className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0"
            >
              <span
                className={`figure w-6 shrink-0 text-[15px] ${
                  m.status === "aprobado" ? "text-brand" : "text-dim"
                }`}
              >
                {String(m.index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block">
                  {m.status === "aprobado"
                    ? "Verificado y liberado"
                    : m.status === "presentado"
                      ? "Evidencia presentada, en revisión"
                      : m.status === "rechazado"
                        ? "Devuelto al equipo"
                        : "Pendiente"}
                </span>
                {m.evidenceURI && (
                  <span className="mt-0.5 block truncate text-[12px] text-dim">
                    {m.evidenceURI}
                  </span>
                )}
              </span>
              <span className="figure shrink-0 text-[14px]">
                {m.released > 0n ? formatAmount(m.released, decimals) : "—"}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Trazabilidad */}
      <div>
        <SectionHead
          title="Movimientos verificables"
          aside={<span className="label">{trace.length} en la cadena</span>}
        />
        {trace.length === 0 ? (
          <Card>
            <p className="text-[14px] leading-relaxed text-dim">
              Todavía no hay movimientos. El primer aporte aparecerá aquí con su
              transacción, y cualquiera podrá comprobarlo en el explorador.
            </p>
          </Card>
        ) : (
          <Card className="p-0">
            {trace.slice(0, 12).map((entry) => (
              <TraceRow key={entry.txHash + entry.kind} entry={entry} decimals={decimals} symbol={symbol} />
            ))}
          </Card>
        )}

        <p className="label mt-2.5 leading-relaxed">
          Contrato{" "}
          <a
            href={explorerAddressUrl(state.contractAddress) ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand hover:underline"
          >
            {shortAddress(state.contractAddress)}
          </a>{" "}
          en {chain.name}
        </p>
      </div>
    </div>
  );
}

function TraceRow({
  entry,
  decimals,
  symbol,
}: {
  entry: TraceEntry;
  decimals: number;
  symbol: string;
}) {
  const meta = {
    donacion: { icon: ArrowDownLeft, label: "Aporte recibido", tone: "text-brand" },
    liberacion: { icon: ArrowUpRight, label: "Liberado por hito", tone: "text-accent" },
    fallo: { icon: XCircle, label: "Proyecto detenido", tone: "text-danger" },
    reembolso: { icon: Undo2, label: "Reembolso reclamado", tone: "text-dim" },
  }[entry.kind];

  const Icon = meta.icon;
  const url = explorerTxUrl(entry.txHash);

  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
      <span className={`shrink-0 ${meta.tone}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px]">
          {meta.label}
          {entry.milestoneIndex !== undefined && (
            <span className="text-dim"> · hito {entry.milestoneIndex + 1}</span>
          )}
        </span>
        <span className="label">
          {entry.actor ? shortAddress(entry.actor) : `bloque ${entry.blockNumber}`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="figure block text-[14px]">
          {formatAmount(entry.amount, decimals)}{" "}
          <span className="text-dim">{symbol}</span>
        </span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="label inline-flex items-center gap-1 text-brand hover:underline"
          >
            ver <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </span>
    </div>
  );
}

function StatusChip({ status }: { status: "activo" | "completado" | "fallido" }) {
  const map = {
    activo: { text: "Recaudando", cls: "text-brand bg-brand-soft" },
    completado: { text: "Cerrada", cls: "text-dim bg-surface-2" },
    fallido: { text: "Detenido", cls: "text-danger bg-danger-soft" },
  }[status];

  return (
    <span className={`label shrink-0 rounded-full px-2.5 py-1 ${map.cls}`}>{map.text}</span>
  );
}
