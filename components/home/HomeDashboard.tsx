"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Flame, Clock, ArrowRight } from "lucide-react";
import {
  projects,
  users,
  trajectories,
  microChallenges,
  getUserById,
} from "@/lib/data";
import type { ChainInfo, FundingSummary } from "@/lib/chain/read";
import { EvaluationModal } from "@/components/EvaluationModal";
import { FundingBadge } from "@/components/funding/FundingBadge";
import { SupportButton } from "@/components/funding/SupportButton";
import {
  Avatar,
  Button,
  Card,
  Chip,
  SectionHead,
  StatusMark,
} from "@/components/ui";

/**
 * Panel de inicio.
 *
 * Estructura heredada del prototipo móvil: cabecera con degradado,
 * tarjeta de progreso, cuadrícula de estadísticas, secciones de
 * tarjetas. En escritorio la misma información se reparte en dos
 * columnas en vez de estirarse.
 *
 * Lo que cambia respecto al prototipo es qué se cuenta. Antes: nivel 8,
 * 850/1000 XP, racha de 15 días conectado, "invita a un amigo +100".
 * Todo eso premia entrar. Ahora todo lo que aparece aquí es un cierre —
 * sprints entregados, proyectos terminados, racha de entregas a tiempo.
 *
 * Es de cliente por el modal de evaluación, así que el estado de las
 * tesorerías llega como props desde la página, que sí es de servidor.
 */

const ME = "u1";

export function HomeDashboard({
  funding,
  chain,
}: {
  funding: Record<string, FundingSummary>;
  chain: ChainInfo | null;
}) {
  const [evaluating, setEvaluating] = useState(false);

  const me = users.find((u) => u.id === ME)!;
  const traj = trajectories[ME];
  const active = projects.find((p) => p.id === "p1")!;
  const closed = active.sprints.filter((s) => s.status === "cerrado").length;
  const pct = Math.round((closed / active.sprints.length) * 100);

  const teamToEvaluate = active.members
    .filter((m) => m.userId !== ME)
    .map((m) => {
      const u = getUserById(m.userId)!;
      return { id: u.id, name: u.name, role: m.roleTitle };
    });

  const builders = [...users]
    .filter((u) => u.completionRate !== null && u.reputation.count > 0)
    .sort((a, b) => (b.completionRate ?? 0) - (a.completionRate ?? 0))
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto w-full max-w-[560px] lg:max-w-6xl lg:px-8 lg:pt-8">
        {/* Cabecera */}
        <section className="brand-grad px-4 pb-6 pt-5 text-on-brand lg:rounded-card lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:flex lg:items-end lg:justify-between lg:gap-10"
          >
            <div className="lg:flex-1">
              <h1 className="display text-3xl lg:text-5xl">
                Hola, {me.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-[14px] text-on-brand/80 lg:text-[16px]">
                Te quedan 2 hitos para cerrar el sprint 4
              </p>

              {/* Progreso hacia la finalización — no una barra de XP. */}
              <div className="mt-5 rounded-card bg-white/12 p-4 backdrop-blur-sm lg:max-w-md">
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-semibold">{active.title}</span>
                  <span className="figure text-[13px] text-on-brand/85">
                    {closed} / {active.sprints.length} sprints
                  </span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/25">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-2 text-[12px] text-on-brand/75">
                  Terminar es la única métrica que cuenta
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5 lg:mt-0 lg:w-[380px] lg:shrink-0">
              {[
                { v: traj.projectsCompleted, l: "Terminados" },
                { v: traj.sprintsClosed, l: "Sprints cerrados" },
                { v: traj.onTimeStreak, l: "Racha a tiempo", flame: true },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  className="rounded-card bg-white/12 px-2 py-2.5 text-center backdrop-blur-sm lg:py-4"
                >
                  <p className="figure flex items-center justify-center gap-1 text-2xl font-semibold lg:text-3xl">
                    {s.flame && <Flame className="h-4 w-4 lg:h-5 lg:w-5" />}
                    {s.v}
                  </p>
                  <p className="label mt-0.5 text-on-brand/70">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Cuerpo */}
        <div className="px-4 py-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-0 lg:py-8">
          <div className="space-y-8">
            {/* El cierre de sprint es el latido del producto, así que va
                primero y no escondido en un botón flotante. */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => setEvaluating(true)}
              className="card flex w-full items-center gap-3.5 border-accent/40 bg-accent-soft p-4 text-left transition-transform active:scale-[0.99] lg:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Clock className="h-5 w-5 text-accent" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold lg:text-[17px]">
                  Cierra el sprint 04
                </span>
                <span className="label mt-0.5 block">
                  Evalúa a 2 compañeros · vence en 3 días
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-dim" />
            </motion.button>

            {/* Proyectos */}
            <section>
              <SectionHead title="Proyectos abiertos" href="/proyectos" />
              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {projects.slice(0, 4).map((p, i) => {
                  const leader = getUserById(p.leaderId)!;
                  const open = p.roles.filter((r) => r.status === "abierto").length;
                  const money = funding[p.slug];
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                      className="h-full"
                    >
                      {/* El enlace envuelve solo el contenido; el botón de
                          apoyo queda fuera, porque un <button> dentro de un
                          <a> es HTML inválido. */}
                      <div className="card flex h-full flex-col p-4 transition-colors hover:border-brand/50">
                      <Link
                        href={`/proyectos/${p.slug}`}
                        className="flex flex-1 flex-col"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <StatusMark status={p.status} />
                          {p.sdg && <span className="label">ODS {p.sdg.number}</span>}
                        </div>

                        <h3 className="display mt-3 text-2xl">{p.title}</h3>
                        <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-dim">
                          {p.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.roles
                            .filter((r) => r.status === "abierto")
                            .slice(0, 2)
                            .map((r) => (
                              <Chip key={r.id}>
                                {r.title} · {r.hoursPerWeek}h
                              </Chip>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                          <span className="flex min-w-0 items-center gap-2">
                            <Avatar name={leader.name} size={26} />
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-medium">
                                {leader.name}
                              </span>
                              <span className="label">{leader.location}</span>
                            </span>
                          </span>
                          <span className="label shrink-0 text-brand">
                            {open} {open === 1 ? "rol" : "roles"} →
                          </span>
                        </div>
                      </Link>

                      {money && (
                        <>
                          <FundingBadge summary={money} />
                          {chain && (
                            <div className="mt-3">
                              <SupportButton
                                summary={money}
                                chain={chain}
                                projectTitle={p.title}
                                size="sm"
                              />
                            </div>
                          )}
                        </>
                      )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <Button href="/proyectos" variant="secondary" className="w-full lg:hidden">
              Explorar todos los proyectos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Columna lateral en escritorio, secciones apiladas en móvil */}
          <aside className="mt-8 space-y-8 lg:mt-0 lg:sticky lg:top-8 lg:self-start">
            {/* Micro-retos. Reemplazan los "retos rápidos" de actividad
                ("invita a un amigo") por encargos con entregable real,
                que es como el documento resuelve el cold start. */}
            <section>
              <SectionHead title="Micro-retos" href="/retos" />
              <div className="space-y-2.5">
                {microChallenges.slice(0, 3).map((mc) => (
                  <Link
                    key={mc.id}
                    href="/retos"
                    className="card flex items-center gap-3 p-3.5 transition-colors hover:border-brand/50"
                  >
                    <span className="figure flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <span className="text-[15px] font-semibold leading-none">
                        {mc.hours}
                      </span>
                      <span className="text-[9px] leading-none">hrs</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">
                        {mc.title}
                      </span>
                      <span className="label mt-0.5 block">
                        {mc.projectTitle} · {mc.slots - mc.takenBy} cupos
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-dim" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Reemplaza el "Top Líderes por puntos" y el ranking de
                universidades peruanas. Ordena por tasa de finalización,
                que es la métrica norte, y muestra ciudades porque el
                producto es global desde el día uno. */}
            <section>
              <SectionHead title="Constructores que terminan" />
              <Card className="p-0">
                {builders.map((u, i) => {
                  const t = trajectories[u.id];
                  return (
                    <Link
                      key={u.id}
                      href={`/u/${u.handle}`}
                      className="flex items-center gap-3 border-b border-line px-4 py-3 transition-colors last:border-0 hover:bg-surface-2"
                    >
                      <span className="figure w-4 shrink-0 text-[13px] text-dim">
                        {i + 1}
                      </span>
                      <Avatar name={u.name} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium">
                          {u.name}
                        </span>
                        <span className="label">{u.location}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="figure block text-[15px] font-semibold text-brand">
                          {Math.round((u.completionRate ?? 0) * 100)}%
                        </span>
                        <span className="label">
                          {t.projectsCompleted}/{t.projectsJoined} terminados
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </Card>
              <p className="label mt-2.5 leading-relaxed">
                Ordenado por proyectos terminados, no por puntos acumulados
              </p>
            </section>
          </aside>
        </div>
      </div>

      <EvaluationModal
        open={evaluating}
        onClose={() => setEvaluating(false)}
        projectName={active.title}
        sprintNumber={4}
        members={teamToEvaluate}
      />
    </>
  );
}
