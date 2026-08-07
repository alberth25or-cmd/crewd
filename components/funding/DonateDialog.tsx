"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, Wallet, Check, ExternalLink, Droplet, AlertTriangle } from "lucide-react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  type Address,
  type EIP1193Provider,
} from "viem";
import { Button } from "@/components/ui";
import { formatAmount, parseAmount } from "@/lib/chain/token";

/**
 * Flujo de donación.
 *
 * Es el ÚNICO punto de la aplicación donde aparece una wallet. El principio
 * del producto dice que la cadena debe ser invisible, y se respeta donde
 * importa: el constructor nunca ve cripto en ninguna pantalla. El donante sí,
 * porque es otra persona con otra expectativa — quien va a mover dinero
 * espera que le pidan firmar.
 *
 * Sin wagmi ni proveedor global a propósito: así el código de wallet solo se
 * descarga cuando alguien abre este diálogo, y ninguna otra página carga un
 * kilobyte de web3.
 */

/** ABI mínimo. Enviar el ABI completo al navegador sería ~10 KB para usar
 *  tres funciones. */
const FUNDING_ABI = [
  {
    type: "function",
    name: "donate",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

const TOKEN_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "faucet",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

type Step =
  | "idle"
  | "connecting"
  | "wrong-network"
  | "approving"
  | "donating"
  | "minting"
  | "done";

interface Props {
  open: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string; // bigint serializado: los server components no pasan bigint
  fundingAddress: Address;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenDecimals: number;
  chainId: number;
  chainName: string;
  explorerBase: string | null;
  /** El token de prueba tiene grifo; el USDC real no. */
  hasFaucet: boolean;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

const PRESETS = [10, 25, 50];

export function DonateDialog({
  open,
  onClose,
  projectTitle,
  projectId,
  fundingAddress,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  chainId,
  chainName,
  explorerBase,
  hasFaucet,
}: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("idle");
  const [account, setAccount] = useState<Address | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [amount, setAmount] = useState("25");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setTxHash(null);
  }, []);

  /** Saldo del donante, para avisar antes de que la transacción falle. */
  const refreshBalance = useCallback(
    async (address: Address) => {
      if (!window.ethereum) return;
      try {
        const client = createPublicClient({ transport: custom(window.ethereum) });
        const value = await client.readContract({
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(value);
      } catch {
        setBalance(null);
      }
    },
    [tokenAddress]
  );

  /** Cierra y limpia. Se hace aquí y no en un efecto sobre `open` porque
   *  resetear dentro de un efecto dispara un render en cascada; el retraso
   *  deja que termine la animación de salida antes de vaciar la pantalla. */
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(reset, 250);
  }, [onClose, reset]);

  async function connect() {
    setError(null);

    if (!window.ethereum) {
      setError(
        "No encontramos una wallet en este navegador. Instala MetaMask o ábrelo desde el navegador de tu wallet."
      );
      return;
    }

    setStep("connecting");
    try {
      const wallet = createWalletClient({ transport: custom(window.ethereum) });
      const [address] = await wallet.requestAddresses();
      setAccount(address);

      const current = await wallet.getChainId();
      if (current !== chainId) {
        setStep("wrong-network");
        return;
      }

      await refreshBalance(address);
      setStep("idle");
    } catch (e) {
      setError(readableError(e));
      setStep("idle");
    }
  }

  async function switchNetwork() {
    if (!window.ethereum) return;
    setError(null);
    try {
      const wallet = createWalletClient({ transport: custom(window.ethereum) });
      await wallet.switchChain({ id: chainId });
      if (account) await refreshBalance(account);
      setStep("idle");
    } catch (e) {
      setError(
        `No se pudo cambiar de red. Cambia manualmente a ${chainName} desde tu wallet. (${readableError(e)})`
      );
    }
  }

  async function claimFaucet() {
    if (!window.ethereum || !account) return;
    setError(null);
    setStep("minting");
    try {
      const wallet = createWalletClient({ account, transport: custom(window.ethereum) });
      const client = createPublicClient({ transport: custom(window.ethereum) });

      const hash = await wallet.writeContract({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: "faucet",
        chain: null,
      });
      await client.waitForTransactionReceipt({ hash });
      await refreshBalance(account);
      setStep("idle");
    } catch (e) {
      setError(readableError(e));
      setStep("idle");
    }
  }

  async function donate() {
    if (!window.ethereum || !account) return;

    let value: bigint;
    try {
      value = parseAmount(amount, tokenDecimals);
    } catch (e) {
      setError((e as Error).message);
      return;
    }

    if (value === 0n) {
      setError("La cantidad tiene que ser mayor que cero");
      return;
    }
    if (balance !== null && value > balance) {
      setError(`No te alcanza. Tienes ${formatAmount(balance, tokenDecimals)} ${tokenSymbol}.`);
      return;
    }

    setError(null);
    try {
      const wallet = createWalletClient({ account, transport: custom(window.ethereum) });
      const client = createPublicClient({ transport: custom(window.ethereum) });

      // 1. Permiso. Solo se pide si el que hay no alcanza — así una segunda
      //    donación pequeña no obliga a firmar dos veces.
      const allowance = await client.readContract({
        address: tokenAddress,
        abi: TOKEN_ABI,
        functionName: "allowance",
        args: [account, fundingAddress],
      });

      if (allowance < value) {
        setStep("approving");
        const approveHash = await wallet.writeContract({
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: "approve",
          args: [fundingAddress, value],
          chain: null,
        });
        await client.waitForTransactionReceipt({ hash: approveHash });
      }

      // 2. Donación.
      setStep("donating");
      const hash = await wallet.writeContract({
        address: fundingAddress,
        abi: FUNDING_ABI,
        functionName: "donate",
        args: [BigInt(projectId), value],
        chain: null,
      });

      const receipt = await client.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("La transacción fue revertida");

      setTxHash(hash);
      setStep("done");
      await refreshBalance(account);
      router.refresh(); // vuelve a leer el estado on-chain en el servidor
    } catch (e) {
      setError(readableError(e));
      setStep("idle");
    }
  }

  const busy = step === "approving" || step === "donating" || step === "minting";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={busy ? undefined : handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-surface lg:max-h-[86dvh] lg:max-w-md lg:rounded-3xl lg:shadow-2xl"
            >
              <div className="brand-grad px-5 pb-4 pt-5 text-on-brand">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="label text-on-brand/70">Aportar al proyecto</p>
                    <h2 className="display mt-1 text-2xl">{projectTitle}</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={busy}
                    className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-40"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {step === "done" ? (
                  <Success
                    amount={amount}
                    symbol={tokenSymbol}
                    txHash={txHash}
                    explorerBase={explorerBase}
                    onClose={handleClose}
                  />
                ) : !account ? (
                  <Connect onConnect={connect} connecting={step === "connecting"} />
                ) : step === "wrong-network" ? (
                  <WrongNetwork chainName={chainName} onSwitch={switchNetwork} />
                ) : (
                  <Form
                    amount={amount}
                    setAmount={setAmount}
                    balance={balance}
                    tokenSymbol={tokenSymbol}
                    tokenDecimals={tokenDecimals}
                    hasFaucet={hasFaucet}
                    onFaucet={claimFaucet}
                    onDonate={donate}
                    step={step}
                  />
                )}

                {error && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-danger-soft px-3 py-2.5 text-[13px] leading-relaxed text-danger">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------- Pasos -------------------------------- */

function Connect({ onConnect, connecting }: { onConnect: () => void; connecting: boolean }) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        <Wallet className="h-6 w-6 text-brand" />
      </span>
      <h3 className="mt-4 text-[17px] font-semibold">Conecta tu wallet</h3>
      <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-dim">
        El aporte va a un contrato que retiene el dinero hasta que el equipo
        entregue. Tú puedes verificar cada movimiento.
      </p>
      <Button onClick={onConnect} disabled={connecting} className="mt-6 w-full">
        {connecting ? "Conectando…" : "Conectar"}
      </Button>
    </div>
  );
}

function WrongNetwork({ chainName, onSwitch }: { chainName: string; onSwitch: () => void }) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
        <AlertTriangle className="h-6 w-6 text-accent" />
      </span>
      <h3 className="mt-4 text-[17px] font-semibold">Red equivocada</h3>
      <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-dim">
        Este proyecto recauda en {chainName}. Cambia de red para continuar.
      </p>
      <Button onClick={onSwitch} className="mt-6 w-full">
        Cambiar a {chainName}
      </Button>
    </div>
  );
}

function Form({
  amount,
  setAmount,
  balance,
  tokenSymbol,
  tokenDecimals,
  hasFaucet,
  onFaucet,
  onDonate,
  step,
}: {
  amount: string;
  setAmount: (v: string) => void;
  balance: bigint | null;
  tokenSymbol: string;
  tokenDecimals: number;
  hasFaucet: boolean;
  onFaucet: () => void;
  onDonate: () => void;
  step: Step;
}) {
  const noFunds = balance !== null && balance === 0n;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label">Cantidad</span>
        {balance !== null && (
          <span className="label">
            Tienes {formatAmount(balance, tokenDecimals)} {tokenSymbol}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="figure w-full bg-transparent py-3.5 text-2xl outline-none"
          placeholder="0"
        />
        <span className="label shrink-0">{tokenSymbol}</span>
      </div>

      <div className="mt-2.5 flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className={`figure min-h-[38px] flex-1 rounded-full border text-[14px] transition-colors ${
              amount === String(p)
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-dim hover:border-brand/50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {hasFaucet && (
        <button
          onClick={onFaucet}
          disabled={step === "minting"}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-dashed border-line px-3.5 py-3 text-left transition-colors hover:border-brand disabled:opacity-50"
        >
          <Droplet className="h-4 w-4 shrink-0 text-dim" />
          <span className="min-w-0 flex-1">
            <span className="block text-[14px]">
              {step === "minting" ? "Pidiendo monedas…" : `Consigue ${tokenSymbol} de prueba`}
            </span>
            <span className="label">1.000 gratis, una vez por hora</span>
          </span>
        </button>
      )}

      <div className="mt-5 rounded-xl bg-surface-2 px-3.5 py-3">
        <p className="text-[13px] leading-relaxed text-dim">
          El dinero queda retenido en el contrato. Se libera al equipo por
          tramos, solo cuando un hito se verifica. Si el proyecto se detiene,
          recuperas la parte que no se haya liberado.
        </p>
      </div>

      <Button
        onClick={onDonate}
        disabled={step === "approving" || step === "donating" || noFunds}
        className="mt-5 w-full"
      >
        {step === "approving"
          ? "Autorizando… firma en tu wallet"
          : step === "donating"
            ? "Enviando…"
            : noFunds
              ? `Sin ${tokenSymbol} en esta cuenta`
              : "Aportar"}
      </Button>

      {(step === "approving" || step === "donating") && (
        <p className="label mt-2.5 text-center leading-relaxed">
          {step === "approving"
            ? "Primera firma: autorizas al contrato a mover tus monedas"
            : "Segunda firma: se envía el aporte"}
        </p>
      )}
    </div>
  );
}

function Success({
  amount,
  symbol,
  txHash,
  explorerBase,
  onClose,
}: {
  amount: string;
  symbol: string;
  txHash: `0x${string}` | null;
  explorerBase: string | null;
  onClose: () => void;
}) {
  return (
    <div className="py-4 text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 260 }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft"
      >
        <Check className="h-7 w-7 text-brand" />
      </motion.span>
      <h3 className="display mt-4 text-2xl">Aporte registrado</h3>
      <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-dim">
        {amount} {symbol} quedaron en la tesorería del proyecto. El equipo no
        puede sacarlos hasta que se verifique un hito.
      </p>

      {txHash && explorerBase && (
        <a
          href={`${explorerBase}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer noopener"
          className="label mt-4 inline-flex items-center gap-1.5 text-brand hover:underline"
        >
          Ver la transacción
          <ExternalLink className="h-3 w-3" />
        </a>
      )}

      <Button onClick={onClose} variant="secondary" className="mt-6 w-full">
        Cerrar
      </Button>
    </div>
  );
}

/** Traduce los errores de wallet a algo que una persona pueda leer. */
function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/User rejected|User denied|rejected the request/i.test(message)) {
    return "Cancelaste la firma en tu wallet.";
  }
  if (/insufficient funds/i.test(message)) {
    return "No tienes suficiente ETH para pagar el gas de la transacción.";
  }
  if (/chain.*mismatch|does not match/i.test(message)) {
    return "Tu wallet está en otra red. Cambia de red y vuelve a intentarlo.";
  }

  // Deja la primera línea, que suele ser lo único legible del volcado.
  return message.split("\n")[0].slice(0, 200);
}
