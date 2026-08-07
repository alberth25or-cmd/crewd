import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getUserById } from "@/lib/data";
import { ReputationField, ReputationReadout } from "@/components/ReputationField";
import {
  Avatar,
  Button,
  Card,
  Chip,
  EmptyState,
  SectionHead,
  SprintMark,
} from "@/components/ui";
import { FundingPanel } from "@/components/funding/FundingPanel";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short" });

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const leader = getUserById(project.leaderId)!;
  const openRoles = project.roles.filter((r) => r.status === "abierto");
  const current = project.sprints.find((s) => s.status === "en-curso");
  const closed = project.sprints.filter((s) => s.status === "cerrado").length;
  const countries = new Set(
    project.members.map((m) => getUserById(m.userId)!.location.split(", ")[1])
  ).size;

  return (
    <div className="mx-auto w-full max-w-[560px] lg:max-w-6xl lg:px-8 lg:pt-8">
      {/* Cabecera */}
      <header className="brand-grad px-4 pb-6 pt-5 text-on-brand lg:rounded-card lg:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label rounded-full bg-white/15 px-2.5 py-1 text-on-brand">
            {project.status === "activo" ? "Activo" : "Reclutando"}
          </span>
          {project.sdg && (
            <span className="label rounded-full bg-white/15 px-2.5 py-1 text-on-brand">
              ODS {project.sdg.number}
            </span>
          )}
          <span className="label text-on-brand/75">{project.modality}</span>
          <span className="label text-on-brand/75">{project.area}</span>
        </div>

        <h1 className="display mt-3 text-4xl lg:text-6xl">{project.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-on-brand/85 lg:text-[17px]">
          {project.summary}
        </p>

        <div className="mt-5 lg:max-w-md">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="label text-on-brand/75">Avance</span>
            <span className="figure text-[13px]">
              {closed} / {project.sprints.length} sprints
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-700"
              style={{ width: `${(closed / project.sprints.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* En escritorio la reputación del líder y el equipo van a una barra
          lateral fija; en móvil van primero, porque son el dato que
          decide si alguien sigue leyendo o no. */}
      <div className="px-4 py-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-x-10 lg:px-0 lg:py-8">
        <aside className="space-y-8 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-8 lg:self-start">
          <section>
            <SectionHead title="Quien lidera" />
            <Card>
              <Link
                href={`/u/${leader.handle}`}
                className="flex items-center gap-3"
              >
                <Avatar name={leader.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold">{leader.name}</p>
                  <p className="label mt-0.5">
                    {leader.location} · {leader.timezone}
                  </p>
                </div>
                <span className="label shrink-0 text-brand">Ver →</span>
              </Link>

              <p className="mt-3 text-[14px] leading-relaxed text-dim">
                {leader.headline}
              </p>

              <div className="mt-4 flex justify-center">
                <ReputationField reputation={leader.reputation} size={200} />
              </div>
              <div className="mt-4">
                <ReputationReadout
                  reputation={leader.reputation}
                  completionRate={leader.completionRate}
                />
              </div>
            </Card>
          </section>

          <section>
            <SectionHead
              title="Equipo"
              aside={
                <span className="label">
                  {project.members.length} · {countries}{" "}
                  {countries === 1 ? "país" : "países"}
                </span>
              }
            />
            <Card className="p-0">
              {project.members.map((m) => {
                const u = getUserById(m.userId)!;
                return (
                  <Link
                    key={m.userId}
                    href={`/u/${u.handle}`}
                    className="flex items-center gap-3 border-b border-line px-4 py-3 transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <Avatar name={u.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{u.name}</p>
                      <p className="label truncate">
                        {m.roleTitle} · {u.location}
                      </p>
                    </div>
                    <span className="label shrink-0">{u.timezone}</span>
                  </Link>
                );
              })}
            </Card>
          </section>
        </aside>

        <div className="mt-8 space-y-10 lg:col-start-1 lg:row-start-1 lg:mt-0">
          {/* Descripción */}
          <section>
            <SectionHead title="El problema y el plan" />
            <div className="max-w-2xl space-y-3 text-[15px] leading-relaxed lg:text-[16px]">
              {project.description.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* Roadmap. La numeración de sprints codifica una secuencia
              real, así que aquí sí es información y no decoración. */}
          <section>
            <SectionHead
              title="Roadmap"
              aside={<span className="label">{closed} cerrados</span>}
            />
            <Card className="p-0">
              <ol>
                {project.sprints.map((s) => {
                  const live = s.status === "en-curso";
                  return (
                    <li
                      key={s.id}
                      className={`flex gap-3 border-b border-line px-4 py-3.5 last:border-0 lg:px-5 lg:py-4 ${
                        live ? "bg-brand-soft" : ""
                      }`}
                    >
                      <span
                        className={`figure w-6 shrink-0 text-[17px] lg:text-xl ${
                          live ? "text-brand" : s.status === "cerrado" ? "" : "text-dim"
                        }`}
                      >
                        {String(s.number).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <SprintMark status={s.status} />
                          <span className="label">
                            {fmt(s.startDate)} — {fmt(s.endDate)}
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {s.milestones.map((m) => (
                            <li key={m.id} className="flex gap-2 text-[14px]">
                              <span
                                className={`mt-0.5 text-[11px] ${
                                  m.done ? "text-brand" : "text-dim"
                                }`}
                                aria-hidden
                              >
                                {m.done ? "✓" : "○"}
                              </span>
                              <span className={m.done ? "text-dim" : ""}>
                                {m.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          </section>

          {/* Entregables del sprint en curso */}
          {current && current.deliverables.length > 0 && (
            <section>
              <SectionHead
                title={`Entregables del sprint ${String(current.number).padStart(2, "0")}`}
              />
              <Card className="p-0">
                {current.deliverables.map((d) => {
                  const owner = getUserById(d.ownerId)!;
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 lg:px-5"
                    >
                      <Avatar name={owner.name} size={28} />
                      <span className="min-w-0 flex-1 text-[14px]">
                        {d.description}
                      </span>
                      {d.evidence && (
                        <span className="label hidden shrink-0 sm:block">
                          {d.evidence}
                        </span>
                      )}
                      <span
                        className={`label shrink-0 ${
                          d.status === "entregado"
                            ? "text-brand"
                            : d.status === "vencido"
                              ? "text-danger"
                              : "text-accent"
                        }`}
                      >
                        {d.status === "entregado"
                          ? "Entregado"
                          : d.status === "en-progreso"
                            ? "En curso"
                            : d.status === "vencido"
                              ? "Vencido"
                              : "Pendiente"}
                      </span>
                    </div>
                  );
                })}
              </Card>
            </section>
          )}

          {/* Roles abiertos */}
          <section>
            <SectionHead
              title="Roles abiertos"
              aside={<span className="label">Compromiso declarado</span>}
            />
            {openRoles.length === 0 ? (
              <EmptyState
                label="Equipo completo"
                title="No hay roles abiertos"
                body="Todos los roles están cubiertos. Puedes seguir el proyecto para enterarte cuando se abra uno nuevo."
              />
            ) : (
              <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                {openRoles.map((r) => (
                  <Card key={r.id} className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold">{r.title}</h3>
                        {r.reservedForNewcomers && (
                          <span className="label mt-1 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-accent">
                            Cupo de arranque
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="figure text-2xl font-semibold">
                          {r.hoursPerWeek}h
                        </p>
                        <p className="label">por semana</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                      {r.skills.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <Button
                      href={`/proyectos/${project.slug}/postular/${r.id}`}
                      className="mt-4 w-full"
                    >
                      Postular
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Postulaciones. Estado vacío obligatorio del documento. */}
          <section>
            <SectionHead
              title="Postulaciones"
              aside={<span className="label">Vista del líder</span>}
            />
            {project.applications.length === 0 ? (
              <EmptyState
                label="Sin postulaciones"
                title="Todavía nadie ha postulado"
                body="Los proyectos con roadmap detallado y carga horaria explícita reciben su primera postulación mucho antes. Revisa que tus roles digan qué se espera."
                action={{ text: "Revisar los roles", href: "/proyectos/nuevo" }}
              />
            ) : (
              <div className="space-y-3">
                {project.applications.map((a) => {
                  const applicant = getUserById(a.userId)!;
                  const role = project.roles.find((r) => r.id === a.roleId)!;
                  return (
                    <Card key={a.id}>
                      <div className="flex items-start gap-3">
                        <Avatar name={applicant.name} size={40} />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/u/${applicant.handle}`}
                            className="text-[15px] font-semibold hover:text-brand"
                          >
                            {applicant.name}
                          </Link>
                          <p className="label mt-0.5">
                            {applicant.location} · {role.title}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <ReputationField
                            reputation={applicant.reputation}
                            size={56}
                            showAxes={false}
                          />
                        </div>
                      </div>

                      {applicant.reputation.count === 0 ? (
                        <p className="label mt-3 inline-block rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                          Sin historial · cupo de arranque
                        </p>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <span className="flex-1 rounded-xl bg-surface-2 px-3 py-2 text-center">
                            <span className="figure block text-[15px] font-semibold">
                              {applicant.reputation.reliability.toFixed(1)}
                            </span>
                            <span className="label">Confiabilidad</span>
                          </span>
                          <span className="flex-1 rounded-xl bg-surface-2 px-3 py-2 text-center">
                            <span className="figure block text-[15px] font-semibold">
                              {applicant.reputation.skill.toFixed(1)}
                            </span>
                            <span className="label">Habilidad</span>
                          </span>
                          <span className="flex-1 rounded-xl bg-surface-2 px-3 py-2 text-center">
                            <span className="figure block text-[15px] font-semibold">
                              {Math.round((applicant.completionRate ?? 0) * 100)}%
                            </span>
                            <span className="label">Finalización</span>
                          </span>
                        </div>
                      )}

                      <p className="mt-3 border-l-2 border-line pl-3 text-[14px] leading-relaxed text-dim">
                        {a.message}
                      </p>

                      {a.agreementSigned && (
                        <p className="label mt-3 text-brand">
                          ✓ Acuerdo de compromiso firmado
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1">
                          Rechazar
                        </Button>
                        <Button size="sm" className="flex-[2]">
                          Aceptar en el equipo
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Tesorería on-chain. Se degrada sola a un aviso si no hay
              contratos configurados, así que la página no depende de la
              cadena para renderizarse. */}
          <section>
            <SectionHead title="Financiamiento" />
            <FundingPanel slug={project.slug} title={project.title} />
          </section>
        </div>
      </div>
    </div>
  );
}
