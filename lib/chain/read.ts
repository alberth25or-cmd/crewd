import { cache } from "react";
import { keccak256, toBytes, type Address } from "viem";
import { crewdFundingAbi } from "./abis";
import {
  deployBlock,
  fundingAddress,
  isChainConfigured,
  publicClient,
  stablecoinAddress,
  chain,
} from "./config";
import { getTokenMeta, type TokenMeta } from "./token";

/**
 * Lecturas on-chain, siempre desde el servidor.
 *
 * El navegador nunca habla con el RPC para leer: así la página se renderiza
 * con los datos ya dentro (importa para el SEO de la landing y para que un
 * teléfono lento no espere a una petición extra), y de paso la clave del
 * proveedor RPC no queda expuesta en el cliente.
 *
 * Todo devuelve `null` si la cadena no está configurada o si el RPC falla.
 * Ninguna pantalla debe romperse porque un nodo esté caído.
 */

export type ProjectStatus = "activo" | "completado" | "fallido";

export interface OnChainMilestone {
  index: number;
  status: "pendiente" | "presentado" | "aprobado" | "rechazado";
  released: bigint;
  evidenceURI: string;
}

export interface FundingState {
  projectId: bigint;
  leader: Address;
  status: ProjectStatus;
  milestoneCount: number;
  milestonesApproved: number;
  totalRaised: bigint;
  totalReleased: bigint;
  escrow: bigint;
  refundPool: bigint;
  milestones: OnChainMilestone[];
  token: TokenMeta;
  contractAddress: Address;
}

export type TraceKind = "donacion" | "liberacion" | "fallo" | "reembolso";

export interface TraceEntry {
  kind: TraceKind;
  amount: bigint;
  actor?: Address;
  milestoneIndex?: number;
  blockNumber: bigint;
  txHash: `0x${string}`;
}

const STATUS: ProjectStatus[] = ["activo", "completado", "fallido"];
const MILESTONE_STATUS: OnChainMilestone["status"][] = [
  "pendiente",
  "presentado",
  "aprobado",
  "rechazado",
];

/**
 * Estado de la tesorería de un proyecto.
 * @returns `null` si el proyecto no está registrado en la cadena todavía.
 */
export const getFundingState = cache(
  async (slug: string): Promise<FundingState | null> => {
    if (!isChainConfigured || !fundingAddress || !stablecoinAddress) return null;

    try {
      const slugHash = keccak256(toBytes(slug));
      const projectId = await publicClient.readContract({
        address: fundingAddress,
        abi: crewdFundingAbi,
        functionName: "projectIdBySlugHash",
        args: [slugHash],
      });

      // 0 significa "no registrado". El proyecto existe en el catálogo pero
      // aún no tiene tesorería abierta.
      if (projectId === 0n) return null;

      const [project, escrow, milestones, token] = await Promise.all([
        publicClient.readContract({
          address: fundingAddress,
          abi: crewdFundingAbi,
          functionName: "getProject",
          args: [projectId],
        }),
        publicClient.readContract({
          address: fundingAddress,
          abi: crewdFundingAbi,
          functionName: "escrowOf",
          args: [projectId],
        }),
        publicClient.readContract({
          address: fundingAddress,
          abi: crewdFundingAbi,
          functionName: "getMilestones",
          args: [projectId],
        }),
        getTokenMeta(publicClient, stablecoinAddress, chain.id),
      ]);

      return {
        projectId,
        leader: project.leader,
        status: STATUS[project.status] ?? "activo",
        milestoneCount: project.milestoneCount,
        milestonesApproved: project.milestonesApproved,
        totalRaised: project.totalRaised,
        totalReleased: project.totalReleased,
        escrow,
        refundPool: project.refundPool,
        milestones: milestones.map((m, index) => ({
          index,
          status: MILESTONE_STATUS[m.status] ?? "pendiente",
          released: m.released,
          evidenceURI: m.evidenceURI,
        })),
        token,
        contractAddress: fundingAddress,
      };
    } catch (error) {
      console.error(`[chain] no se pudo leer la tesorería de "${slug}"`, error);
      return null;
    }
  }
);

/**
 * Historial on-chain de un proyecto: cada movimiento de dinero con su
 * transacción. Es la parte que hace verificable la trazabilidad — cualquiera
 * puede abrir el explorador y comprobar que lo que dice la interfaz pasó.
 */
export const getFundingTrace = cache(
  async (projectId: bigint): Promise<TraceEntry[]> => {
    if (!isChainConfigured || !fundingAddress) return [];

    try {
      const common = {
        address: fundingAddress,
        abi: crewdFundingAbi,
        fromBlock: deployBlock,
        toBlock: "latest" as const,
      };

      const [donations, releases, failures, refunds] = await Promise.all([
        publicClient.getContractEvents({
          ...common,
          eventName: "DonationReceived",
          args: { projectId },
        }),
        publicClient.getContractEvents({
          ...common,
          eventName: "MilestoneApproved",
          args: { projectId },
        }),
        publicClient.getContractEvents({
          ...common,
          eventName: "ProjectFailed",
          args: { projectId },
        }),
        publicClient.getContractEvents({
          ...common,
          eventName: "RefundClaimed",
          args: { projectId },
        }),
      ]);

      const entries: TraceEntry[] = [
        ...donations.map((log) => ({
          kind: "donacion" as const,
          amount: log.args.amount ?? 0n,
          actor: log.args.donor,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
        })),
        ...releases.map((log) => ({
          kind: "liberacion" as const,
          amount: log.args.amountReleased ?? 0n,
          actor: log.args.leader,
          milestoneIndex: Number(log.args.index ?? 0n),
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
        })),
        ...failures.map((log) => ({
          kind: "fallo" as const,
          amount: log.args.refundPool ?? 0n,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
        })),
        ...refunds.map((log) => ({
          kind: "reembolso" as const,
          amount: log.args.amount ?? 0n,
          actor: log.args.donor,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
        })),
      ];

      // Más reciente primero.
      return entries.sort((a, b) => Number(b.blockNumber - a.blockNumber));
    } catch (error) {
      console.error(`[chain] no se pudo leer el historial del proyecto ${projectId}`, error);
      return [];
    }
  }
);
