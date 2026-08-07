import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { formatUnits } from "viem";

/**
 * Despliega la tesorería y, si hace falta, la stablecoin de prueba.
 *
 * Deja dos rastros:
 *  1. `deployments/<red>.json` — direcciones y bloque de despliegue, que se
 *     versiona en el repositorio para saber qué hay corriendo en cada red.
 *  2. `../lib/chain/abis.ts` — los ABI dentro de la app de Next, para que
 *     frontend y contrato no puedan desincronizarse en silencio.
 *
 * Uso:
 *   npm run deploy:local      (red efímera de Hardhat)
 *   npm run deploy:sepolia    (Arbitrum Sepolia, requiere .env)
 */

/** Si se define, se usa esa stablecoin en vez de desplegar la de prueba. */
const EXISTING_STABLECOIN = process.env.STABLECOIN_ADDRESS;

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  const chainId = await publicClient.getChainId();
  const networkName = hre.network.name;
  const account = deployer.account.address;

  console.log(`\nRed         ${networkName} (chainId ${chainId})`);
  console.log(`Desplegando ${account}`);

  const balance = await publicClient.getBalance({ address: account });
  console.log(`Saldo       ${formatUnits(balance, 18)} ETH`);
  if (balance === 0n) {
    throw new Error(
      "La cuenta no tiene ETH. Consigue fondos de testnet en https://faucet.quicknode.com/arbitrum/sepolia antes de desplegar."
    );
  }

  // 1. Stablecoin
  let stablecoin: `0x${string}`;
  if (EXISTING_STABLECOIN) {
    stablecoin = EXISTING_STABLECOIN as `0x${string}`;
    console.log(`\nStablecoin  ${stablecoin} (existente, no se despliega)`);
  } else {
    const mock = await hre.viem.deployContract("MockUSDC");
    stablecoin = mock.address;
    console.log(`\nMockUSDC    ${stablecoin}`);
  }

  // 2. Tesorería
  const funding = await hre.viem.deployContract("CrewdFunding", [stablecoin, account]);
  console.log(`CrewdFunding ${funding.address}`);

  const blockNumber = await publicClient.getBlockNumber();

  // 3. Registro versionable
  const record = {
    network: networkName,
    chainId,
    deployedAt: new Date().toISOString(),
    deployedAtBlock: Number(blockNumber),
    deployer: account,
    contracts: {
      MockUSDC: EXISTING_STABLECOIN ? null : stablecoin,
      stablecoin,
      CrewdFunding: funding.address,
    },
  };

  const dir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${networkName}.json`), JSON.stringify(record, null, 2) + "\n");
  console.log(`\nRegistro    deployments/${networkName}.json`);

  exportAbis();

  console.log("\n--- Pega esto en el .env.local de la app de Next ---");
  console.log(`NEXT_PUBLIC_CHAIN_ID=${chainId}`);
  console.log(`NEXT_PUBLIC_CREWD_FUNDING_ADDRESS=${funding.address}`);
  console.log(`NEXT_PUBLIC_STABLECOIN_ADDRESS=${stablecoin}`);
  // Sin esto, leer los eventos obligaría a escanear la cadena desde el
  // bloque 0, cosa que ningún RPC público permite.
  console.log(`NEXT_PUBLIC_DEPLOY_BLOCK=${blockNumber}`);
  console.log("----------------------------------------------------\n");
}

/** Copia los ABI a la app. Se ejecuta en cada despliegue para que no puedan
 *  quedar desfasados respecto al bytecode que está en la red. */
function exportAbis() {
  const read = (name: string) => {
    const artifact = path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      `${name}.sol`,
      `${name}.json`
    );
    return JSON.parse(fs.readFileSync(artifact, "utf8")).abi;
  };

  const body = `// GENERADO AUTOMÁTICAMENTE por contracts/scripts/deploy.ts — no editar a mano.
// Se regenera en cada despliegue para que el ABI de la app no pueda
// desincronizarse del bytecode que está corriendo en la red.

export const crewdFundingAbi = ${JSON.stringify(read("CrewdFunding"), null, 2)} as const;

export const erc20Abi = ${JSON.stringify(read("MockUSDC"), null, 2)} as const;
`;

  const target = path.join(__dirname, "..", "..", "lib", "chain", "abis.ts");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  console.log(`ABIs        lib/chain/abis.ts`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
