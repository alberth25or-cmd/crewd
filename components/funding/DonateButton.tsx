"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { Address } from "viem";
import { Button } from "@/components/ui";
import { DonateDialog } from "./DonateDialog";

/**
 * Disparador del diálogo de donación.
 *
 * Existe solo para aislar el estado abierto/cerrado, de modo que
 * `FundingPanel` pueda seguir siendo un componente de servidor y leer la
 * cadena sin enviar nada de eso al navegador.
 */
export function DonateButton(props: {
  projectTitle: string;
  projectId: string;
  fundingAddress: Address;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenDecimals: number;
  chainId: number;
  chainName: string;
  explorerBase: string | null;
  hasFaucet: boolean;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [open, setOpen] = useState(false);

  if (props.disabled) {
    return (
      <div className="rounded-card border border-dashed border-line px-4 py-3 text-center">
        <p className="label leading-relaxed">{props.disabledReason}</p>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        <Heart className="h-4 w-4" />
        Apoya este proyecto
      </Button>

      <DonateDialog open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}
