import { createPublicClient, http, type Address } from "viem";
import { arbitrumSepolia, hardhat } from "viem/chains";

/**
 * Configuración de la capa on-chain.
 *
 * Todo es opcional a propósito. Si faltan las variables de entorno la
 * aplicación funciona igual y la sección de financiamiento vuelve a su
 * estado "próximamente". Es lo que permite desplegar en Vercel antes de
 * tener contratos, y lo que evita que un error de configuración tumbe
 * páginas que no tienen nada que ver con la cadena.
 */

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? arbitrumSepolia.id);

export const chain = CHAIN_ID === hardhat.id ? hardhat : arbitrumSepolia;

export const fundingAddress = normalizeAddress(
  process.env.NEXT_PUBLIC_CREWD_FUNDING_ADDRESS
);
export const stablecoinAddress = normalizeAddress(
  process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS
);

/** Bloque del despliegue. Sin esto habría que escanear la cadena entera
 *  para leer los eventos, cosa que ningún RPC público tolera. */
export const deployBlock = BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK ?? "0");

/** `true` solo si hay contrato y token configurados. */
export const isChainConfigured = Boolean(fundingAddress && stablecoinAddress);

export const publicClient = createPublicClient({
  chain,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || undefined),
});

const EXPLORERS: Record<number, string> = {
  [arbitrumSepolia.id]: "https://sepolia.arbiscan.io",
};

/** Raíz del explorador de bloques, o `null` en redes que no tienen (local). */
export const explorerBase: string | null = EXPLORERS[chain.id] ?? null;

export function explorerTxUrl(hash: string): string | null {
  return explorerBase ? `${explorerBase}/tx/${hash}` : null;
}

export function explorerAddressUrl(address: string): string | null {
  return explorerBase ? `${explorerBase}/address/${address}` : null;
}

/** Acorta una dirección para mostrarla sin ocupar media pantalla. */
export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function normalizeAddress(value: string | undefined): Address | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return undefined;
  return trimmed as Address;
}
