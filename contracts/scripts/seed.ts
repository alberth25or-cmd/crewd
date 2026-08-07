import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { keccak256, toBytes } from "viem";

/**
 * Registra en la cadena los proyectos del catálogo.
 *
 * El identificador on-chain es el hash del slug, así que este script es la
 * bisagra entre el catálogo de la aplicación y la tesorería. Es idempotente:
 * si un proyecto ya está registrado, lo salta en vez de fallar.
 *
 * El número de hitos es el número de sprints del roadmap, que es lo que
 * hace que "liberar por hito" signifique lo mismo dentro y fuera de la cadena.
 */

const CATALOGUE = [
  { slug: "agua-limpia", milestones: 6 },
  { slug: "bitacora-docente", milestones: 1 },
  { slug: "ruta-segura", milestones: 3 },
  { slug: "voz-quechua", milestones: 1 },
] as const;

async function main() {
  const networkName = hre.network.name;
  const file = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (!fs.existsSync(file)) {
    throw new Error(`No hay despliegue para ${networkName}. Ejecuta primero el script de deploy.`);
  }

  const record = JSON.parse(fs.readFileSync(file, "utf8"));
  const fundingAddress = record.contracts.CrewdFunding as `0x${string}`;

  const [signer] = await hre.viem.getWalletClients();
  const funding = await hre.viem.getContractAt("CrewdFunding", fundingAddress);

  console.log(`\nTesorería ${fundingAddress}`);
  console.log(`Líder     ${signer.account.address} (el que firma, para la demo)\n`);

  for (const project of CATALOGUE) {
    // Mismo hash que calcula el contrato, así sabemos si ya existe.
    const existingId = await funding.read.projectIdBySlugHash([
      keccak256(toBytes(project.slug)),
    ]);

    if (existingId !== 0n) {
      console.log(`  = ${project.slug} ya registrado como #${existingId}`);
      continue;
    }

    const hash = await funding.write.createProject([
      project.slug,
      signer.account.address,
      project.milestones,
    ]);
    console.log(`  + ${project.slug} (${project.milestones} hitos) — tx ${hash}`);
  }

  console.log(`\nTotal on-chain: ${await funding.read.projectCount()} proyectos\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
