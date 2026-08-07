import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Scale,
  LogOut,
  FileSignature,
  Globe,
  Timer,
  HandCoins,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { users, trajectories, projects } from "@/lib/data";
import { getFundingSummaries } from "@/lib/chain/read";
import { HeroField } from "@/components/marketing/HeroField";
import { Reveal } from "@/components/marketing/Reveal";
import { FundingBadge } from "@/components/funding/FundingBadge";
import { Avatar, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Crewd — Encuentra tu equipo. Termina lo que empiezas.",
  description:
    "Propón un proyecto real, recluta el equipo que necesitas y llévalo hasta el final. Cada sprint que cierras deja una reputación verificable que es tuya.",
};

const WALLS = [
  {
    n: "01",
    title: "No encuentran equipo",
    body: "Los amigos dicen que sí y desaparecen a la semana. No hay ningún lugar donde encontrar gente que vaya en serio.",
  },
  {
    n: "02",
    title: "Los proyectos se desintegran",
    body: "De cinco integrantes, dos abandonan y tres terminan cargando todo. Es el patrón más repetido y el más destructivo.",
  },
  {
    n: "03",
    title: "Nada queda registrado",
    body: "Terminaron un proyecto, ¿y? No hay evidencia que alguien de fuera pueda verificar. Piden experiencia para dar experiencia.",
  },
];

const CYCLE = [
  { t: "Sprint de 2 a 3 semanas", d: "Con hitos y entregables definidos desde el inicio." },
  { t: "Cierre del sprint", d: "Se revisa qué se entregó y qué no. Sin adornos." },
  { t: "Evaluación cruzada a ciegas", d: "Todos evalúan a todos. Nadie ve nada hasta que ambos lo hicieron." },
  { t: "Se actualiza la reputación", d: "Confiabilidad y habilidad se mueven por separado." },
];

const RULES = [
  {
    icon: Timer,
    title: "La reputación se gana durante, no al final",
    body: "Se evalúa por sprint. El que abandona en la semana 4 deja registro; no espera al final para que nadie se entere.",
  },
  {
    icon: Scale,
    title: "El líder también es evaluado",
    body: "Buena parte del abandono lo causa el mal liderazgo, no la flojera del equipo. Quien lidera recibe las mismas dos notas que da.",
  },
  {
    icon: Lock,
    title: "Evaluación sellada",
    body: "Las notas se revelan solo cuando ambas partes evaluaron, o cuando vence el plazo. Elimina represalias y el cinco por cortesía.",
  },
  {
    icon: LogOut,
    title: "Salir bien no se castiga",
    body: "Retirarte avisando, documentando y entregando el avance no te resta nada. Desaparecer sin responder sí, y es la única penalización severa.",
  },
  {
    icon: FileSignature,
    title: "Compromiso explícito antes de entrar",
    body: "Horas por semana, duración y entregables se firman al postular. Mejor perder un postulante que sumar a alguien que va a desaparecer.",
  },
  {
    icon: Globe,
    title: "Global desde el día uno",
    body: "Equipos de varios países, no solo de varias disciplinas. El talento sobra donde la oportunidad local es el techo.",
  },
];

const SUPPORT_STEPS = [
  {
    icon: HandCoins,
    title: "Aportas lo que quieras",
    body: "El dinero no va al líder. Entra a un contrato que lo retiene, y cualquiera puede comprobar el saldo en cualquier momento.",
  },
  {
    icon: ShieldCheck,
    title: "Se libera por tramos, contra entregas",
    body: "El equipo presenta la evidencia de un hito y un verificador la aprueba. Recién ahí se suelta una parte. Nadie puede vaciar la caja.",
  },
  {
    icon: Undo2,
    title: "Si el proyecto muere, recuperas lo tuyo",
    body: "Lo que no se llegó a liberar vuelve a quien aportó, en proporción exacta a lo que puso cada uno.",
  },
];

export default async function LandingPage() {
  const funding = await getFundingSummaries(projects.map((p) => p.slug));
  const fundable = projects.filter((p) => funding[p.slug]).slice(0, 3);

  const builders = [...users]
    .filter((u) => u.completionRate !== null && u.reputation.count > 0)
    .sort((a, b) => (b.completionRate ?? 0) - (a.completionRate ?? 0));

  const countries = new Set(users.map((u) => u.location.split(", ")[1])).size;
  const totalEvals = users.reduce((s, u) => s + u.reputation.count, 0);

  return (
    <>
      {/* ---------------------------------- Héroe --------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-24">
        <div className="lg:grid lg:grid-cols-[1fr_420px] lg:items-center lg:gap-16">
          <Reveal>
            <p className="label">
              Para quien tiene la capacidad y no la evidencia
            </p>

            <h1 className="display mt-5 text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl">
              Encuentra tu equipo.
              <br />
              Termina lo que empiezas.
              <br />
              <span className="text-brand">Que quede probado.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-dim lg:text-[18px]">
              Propón un proyecto real, recluta a quien necesitas y llévalo hasta
              el final. Cada sprint que cierras deja una reputación verificable
              — y esa reputación es tuya, no de la plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/proyectos"
                className="brand-grad flex min-h-[50px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium text-on-brand shadow-lg shadow-brand/25 transition-transform active:scale-[0.98]"
              >
                Buscar un proyecto
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/proyectos/nuevo"
                className="flex min-h-[50px] items-center justify-center rounded-full border border-line px-7 text-[15px] font-medium transition-colors hover:border-brand hover:text-brand"
              >
                Publicar el mío
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                [String(projects.length), "proyectos abiertos"],
                [String(countries), "países representados"],
                [String(totalEvals), "evaluaciones registradas"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="figure text-2xl font-semibold">{v}</dt>
                  <dd className="label mt-0.5">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* El elemento firma: la tesis del producto en una imagen. */}
          <Reveal delay={0.15} className="mt-12 lg:mt-0">
            <HeroField />
            <p className="mt-4 text-center text-[14px] leading-relaxed text-dim">
              Un solo número dice que son casi iguales. La forma dice que
              necesitas a uno para que entregue a tiempo y al otro para que
              quede bien hecho.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- Problema -------------------------------- */}
      <section id="problema" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="label">El problema</p>
            <h2 className="display mt-4 max-w-2xl text-4xl lg:text-5xl">
              Hay muchísima gente con habilidades reales y ninguna forma de
              demostrarlas.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-dim">
              Su portafolio son trabajos de curso. Cuando intentan resolverlo
              por su cuenta, chocan siempre contra los mismos tres muros.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
            {WALLS.map((w, i) => (
              <Reveal key={w.n} delay={i * 0.08}>
                <div className="h-full bg-bg p-6 lg:p-7">
                  <span className="figure text-[15px] text-brand">{w.n}</span>
                  <h3 className="mt-3 text-[19px] font-semibold leading-snug">
                    {w.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-dim">
                    {w.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl border-l-2 border-brand pl-5 text-[16px] leading-relaxed lg:text-[17px]">
              LinkedIn es una vitrina donde nadie construye. Discord es
              comunidad sin estructura. Los hackatones duran 48 horas y no
              acumulan nada. <strong className="font-medium">Nadie ataca el
              abandono ni construye reputación a partir de trabajo real en
              equipo.</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Cómo funciona ------------------------------ */}
      <section id="como-funciona" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="label">Cómo funciona</p>
            <h2 className="display mt-4 max-w-2xl text-4xl lg:text-5xl">
              El ciclo de sprint es todo el producto.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-dim">
              No se evalúa al final del proyecto, cuando ya es tarde para
              cualquiera. Se evalúa cada dos o tres semanas, y eso es lo que
              hace que la reputación signifique algo.
            </p>
          </Reveal>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CYCLE.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <li className="relative h-full rounded-card border border-line bg-bg p-5">
                  <span className="figure text-[15px] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2.5 text-[16px] font-semibold leading-snug">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-dim">
                    {s.d}
                  </p>
                  {i < CYCLE.length - 1 && (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-line lg:block"
                      aria-hidden
                    />
                  )}
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3}>
            <p className="label mt-6 text-center">
              Y vuelta a empezar, hasta que el proyecto termina
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- Reglas --------------------------------- */}
      <section id="reglas" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="label">Las reglas</p>
            <h2 className="display mt-4 max-w-2xl text-4xl lg:text-5xl">
              Seis decisiones que hacen que esto no se desarme.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RULES.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.title} delay={(i % 3) * 0.08}>
                  <Card className="h-full p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft">
                      <Icon className="h-[18px] w-[18px] text-brand" />
                    </span>
                    <h3 className="mt-4 text-[17px] font-semibold leading-snug">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-dim">
                      {r.body}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------- Apoyar ---------------------------------- */}
      <section id="apoyar" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="lg:grid lg:grid-cols-[1fr_420px] lg:items-start lg:gap-16">
            <Reveal>
              <p className="label">Apoyar un proyecto</p>
              <h2 className="display mt-4 max-w-2xl text-4xl lg:text-5xl">
                No hace falta saber programar para que algo llegue al final.
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-dim">
                Cualquiera puede aportar dinero a un proyecto: quien lidera,
                quien colabora y quien entró solo a mirar. Lo único que
                necesitas es una wallet.
              </p>

              <ol className="mt-10 space-y-5">
                {SUPPORT_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Reveal key={s.title} delay={i * 0.08}>
                      <li className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                          <Icon className="h-[18px] w-[18px] text-brand" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-semibold leading-snug">
                            {s.title}
                          </h3>
                          <p className="mt-1.5 text-[15px] leading-relaxed text-dim">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    </Reveal>
                  );
                })}
              </ol>

              <Reveal delay={0.3}>
                <p className="mt-8 max-w-xl border-l-2 border-brand pl-5 text-[15px] leading-relaxed">
                  Cada movimiento queda registrado con su transacción. No hay
                  que creerle a nadie:{" "}
                  <strong className="font-medium">
                    se comprueba en el explorador de bloques.
                  </strong>
                </p>
              </Reveal>
            </Reveal>

            {/* Proyectos con tesorería abierta, con cifras reales de la cadena. */}
            <Reveal delay={0.15} className="mt-12 lg:mt-0">
              {fundable.length === 0 ? (
                <Card>
                  <p className="label">Tesorerías</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-dim">
                    Las tesorerías se abren cuando cada equipo publica su
                    roadmap definitivo. Muy pronto vas a poder apoyar desde
                    aquí.
                  </p>
                  <Link
                    href="/proyectos"
                    className="label mt-4 inline-flex items-center gap-1.5 text-brand hover:underline"
                  >
                    Ver los proyectos
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  <p className="label">Recaudando ahora</p>
                  {fundable.map((p) => (
                    <Link
                      key={p.id}
                      href={`/proyectos/${p.slug}`}
                      className="card block p-4 transition-colors hover:border-brand/50"
                    >
                      <h3 className="display text-xl">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-dim">
                        {p.summary}
                      </p>
                      <FundingBadge summary={funding[p.slug]} />
                    </Link>
                  ))}
                  <Link
                    href="/proyectos"
                    className="label inline-flex items-center gap-1.5 text-brand hover:underline"
                  >
                    Ver todos los proyectos
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------- Reputación -------------------------------- */}
      <section id="reputacion" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="label">Quién termina</p>
            <h2 className="display mt-4 max-w-2xl text-4xl lg:text-5xl">
              El ranking no es por puntos. Es por proyectos terminados.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-dim">
              No hay experiencia por invitar amigos ni rachas por conectarte.
              Lo único que sube aquí es haber llegado al final con tu equipo.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 overflow-hidden rounded-card border border-line bg-bg">
              {builders.map((u, i) => {
                const t = trajectories[u.id];
                return (
                  <Link
                    key={u.id}
                    href={`/u/${u.handle}`}
                    className="flex items-center gap-4 border-b border-line px-4 py-4 transition-colors last:border-0 hover:bg-surface-2 lg:px-6"
                  >
                    <span className="figure w-5 shrink-0 text-[14px] text-dim">
                      {i + 1}
                    </span>
                    <Avatar name={u.name} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">
                        {u.name}
                      </span>
                      <span className="label">{u.location}</span>
                    </span>

                    <span className="hidden shrink-0 gap-6 sm:flex">
                      <span className="text-right">
                        <span className="figure block text-[15px]">
                          {u.reputation.reliability.toFixed(1)}
                        </span>
                        <span className="label">Confiabilidad</span>
                      </span>
                      <span className="text-right">
                        <span className="figure block text-[15px]">
                          {u.reputation.skill.toFixed(1)}
                        </span>
                        <span className="label">Habilidad</span>
                      </span>
                    </span>

                    <span className="w-20 shrink-0 text-right">
                      <span className="figure block text-[17px] font-semibold text-brand">
                        {Math.round((u.completionRate ?? 0) * 100)}%
                      </span>
                      <span className="label">
                        {t.projectsCompleted}/{t.projectsJoined} terminados
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Cierre ----------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:px-8 lg:py-28">
          <Reveal>
            <h2 className="display mx-auto max-w-3xl text-4xl leading-[1.05] lg:text-6xl">
              Ya sabes hacer cosas.
              <br />
              <span className="text-brand">Falta que quede probado.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-dim">
              Entra a un proyecto que necesite lo que sabes hacer, publica el
              que llevas meses queriendo empezar, o pon dinero para que otro
              llegue al final.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/proyectos"
                className="brand-grad flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[15px] font-medium text-on-brand shadow-lg shadow-brand/25 transition-transform active:scale-[0.98]"
              >
                Buscar un proyecto
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/proyectos/nuevo"
                className="flex min-h-[52px] items-center justify-center rounded-full border border-line px-8 text-[15px] font-medium transition-colors hover:border-brand hover:text-brand"
              >
                Publicar el mío
              </Link>
            </div>

            <p className="mt-6 text-[14px] text-dim">
              ¿Solo quieres apoyar?{" "}
              <Link href="#apoyar" className="text-brand hover:underline">
                Así funcionan los aportes
              </Link>
            </p>

            <p className="label mt-8">
              Aportar no requiere cuenta · El trabajo del equipo es voluntario y
              así está declarado en cada rol
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
