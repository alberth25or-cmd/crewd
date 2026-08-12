/**
 * Diagnóstico de la capa on-chain.
 *
 * Comprueba contra la red lo que la aplicación espera encontrar: que el
 * token tenga los decimales correctos, que la tesorería apunte a ese token
 * y que los proyectos del catálogo estén registrados.
 *
 * Es lo primero que hay que ejecutar cuando la sección de financiamiento no
 * muestra lo que debería, porque separa "está mal configurado" de "está mal
 * desplegado".
 *
 *   node scripts/check-chain.mjs
 *
 * Lee la configuración de .env.local.
 */
import { readFileSync } from "node:fs";
import { createPublicClient, http, keccak256, toBytes } from "viem";
import { arbitrumSepolia } from "viem/chains";

const SLUGS = ["agua-limpia", "bitacora-docente", "ruta-segura", "voz-quechua"];

// Lectura mínima del .env.local, sin dependencias.
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
);

const FUNDING = env.NEXT_PUBLIC_CREWD_FUNDING_ADDRESS;
const TOKEN = env.NEXT_PUBLIC_STABLECOIN_ADDRESS;

if (!FUNDING || !TOKEN) {
  console.error("Falta NEXT_PUBLIC_CREWD_FUNDING_ADDRESS o NEXT_PUBLIC_STABLECOIN_ADDRESS en .env.local");
  process.exit(1);
}

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(env.NEXT_PUBLIC_RPC_URL || undefined),
});

const erc20Abi = [
  { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
];

const fundingAbi = [
  { type: "function", name: "projectCount", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "token", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "projectIdBySlugHash", inputs: [{ type: "bytes32" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
];

const read = (address, abi, functionName, args) =>
  client.readContract({ address, abi, functionName, args });

const [symbol, decimals, count, tokenInFunding] = await Promise.all([
  read(TOKEN, erc20Abi, "symbol"),
  read(TOKEN, erc20Abi, "decimals"),
  read(FUNDING, fundingAbi, "projectCount"),
  read(FUNDING, fundingAbi, "token"),
]);

const tokenMatches = tokenInFunding.toLowerCase() === TOKEN.toLowerCase();

console.log(`\nRed            Arbitrum Sepolia (${arbitrumSepolia.id})`);
console.log(`Tesorería      ${FUNDING}`);
console.log(`Token          ${symbol}, ${decimals} decimales`);
console.log(`               ${decimals === 6 ? "correcto" : "AVISO: se esperaban 6 decimales"}`);
console.log(`Token enlazado ${tokenMatches ? "coincide" : `NO COINCIDE — la tesorería apunta a ${tokenInFunding}`}`);
console.log(`\nProyectos registrados: ${count}\n`);

for (const slug of SLUGS) {
  const id = await read(FUNDING, fundingAbi, "projectIdBySlugHash", [keccak256(toBytes(slug))]);
  console.log(`  ${slug.padEnd(20)} ${id === 0n ? "SIN REGISTRAR" : `id ${id}`}`);
}

const missing = SLUGS.length - Number(count);
console.log(
  missing > 0
    ? `\nFaltan ${missing}. Llama a createProject desde Remix para los que digan SIN REGISTRAR.\n`
    : "\nTodo listo.\n"
);
