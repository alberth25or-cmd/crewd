import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const { ARBITRUM_SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY, ARBISCAN_API_KEY } = process.env;

/**
 * Configuración de Hardhat.
 *
 * La clave privada se lee del entorno y nunca se escribe en el repositorio.
 * Si falta, la red sigue definida pero sin cuentas: los comandos de solo
 * lectura funcionan y los de escritura fallan con un mensaje claro, en vez
 * de que Hardhat reviente al arrancar.
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      // Arbitrum cobra por byte de calldata publicado en L1, así que el
      // tamaño del bytecode importa más que en la L1 pura.
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    arbitrumSepolia: {
      chainId: 421614,
      url: ARBITRUM_SEPOLIA_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: ARBISCAN_API_KEY ?? "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
