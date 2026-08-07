"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Check } from "lucide-react";
import { Avatar, Button } from "./ui";

/**
 * Evaluación de cierre de sprint — a ciegas.
 *
 * Reemplaza el modal de calificación del prototipo previo, que pedía
 * cinco estrellas sobre cinco categorías y las promediaba a un 5.0.
 * Tres cosas cambian, y las tres son reglas del documento:
 *
 *  1. Dos ejes, no cinco categorías promediadas. Confiabilidad y
 *     habilidad son independientes por diseño y no pueden colapsar.
 *  2. Sin estrellas. Una estrella empuja a dar cinco por cortesía; una
 *     escala con los extremos nombrados obliga a elegir un punto.
 *  3. Sellado. Nada se revela hasta que ambas partes evaluaron o vence
 *     el plazo, que es lo que elimina represalias y reciprocidad.
 */

interface Member {
  id: string;
  name: string;
  role: string;
}

const AXES = [
  {
    id: "reliability" as const,
    label: "Confiabilidad",
    question: "¿Cumplió con lo que se comprometió en este sprint?",
    low: "No entregó ni avisó",
    high: "Entregó todo a tiempo",
  },
  {
    id: "skill" as const,
    label: "Habilidad",
    question: "¿Qué tal la calidad de lo que entregó?",
    low: "Hubo que rehacerlo",
    high: "Mejor de lo esperado",
  },
];

export function EvaluationModal({
  open,
  onClose,
  projectName,
  sprintNumber,
  members,
}: {
  open: boolean;
  onClose: () => void;
  projectName: string;
  sprintNumber: number;
  members: Member[];
}) {
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const member = members[index];
  const key = (axis: string) => `${member?.id}-${axis}`;
  const scored = AXES.every((a) => scores[key(a.id)] > 0);

  const reset = () => {
    setIndex(0);
    setScores({});
    setComments({});
    setDone(false);
  };

  const next = () => {
    if (index < members.length - 1) setIndex((i) => i + 1);
    else setDone(true);
  };

  const close = () => {
    onClose();
    setTimeout(reset, 250);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Hoja inferior en móvil, diálogo centrado en escritorio. La
              animación es la misma (sube y aparece) porque funciona en
              ambas formas sin pelearse con el centrado por transform. */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            className="pointer-events-auto flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-surface lg:max-h-[86dvh] lg:max-w-lg lg:rounded-3xl lg:shadow-2xl"
          >
            {done ? (
              <SealedConfirmation onClose={close} count={members.length} />
            ) : (
              <>
                {/* Cabecera */}
                <div className="brand-grad px-5 pb-4 pt-5 text-on-brand lg:px-6 lg:pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="label text-on-brand/70">
                        Cierre de sprint {String(sprintNumber).padStart(2, "0")}
                      </p>
                      <h2 className="display mt-1 text-2xl">Evalúa a tu equipo</h2>
                      <p className="mt-0.5 text-[13px] text-on-brand/80">{projectName}</p>
                    </div>
                    <button
                      onClick={close}
                      className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-1.5">
                    {members.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= index ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="flex items-center gap-3 border-b border-line pb-4">
                        <Avatar name={member.name} size={44} />
                        <div>
                          <h3 className="text-[17px] font-semibold">{member.name}</h3>
                          <p className="label mt-0.5">{member.role}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-7">
                        {AXES.map((axis) => (
                          <div key={axis.id}>
                            <p className="text-[15px] font-medium">{axis.question}</p>
                            <div className="mt-3 flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((v) => {
                                const active = scores[key(axis.id)] === v;
                                return (
                                  <button
                                    key={v}
                                    onClick={() =>
                                      setScores((p) => ({ ...p, [key(axis.id)]: v }))
                                    }
                                    aria-label={`${axis.label}: ${v} de 5`}
                                    className={`figure h-12 flex-1 rounded-xl border text-[15px] font-semibold transition-all active:scale-95 ${
                                      active
                                        ? "border-transparent brand-grad text-on-brand"
                                        : "border-line bg-surface-2 text-dim hover:border-brand/50"
                                    }`}
                                  >
                                    {v}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="mt-1.5 flex justify-between">
                              <span className="label">{axis.low}</span>
                              <span className="label text-right">{axis.high}</span>
                            </div>
                          </div>
                        ))}

                        <div>
                          <p className="text-[15px] font-medium">
                            Comentario{" "}
                            <span className="text-dim font-normal">(opcional)</span>
                          </p>
                          <textarea
                            rows={3}
                            value={comments[member.id] ?? ""}
                            onChange={(e) =>
                              setComments((p) => ({ ...p, [member.id]: e.target.value }))
                            }
                            placeholder="Lo que le dirías en persona. Se revela junto con la nota."
                            className="mt-2 w-full resize-none rounded-xl border border-line bg-surface-2 px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-brand placeholder:text-dim/70"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pie */}
                <div className="border-t border-line px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 shrink-0 text-dim" />
                    <p className="label leading-relaxed">
                      Se revela cuando ambos evalúen o venza el plazo
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="label shrink-0">
                      {index + 1} / {members.length}
                    </span>
                    <Button
                      onClick={next}
                      disabled={!scored}
                      className="flex-1"
                    >
                      {index < members.length - 1 ? "Siguiente" : "Sellar evaluación"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/** El sellado es el momento que enseña la regla. Si esto fuera un
 *  "¡Gracias! 🎉" se perdería la única oportunidad de explicar por qué
 *  la evaluación no se ve todavía. */
function SealedConfirmation({
  onClose,
  count,
}: {
  onClose: () => void;
  count: number;
}) {
  return (
    <div className="px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 260 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft"
      >
        <Lock className="h-7 w-7 text-brand" />
      </motion.div>

      <h2 className="display mt-5 text-2xl">Sellado</h2>
      <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-dim">
        Evaluaste a {count} {count === 1 ? "compañero" : "compañeros"}. Nadie ve
        nada todavía — ni tú lo que te pusieron, ni ellos lo que pusiste tú.
      </p>

      <div className="mt-6 space-y-2.5 text-left">
        {[
          "Se revela cuando la otra persona también evalúe",
          "O automáticamente en 7 días, evalúe o no",
          "Nadie puede cambiar su nota después de ver la tuya",
        ].map((t) => (
          <div key={t} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span className="text-[14px] text-dim">{t}</span>
          </div>
        ))}
      </div>

      <Button onClick={onClose} className="mt-7 w-full">
        Entendido
      </Button>
    </div>
  );
}
