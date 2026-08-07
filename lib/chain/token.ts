import { formatUnits, parseUnits, type Address, type PublicClient } from "viem";

/**
 * Manejo de decimales de la stablecoin.
 *
 * La regla que se rompe una y otra vez: dar por hecho que un token tiene
 * 18 decimales. USDC tiene 6 en casi todas las cadenas, y USDT tiene 6 en
 * Ethereum pero 18 en BSC. Multiplicar por 1e18 en vez de 1e6 no lanza
 * ningún error: simplemente mueve un billón de veces la cantidad correcta.
 *
 * Aquí los decimales se leen del contrato en tiempo de ejecución y se
 * cachean por (chainId, dirección) — nunca por símbolo, porque el mismo
 * símbolo tiene distintos decimales en distintas cadenas.
 */

const ERC20_METADATA_ABI = [
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
] as const;

export interface TokenMeta {
  decimals: number;
  symbol: string;
}

const cache = new Map<string, TokenMeta>();

/**
 * Lee decimales y símbolo del token, con caché.
 * @param chainId Forma parte de la clave: la misma dirección en otra cadena
 *                puede ser otro token con otros decimales.
 */
export async function getTokenMeta(
  client: PublicClient,
  token: Address,
  chainId: number
): Promise<TokenMeta> {
  const key = `${chainId}:${token.toLowerCase()}`;
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const [decimals, symbol] = await Promise.all([
      client.readContract({
        address: token,
        abi: ERC20_METADATA_ABI,
        functionName: "decimals",
      }),
      client.readContract({
        address: token,
        abi: ERC20_METADATA_ABI,
        functionName: "symbol",
      }),
    ]);

    const meta: TokenMeta = { decimals: Number(decimals), symbol };
    cache.set(key, meta);
    return meta;
  } catch (error) {
    // Algunos tokens antiguos no implementan decimals(). Se cae a 18, que
    // es el valor por defecto del estándar, pero se deja rastro: un token
    // que llega hasta aquí necesita revisión manual.
    console.warn(
      `[chain] decimals() falló en ${token} (cadena ${chainId}); se asume 18. Verifica el token.`,
      error
    );
    return { decimals: 18, symbol: "???" };
  }
}

/**
 * Formatea unidades base para mostrar. Exacto: no pasa por `Number`, así
 * que no pierde precisión con cantidades grandes.
 * @param maxFractionDigits Dígitos decimales a mostrar. El valor completo
 *                          sigue disponible en la cadena original.
 */
export function formatAmount(
  raw: bigint,
  decimals: number,
  maxFractionDigits = 2
): string {
  const full = formatUnits(raw, decimals);
  const [whole, fraction = ""] = full.split(".");

  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (maxFractionDigits === 0) return grouped;

  const trimmed = fraction.slice(0, maxFractionDigits).replace(/0+$/, "");
  return trimmed ? `${grouped}.${trimmed}` : grouped;
}

/**
 * Convierte lo que escribe una persona a unidades base.
 * @throws Si el texto no es un número válido o tiene más decimales de los
 *         que el token admite — truncar en silencio es como se pierde dinero.
 */
export function parseAmount(input: string, decimals: number): bigint {
  const clean = input.trim().replace(/,/g, "");
  if (!/^\d*\.?\d*$/.test(clean) || clean === "" || clean === ".") {
    throw new Error("Escribe una cantidad válida");
  }

  const [, fraction = ""] = clean.split(".");
  if (fraction.length > decimals) {
    throw new Error(`Esta moneda admite como mucho ${decimals} decimales`);
  }

  return parseUnits(clean, decimals);
}

/** Porcentaje con un decimal, sin dividir bigints en punto flotante. */
export function percentOf(part: bigint, total: bigint): number {
  if (total === 0n) return 0;
  return Number((part * 10_000n) / total) / 100;
}
