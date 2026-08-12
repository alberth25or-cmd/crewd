"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { ChainInfo, FundingSummary } from "@/lib/chain/read";
import { DonateDialog } from "./DonateDialog";

/**
 * Botón de apoyo para tarjetas de listado.
 *
 * Se monta como hermano del enlace de la tarjeta, no dentro. Un `<button>`
 * anidado en un `<a>` es HTML inválido y además rompe la navegación: el clic
 * dispararía las dos cosas.
 *
 * Abre el diálogo de aporte en el sitio, sin pasar por el detalle. Es un clic
 * menos, a cambio de que quien aporta no vea el roadmap antes — por eso el
 * propio diálogo explica que el dinero se libera contra hitos.
 */
export function SupportButton({
  summary,
  chain,
  projectTitle,
  size = "md",
}: {
  summary: FundingSummary;
  chain: ChainInfo;
  projectTitle: string;
  size?: "md" | "sm";
}) {
  const [open, setOpen] = useState(false);
  const closed = summary.status !== "activo";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={closed}
        className={`brand-grad flex w-full items-center justify-center gap-2 rounded-full font-medium text-on-brand shadow-lg shadow-brand/20 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
          size === "sm" ? "min-h-[38px] text-[13px]" : "min-h-[44px] text-[15px]"
        }`}
      >
        <Heart className="h-4 w-4" />
        {closed
          ? summary.status === "completado"
            ? "Tesorería cerrada"
            : "Proyecto detenido"
          : "Apoya este proyecto"}
      </button>

      <DonateDialog
        open={open}
        onClose={() => setOpen(false)}
        projectTitle={projectTitle}
        projectId={summary.projectId}
        fundingAddress={chain.fundingAddress}
        tokenAddress={chain.tokenAddress}
        tokenSymbol={summary.symbol}
        tokenDecimals={summary.decimals}
        chainId={chain.chainId}
        chainName={chain.chainName}
        explorerBase={chain.explorerBase}
        hasFaucet={summary.symbol === "mUSDC"}
      />
    </>
  );
}
