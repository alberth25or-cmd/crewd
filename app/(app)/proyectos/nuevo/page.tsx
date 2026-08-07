"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Info, Plus, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";

/**
 * Crear proyecto.
 *
 * Cuatro pasos, ordenados para que la parte incómoda venga antes de
 * publicar: primero el roadmap, luego las horas de cada rol, y recién
 * al final el botón. El principio del documento es "mejor perder un
 * postulante que sumar a alguien que va a desaparecer", así que el
 * formulario empuja a ser específico sobre el compromiso en vez de
 * dejarlo en blanco.
 *
 * El paso 3 del prototipo previo pedía "nivel de compromiso: bajo /
 * medio / alto". Eso es ambiguo justo donde no puede serlo: aquí se
 * declaran horas por semana, que es el número que la persona firma.
 */

const STEPS = [
  { title: "La idea", hint: "Qué problema y para quién" },
  { title: "El roadmap", hint: "En qué se parte el trabajo" },
  { title: "Los roles", hint: "A quién necesitas y cuántas horas" },
  { title: "Revisión", hint: "Cómo lo lee un candidato" },
] as const;

const WHY = [
  "Los proyectos que describen qué es lo difícil reciben postulaciones de gente que ya pensó en el problema.",
  "Un roadmap con hitos verificables es lo que hace posible evaluar por sprint. Sin esto, la reputación no se puede construir.",
  "Declarar las horas antes de reclutar es el filtro más efectivo contra el abandono.",
  "Un candidato decide en menos de un minuto. Esto es exactamente lo que va a ver.",
];

const SDGS = [
  "Sin ODS específico",
  "01 · Fin de la pobreza",
  "03 · Salud y bienestar",
  "04 · Educación de calidad",
  "06 · Agua limpia y saneamiento",
  "07 · Energía asequible",
  "11 · Ciudades sostenibles",
  "13 · Acción por el clima",
];

interface SprintDraft {
  id: number;
  milestone: string;
  weeks: number;
}
interface RoleDraft {
  id: number;
  title: string;
  skills: string;
  hours: number;
  forNewcomers: boolean;
}

export default function NewProjectPage() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [sdg, setSdg] = useState(SDGS[0]);
  const [modality, setModality] = useState<"remoto" | "híbrido">("remoto");

  const [sprints, setSprints] = useState<SprintDraft[]>([
    { id: 1, milestone: "", weeks: 3 },
  ]);
  const [roles, setRoles] = useState<RoleDraft[]>([
    { id: 1, title: "", skills: "", hours: 6, forNewcomers: false },
  ]);

  const totalWeeks = sprints.reduce((s, x) => s + x.weeks, 0);
  const totalHours = roles.reduce((s, r) => s + r.hours, 0);
  const hasNewcomerSlot = roles.some((r) => r.forNewcomers);

  const canAdvance =
    step === 0
      ? title.trim().length > 2 &&
        summary.trim().length > 10 &&
        description.trim().length > 40
      : step === 1
        ? sprints.every((s) => s.milestone.trim().length > 5)
        : step === 2
          ? roles.every((r) => r.title.trim().length > 2 && r.hours > 0)
          : true;

  if (published) {
    return (
      <div className="mx-auto w-full max-w-[560px] px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14, stiffness: 260 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft"
        >
          <Check className="h-8 w-8 text-brand" />
        </motion.div>
        <p className="label mt-5 text-brand">Publicado</p>
        <h1 className="display mt-2 text-3xl">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-dim">
          Ya es visible. Las postulaciones te llegan con la reputación de cada
          candidato al lado del mensaje.
        </p>
        <div className="mt-7 space-y-2.5">
          <Button href="/proyectos" className="w-full">
            Ver proyectos
          </Button>
          <Button href="/inicio" variant="quiet" className="w-full">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px] pb-32 lg:max-w-3xl lg:px-8 lg:pb-12 lg:pt-8">
      <header className="px-4 pb-4 pt-5 lg:px-0 lg:pt-0">
        <h1 className="display text-3xl lg:text-5xl">Nuevo proyecto</h1>
        <p className="mt-1 text-[14px] text-dim lg:text-[16px]">
          {STEPS[step].hint}
        </p>
      </header>

      {/* Indicador de pasos */}
      <div className="sticky top-[57px] z-30 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-md lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:py-4 lg:backdrop-blur-none">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className="flex-1 text-left disabled:cursor-not-allowed"
            >
              <span
                className={`block h-1 rounded-full transition-colors ${
                  i <= step ? "bg-brand" : "bg-surface-2"
                }`}
              />
              <span
                className={`label mt-1.5 block truncate ${
                  i === step ? "text-brand" : ""
                }`}
              >
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 lg:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {/* ---------- 01 ---------- */}
            {step === 0 && (
              <div className="space-y-5">
                <Field label="Título" hint="Corto y concreto. Nada de nombres en clave.">
                  <input
                    className={inputCls}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bitácora Docente"
                  />
                </Field>

                <Field
                  label="En una frase"
                  hint="Lo primero que se lee en el listado. Di qué hace, no por qué importa."
                >
                  <input
                    className={inputCls}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Registrar asistencia escolar sin conexión."
                  />
                </Field>

                <Field
                  label="El problema y el plan"
                  hint="Qué está roto hoy, qué vas a construir y qué es lo difícil."
                >
                  <textarea
                    rows={7}
                    className={`${inputCls} resize-none leading-relaxed`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Los profesores rurales llevan la asistencia en cuadernos que se pierden…"
                  />
                  <p className="label mt-1.5">
                    {description.trim().length} caracteres · mínimo 40
                  </p>
                </Field>

                <Field label="Área">
                  <input
                    className={inputCls}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Software · Educación"
                  />
                </Field>

                <Field label="Modalidad">
                  <div className="flex gap-2">
                    {(["remoto", "híbrido"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setModality(m)}
                        className={`min-h-[44px] flex-1 rounded-xl border text-[14px] capitalize transition-colors ${
                          modality === m
                            ? "border-brand bg-brand-soft text-brand"
                            : "border-line text-dim"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="ODS" hint="Opcional.">
                  <select
                    className={inputCls}
                    value={sdg}
                    onChange={(e) => setSdg(e.target.value)}
                  >
                    {SDGS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            {/* ---------- 02 ---------- */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-[14px] leading-relaxed text-dim">
                  Parte el trabajo en sprints con un hito verificable cada uno.
                  Un hito es algo que se puede mirar y decir si está o no está.
                </p>

                {sprints.map((s, i) => (
                  <Card key={s.id}>
                    <div className="flex items-baseline justify-between">
                      <span className="label">
                        Sprint {String(i + 1).padStart(2, "0")}
                      </span>
                      {sprints.length > 1 && (
                        <button
                          onClick={() =>
                            setSprints((p) => p.filter((x) => x.id !== s.id))
                          }
                          className="text-dim hover:text-danger"
                          aria-label="Quitar sprint"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <input
                      className={`${inputCls} mt-2`}
                      value={s.milestone}
                      onChange={(e) =>
                        setSprints((p) =>
                          p.map((x) =>
                            x.id === s.id ? { ...x, milestone: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Prototipo validado con tres profesores"
                    />
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="label shrink-0">Duración</span>
                      {[2, 3, 4].map((w) => (
                        <button
                          key={w}
                          onClick={() =>
                            setSprints((p) =>
                              p.map((x) => (x.id === s.id ? { ...x, weeks: w } : x))
                            )
                          }
                          className={`label min-h-[32px] flex-1 rounded-full border transition-colors ${
                            s.weeks === w
                              ? "border-brand bg-brand-soft text-brand"
                              : "border-line"
                          }`}
                        >
                          {w} sem
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}

                <button
                  onClick={() =>
                    setSprints((p) => [
                      ...p,
                      { id: Date.now(), milestone: "", weeks: 3 },
                    ])
                  }
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-card border border-dashed border-line text-[14px] text-dim transition-colors hover:border-brand hover:text-brand"
                >
                  <Plus className="h-4 w-4" />
                  Añadir sprint
                </button>

                <p className="label text-center">
                  {sprints.length} sprints · {totalWeeks} semanas
                </p>

                {totalWeeks > 24 && (
                  <Note>
                    {totalWeeks} semanas es mucho para un primer proyecto. Los
                    que pasan de seis meses casi nunca llegan al final con el
                    equipo original. Considera recortar y abrir una segunda
                    etapa después.
                  </Note>
                )}
              </div>
            )}

            {/* ---------- 03 ---------- */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-[14px] leading-relaxed text-dim">
                  Cada rol declara cuántas horas por semana espera. Ese número es
                  lo que la persona firma al postular, así que ponlo real.
                </p>

                {roles.map((r, i) => (
                  <Card key={r.id}>
                    <div className="flex items-baseline justify-between">
                      <span className="label">
                        Rol {String(i + 1).padStart(2, "0")}
                      </span>
                      {roles.length > 1 && (
                        <button
                          onClick={() =>
                            setRoles((p) => p.filter((x) => x.id !== r.id))
                          }
                          className="text-dim hover:text-danger"
                          aria-label="Quitar rol"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <input
                      className={`${inputCls} mt-2`}
                      value={r.title}
                      onChange={(e) =>
                        setRoles((p) =>
                          p.map((x) =>
                            x.id === r.id ? { ...x, title: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Desarrollo móvil"
                    />
                    <input
                      className={`${inputCls} mt-2`}
                      value={r.skills}
                      onChange={(e) =>
                        setRoles((p) =>
                          p.map((x) =>
                            x.id === r.id ? { ...x, skills: e.target.value } : x
                          )
                        )
                      }
                      placeholder="React Native, SQLite"
                    />

                    <div className="mt-3">
                      <p className="label">Horas por semana</p>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="range"
                          min={1}
                          max={20}
                          value={r.hours}
                          onChange={(e) =>
                            setRoles((p) =>
                              p.map((x) =>
                                x.id === r.id
                                  ? { ...x, hours: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          className="h-1.5 flex-1 accent-[var(--brand)]"
                        />
                        <span className="figure w-12 shrink-0 text-right text-xl font-semibold">
                          {r.hours}h
                        </span>
                      </div>
                    </div>

                    <label className="mt-3 flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={r.forNewcomers}
                        onChange={(e) =>
                          setRoles((p) =>
                            p.map((x) =>
                              x.id === r.id
                                ? { ...x, forNewcomers: e.target.checked }
                                : x
                            )
                          )
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                      />
                      <span className="text-[13px] leading-relaxed">
                        Reservar este cupo para gente sin historial
                      </span>
                    </label>
                  </Card>
                ))}

                <button
                  onClick={() =>
                    setRoles((p) => [
                      ...p,
                      {
                        id: Date.now(),
                        title: "",
                        skills: "",
                        hours: 6,
                        forNewcomers: false,
                      },
                    ])
                  }
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-card border border-dashed border-line text-[14px] text-dim transition-colors hover:border-brand hover:text-brand"
                >
                  <Plus className="h-4 w-4" />
                  Añadir rol
                </button>

                <p className="label text-center">
                  {roles.length} roles · {totalHours}h semanales en total
                </p>

                {!hasNewcomerSlot && (
                  <Note>
                    No reservaste ningún cupo de arranque. Es opcional, pero es
                    la vía por la que entra gente sin reputación todavía —
                    incluido quien podría ser tu mejor colaborador.
                  </Note>
                )}
              </div>
            )}

            {/* ---------- 04 ---------- */}
            {step === 3 && (
              <div className="space-y-5">
                <Card>
                  <p className="label">Así lo ve un candidato</p>
                  <h2 className="display mt-2 text-2xl">{title || "Sin título"}</h2>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-dim">
                    {summary || "Sin descripción"}
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[
                      ["Sprints", String(sprints.length)],
                      ["Semanas", String(totalWeeks)],
                      ["Roles", String(roles.length)],
                      ["h/sem", String(totalHours)],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-xl bg-surface-2 px-1 py-2 text-center"
                      >
                        <p className="figure text-[17px] font-semibold">{v}</p>
                        <p className="label mt-0.5">{k}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div>
                  <p className="label mb-2.5">Lo que firmas como líder</p>
                  <Card className="p-0">
                    {[
                      "Cerrar cada sprint con una evaluación al equipo, aunque haya salido mal.",
                      "Responder a las postulaciones. Dejar a alguien esperando cuenta como ghosting del líder.",
                      "Avisar al equipo si el proyecto se detiene, en lugar de dejarlo morir en silencio.",
                      "Ser evaluado por tu equipo en los mismos dos ejes que ellos.",
                    ].map((t) => (
                      <div
                        key={t}
                        className="flex gap-2.5 border-b border-line px-4 py-3 last:border-0"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span className="text-[14px] leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </Card>
                </div>

                <Note>
                  Buena parte del abandono lo causa el liderazgo, no la flojera
                  del equipo. Por eso el líder también se evalúa.
                </Note>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Por qué preguntamos esto */}
        <div className="mt-6 flex gap-2.5 rounded-card bg-surface-2 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-dim" />
          <p className="text-[13px] leading-relaxed text-dim">{WHY[step]}</p>
        </div>
      </div>

      {/* Navegación. Fija sobre la barra inferior en móvil, en el flujo
          del documento en escritorio. */}
      <div className="fixed bottom-[73px] left-1/2 z-30 w-full max-w-[560px] -translate-x-1/2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur-md lg:static lg:max-w-none lg:translate-x-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <div className="flex items-center gap-3">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>
          ) : (
            <Link href="/inicio" className="label px-2 text-dim">
              Cancelar
            </Link>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              disabled={!canAdvance}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setPublished(true)} className="flex-1">
              Publicar proyecto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full min-h-[46px] rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-brand placeholder:text-dim/60";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {hint && (
        <span className="mt-1 block text-[13px] leading-relaxed text-dim">
          {hint}
        </span>
      )}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card border-l-2 border-accent bg-accent-soft py-2.5 pl-3.5 pr-3 text-[13px] leading-relaxed text-dim">
      {children}
    </p>
  );
}
