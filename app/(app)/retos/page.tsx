"use client";

import { motion } from "motion/react";
import { Clock, Package, Users } from "lucide-react";
import { microChallenges, trajectories } from "@/lib/data";
import { Button, Card, Chip, SectionHead } from "@/components/ui";

/**
 * Micro-retos.
 *
 * Esta pantalla reemplaza los "Retos y Voluntariados" del prototipo
 * previo, que ofrecía "invita a un amigo +150 XP", "completa tu perfil
 * +50 XP" y una racha de días conectado. Eso premia usar la app.
 *
 * El documento define los micro-retos con otro propósito: son la vía
 * de cold start. Encargos cortos con entregable verificable que otorgan
 * reputación inicial real, evaluados igual que un sprint. Por eso cada
 * tarjeta muestra qué hay que entregar, no cuántos puntos da.
 */

const ME = "u1";

export default function RetosPage() {
  const traj = trajectories[ME];
  const streakGoal = 10;

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-5 lg:max-w-6xl lg:px-8 lg:py-8">
      <h1 className="display text-3xl lg:text-5xl">Micro-retos</h1>
      <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-dim lg:text-[16px]">
        Encargos cortos con entregable real. Se evalúan igual que un sprint y
        cuentan como reputación.
      </p>

      {/* Racha. Mide entregas a tiempo, no días conectado: se rompe por
          no entregar, nunca por no abrir la aplicación. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="brand-grad mt-5 rounded-card p-4 text-on-brand lg:p-6"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">Racha de entregas</span>
          <span className="figure text-[13px] text-on-brand/85">
            {traj.onTimeStreak} / {streakGoal}
          </span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: streakGoal }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0.3, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className={`h-7 flex-1 rounded ${
                i < traj.onTimeStreak ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-on-brand/80">
          {traj.onTimeStreak} sprints seguidos entregados a tiempo. Tu mejor
          racha fue de {traj.bestStreak}. Se rompe por no entregar, no por no
          conectarte.
        </p>
      </motion.div>

      <div className="lg:mt-8 lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-x-10">
      {/* Disponibles */}
      <section className="mt-8 lg:mt-0">
        <SectionHead
          title="Disponibles"
          aside={<span className="label">{microChallenges.length} abiertos</span>}
        />
        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 lg:grid-cols-1 xl:grid-cols-2">
          {microChallenges.map((mc, i) => {
            const left = mc.slots - mc.takenBy;
            const full = left === 0;
            return (
              <motion.div
                key={mc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="h-full"
              >
                <Card className="flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    <span className="figure flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <span className="text-[16px] font-semibold leading-none">
                        {mc.hours}
                      </span>
                      <span className="text-[9px] leading-none">horas</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold leading-snug">
                        {mc.title}
                      </h3>
                      <p className="label mt-1">{mc.projectTitle}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[14px] leading-relaxed text-dim">
                    {mc.description}
                  </p>

                  {/* El entregable es lo que hace que esto sea un reto y
                      no un señuelo de interacción. */}
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-surface-2 px-3 py-2.5">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-dim" />
                    <div className="min-w-0">
                      <p className="label">Qué se entrega</p>
                      <p className="mt-0.5 text-[13px]">{mc.deliverable}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mc.skills.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-dim" />
                      <span className="label">
                        {full ? "Cupos llenos" : `${left} de ${mc.slots} cupos`}
                      </span>
                    </span>
                    <Button size="sm" disabled={full}>
                      {full ? "Sin cupo" : "Tomar el reto"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Marcas de trayectoria. Reemplazan los badges desbloqueables por
          actividad: cada una corresponde a un cierre real. */}
      <section className="mt-8 lg:mt-0 lg:sticky lg:top-8">
        <SectionHead title="Marcas de trayectoria" />
        <Card className="p-0">
          {traj.marks.map((m) => (
            <div
              key={m.id}
              className="flex items-start gap-3 border-b border-line px-4 py-3.5 last:border-0"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.unlocked ? "bg-brand-soft text-brand" : "bg-surface-2 text-dim"
                }`}
              >
                {m.unlocked ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <span className="label">?</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-medium ${
                    m.unlocked ? "" : "text-dim"
                  }`}
                >
                  {m.label}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-dim">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </Card>
        <p className="label mt-2.5 leading-relaxed">
          Cada marca corresponde a algo terminado, no a actividad acumulada
        </p>
      </section>
      </div>
    </div>
  );
}
