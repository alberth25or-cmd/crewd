import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser, trajectories } from "@/lib/data";
import { ReputationField, ReputationReadout } from "@/components/ReputationField";
import {
  Button,
  Card,
  Chip,
  ExitMark,
  ReservedSlot,
  SectionHead,
} from "@/components/ui";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("es", { month: "short", year: "numeric" });

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = getUser(handle);
  if (!user) notFound();

  const traj = trajectories[user.id];
  const verified = user.skills.filter((s) => s.verified);
  const active = user.memberships.filter((m) => !m.leftAt);
  const past = user.memberships.filter((m) => m.leftAt);

  return (
    <div className="mx-auto w-full max-w-[560px] lg:max-w-6xl lg:px-8 lg:pt-8">
      {/* Cabecera */}
      <header className="brand-grad px-4 pb-6 pt-6 text-on-brand lg:rounded-card lg:p-8">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div className="lg:flex-1">
            <div className="flex items-center gap-3.5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-semibold backdrop-blur-sm lg:h-20 lg:w-20 lg:text-3xl">
                {user.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <div className="min-w-0">
                <h1 className="display text-3xl lg:text-5xl">{user.name}</h1>
                <p className="label mt-1 text-on-brand/75">
                  @{user.handle} · {user.location} · {user.timezone}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-on-brand/85 lg:text-[16px]">
              {user.headline}
            </p>
          </div>

          {/* Todo lo que se cuenta aquí es un cierre. No hay XP ni nivel. */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 lg:mt-0 lg:w-[380px] lg:shrink-0">
            {[
              { v: traj.projectsCompleted, l: "Terminados" },
              { v: traj.sprintsClosed, l: "Sprints cerrados" },
              { v: traj.hoursCommitted, l: "Horas" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-card bg-white/12 px-2 py-2.5 text-center backdrop-blur-sm lg:py-4"
              >
                <p className="figure text-2xl font-semibold lg:text-3xl">{s.v}</p>
                <p className="label mt-0.5 text-on-brand/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* En escritorio la reputación se fija a la izquierda y acompaña
          toda la lectura del historial. */}
      <div className="px-4 py-6 lg:grid lg:grid-cols-[340px_1fr] lg:gap-x-10 lg:px-0 lg:py-8">
        <aside className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-8 lg:self-start">
        <section>
          <SectionHead
            title="Reputación"
            aside={
              user.reputation.count > 0 ? (
                <span className="label">n={user.reputation.count}</span>
              ) : null
            }
          />
          <Card>
            <div className="flex justify-center">
              <ReputationField reputation={user.reputation} size={230} />
            </div>
            <div className="mt-4">
              <ReputationReadout
                reputation={user.reputation}
                completionRate={user.completionRate}
              />
            </div>
            {user.reputation.count > 0 && (
              <p className="mt-3 text-[13px] leading-relaxed text-dim">
                Cada punto es una evaluación de alguien que trabajó con{" "}
                {user.name.split(" ")[0]} en un sprint. El círculo marca el
                centro; la dispersión muestra cuánto varía.
              </p>
            )}
          </Card>
        </section>
        </aside>

        <div className="mt-8 space-y-10 lg:col-start-2 lg:row-start-1 lg:mt-0">
        {/* COLD START. El estado que decide si el producto funciona: sin
            historial nadie te elige, y sin que te elijan no hay
            historial. La pantalla tiene que romper ese ciclo. */}
        {user.isNew && (
          <section>
            <Card className="border-accent/40 bg-accent-soft">
              <p className="label text-accent">Perfil nuevo</p>
              <h2 className="display mt-2 text-2xl">
                Todavía no tienes evaluaciones. Así se consigue la primera.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-dim">
                Nadie empieza con reputación. Hay cuatro formas de entrar sin
                historial, y ninguna te pide esperar a que alguien te dé una
                oportunidad.
              </p>

              <ol className="mt-4 space-y-3">
                {[
                  {
                    n: "01",
                    t: "Haz un micro-reto",
                    d: "Encargos de una semana o menos con entregable real, evaluados igual que un sprint.",
                    href: "/retos",
                    cta: "Ver micro-retos",
                  },
                  {
                    n: "02",
                    t: "Postula a un cupo de arranque",
                    d: "Algunos líderes reservan un rol para gente sin historial, con menos horas y alcance acotado.",
                    href: "/proyectos",
                    cta: "Ver proyectos con cupo",
                  },
                  {
                    n: "03",
                    t: "Entra como aprendiz",
                    d: "Expectativas ajustadas. Cuenta como proyecto completado si llegas al final.",
                    href: null,
                    cta: null,
                  },
                  {
                    n: "04",
                    t: "Verifica lo que ya hiciste",
                    d: "Conecta un repositorio o portafolio. No es reputación, pero es la señal que mira un líder cuando no hay números.",
                    href: "#",
                    cta: "Verificar habilidades",
                  },
                ].map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="figure w-6 shrink-0 text-[15px] text-accent">
                      {s.n}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold">{s.t}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-dim">
                        {s.d}
                      </p>
                      {s.href && (
                        <Link
                          href={s.href}
                          className="label mt-1 inline-block text-brand"
                        >
                          {s.cta} →
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        )}

        {/* Habilidades */}
        <section>
          <SectionHead
            title="Habilidades"
            aside={
              <span className="label">
                {verified.length}/{user.skills.length} verificadas
              </span>
            }
          />
          <div className="flex flex-wrap gap-2">
            {user.skills.map((s) => (
              <Chip key={s.name} verified={s.verified}>
                {s.name}
              </Chip>
            ))}
          </div>
          <p className="label mt-2.5 leading-relaxed">
            Verificada = contrastada con evidencia externa, no autodeclarada
          </p>
        </section>

        {/* Marcas de trayectoria */}
        <section>
          <SectionHead title="Marcas de trayectoria" href="/retos" hrefText="Ver todas" />
          <div className="flex flex-wrap gap-2">
            {traj.marks.map((m) => (
              <span
                key={m.id}
                title={m.description}
                className={`rounded-full border px-3 py-1.5 text-[13px] ${
                  m.unlocked
                    ? "border-brand/40 bg-brand-soft text-brand"
                    : "border-line text-dim opacity-60"
                }`}
              >
                {m.label}
              </span>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section>
          <SectionHead
            title="Historial"
            aside={
              <span className="label">{user.memberships.length} proyectos</span>
            }
          />
          {user.memberships.length === 0 ? (
            <Card className="border-dashed">
              <p className="label">Sin proyectos todavía</p>
              <p className="mt-2 text-[14px] leading-relaxed text-dim">
                Cuando entres a tu primer proyecto aparecerá aquí, junto con cómo
                terminó. Salir avisando y entregando el avance se registra igual
                de bien que llegar al final.
              </p>
              <Button href="/proyectos" variant="secondary" size="sm" className="mt-4">
                Explorar proyectos
              </Button>
            </Card>
          ) : (
            <Card className="p-0">
              {[...active, ...past].map((m) => (
                <div
                  key={`${m.projectId}-${m.joinedAt}`}
                  className="border-b border-line px-4 py-3.5 last:border-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="min-w-0 flex-1 text-[15px]">{m.projectTitle}</p>
                    <ExitMark exit={m.exitType} />
                  </div>
                  <p className="label mt-1">
                    {m.roleTitle} · {fmt(m.joinedAt)} —{" "}
                    {m.leftAt ? fmt(m.leftAt) : "hoy"}
                  </p>
                </div>
              ))}
            </Card>
          )}

          {past.some((m) => m.exitType === "acordada") && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-dim">
              Una salida acordada no resta reputación. Avisar, documentar y
              entregar el avance es una forma legítima de terminar.
            </p>
          )}
        </section>

        {/* Movimientos de reputación */}
        {user.events.length > 0 && (
          <section>
            <SectionHead title="Movimientos de reputación" />
            <Card className="p-0">
              {user.events.map((e) => (
                <div
                  key={e.id}
                  className="border-b border-line px-4 py-3 last:border-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label">{e.source}</span>
                    <span className="figure text-[12px]">
                      {e.reliabilityDelta === 0 && e.skillDelta === 0 ? (
                        <span className="text-dim">sin cambio</span>
                      ) : (
                        <span className="text-brand">
                          {e.reliabilityDelta !== 0 &&
                            `conf +${e.reliabilityDelta.toFixed(2)} `}
                          {e.skillDelta !== 0 && `hab +${e.skillDelta.toFixed(2)}`}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] leading-relaxed">{e.note}</p>
                  <p className="label mt-1">{fmt(e.date)}</p>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* Hueco reservado para fase 2. */}
        <section>
          <SectionHead title="Credenciales" />
          <ReservedSlot>
            Llevarte estas credenciales fuera de Crewd es parte del plan, pero
            todavía no está disponible.
          </ReservedSlot>
        </section>
        </div>
      </div>
    </div>
  );
}
