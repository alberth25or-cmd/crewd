"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { Button, Card, Chip } from "@/components/ui";

/**
 * Postular a un rol.
 *
 * El acuerdo de compromiso se firma ANTES de ser aceptado, no después.
 * Es el filtro contra el abandono, no un trámite legal, así que sus
 * cláusulas están escritas en primera persona y en lenguaje llano — se
 * leen como una promesa, no como términos y condiciones.
 */
export function ApplyForm({
  projectTitle,
  projectSlug,
  leaderName,
  roleTitle,
  roleSkills,
  hoursPerWeek,
  totalWeeks,
  forNewcomers,
}: {
  projectTitle: string;
  projectSlug: string;
  leaderName: string;
  roleTitle: string;
  roleSkills: string[];
  hoursPerWeek: number;
  totalWeeks: number;
  forNewcomers: boolean;
}) {
  const [message, setMessage] = useState("");
  const [terms, setTerms] = useState([false, false, false]);
  const [sent, setSent] = useState(false);

  const allSigned = terms.every(Boolean);
  const canSend = allSigned && message.trim().length > 30;

  const CLAUSES = [
    `Me comprometo a ${hoursPerWeek} horas por semana durante unas ${totalWeeks} semanas.`,
    "Si no puedo seguir, aviso, documento lo que hice y entrego el avance. No desaparezco.",
    "Acepto ser evaluado al cierre de cada sprint, y evaluar a mi equipo y al líder.",
  ];

  if (sent) {
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
        <p className="label mt-5 text-brand">Postulación enviada</p>
        <h1 className="display mt-2 text-3xl">{roleTitle}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-dim">
          {leaderName} recibió tu mensaje junto con tu historial. Si no responde
          en siete días la postulación se cierra sola, y eso queda registrado del
          lado del líder — no del tuyo.
        </p>
        <Button
          href={`/proyectos/${projectSlug}`}
          variant="secondary"
          className="mt-7 w-full"
        >
          Volver al proyecto
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px] pb-28 lg:max-w-3xl lg:px-8 lg:pb-12 lg:pt-8">
      <header className="brand-grad px-4 pb-6 pt-4 text-on-brand lg:rounded-card lg:p-8">
        <Link
          href={`/proyectos/${projectSlug}`}
          className="label inline-flex items-center gap-1.5 text-on-brand/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {projectTitle}
        </Link>
        <p className="label mt-4 text-on-brand/75">Postular a un rol</p>
        <h1 className="display mt-1 text-4xl lg:text-5xl">{roleTitle}</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="figure rounded-full bg-white/15 px-3 py-1 text-[13px]">
            {hoursPerWeek}h por semana
          </span>
          {forNewcomers && (
            <span className="label rounded-full bg-white/15 px-3 py-1.5 text-on-brand">
              Cupo de arranque
            </span>
          )}
        </div>
      </header>

      <div className="space-y-7 px-4 py-6 lg:px-0 lg:py-8">
        <div className="flex flex-wrap gap-1.5">
          {roleSkills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <section>
          <h2 className="text-[17px] font-semibold">Por qué encajas</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-dim">
            No hace falta que vendas. Cuenta qué has hecho parecido a esto, o qué
            te hace pensar que puedes con ello.
          </p>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Trabajé dos años en paneles de monitoreo industrial. Lo que me interesa acá es que la lectura la va a mirar alguien que no es técnico…"
            className="mt-3 w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[15px] leading-relaxed outline-none transition-colors focus:border-brand placeholder:text-dim/60"
          />
          <p className="label mt-1.5">
            {message.trim().length} caracteres · mínimo 30
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            <h2 className="text-[17px] font-semibold">Acuerdo de compromiso</h2>
          </div>
          <p className="mt-1 text-[14px] leading-relaxed text-dim">
            Se firma antes de entrar, no después de que te acepten.
          </p>

          <Card className="mt-3 p-0">
            {CLAUSES.map((c, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-start gap-3 border-b border-line px-4 py-3.5 last:border-0"
              >
                <input
                  type="checkbox"
                  checked={terms[i]}
                  onChange={(e) =>
                    setTerms((p) => p.map((v, j) => (j === i ? e.target.checked : v)))
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                />
                <span className="text-[14px] leading-relaxed">{c}</span>
              </label>
            ))}
          </Card>

          <p className="mt-3 text-[13px] leading-relaxed text-dim">
            Retirarte avisando no daña tu reputación. Desaparecer sin responder,
            sí — es la única penalización severa del sistema.
          </p>
        </section>
      </div>

      {/* Fija sobre la barra inferior en móvil, en el flujo del documento
          en escritorio. */}
      <div className="fixed bottom-[73px] left-1/2 z-30 w-full max-w-[560px] -translate-x-1/2 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur-md lg:static lg:max-w-none lg:translate-x-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <Button
          disabled={!canSend}
          onClick={() => setSent(true)}
          className="w-full lg:w-auto lg:px-10"
        >
          Firmar y postular
        </Button>
      </div>
    </div>
  );
}
