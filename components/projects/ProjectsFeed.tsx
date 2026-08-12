"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { projects, getUserById } from "@/lib/data";
import type { ChainInfo, FundingSummary } from "@/lib/chain/read";
import { FundingBadge } from "@/components/funding/FundingBadge";
import { SupportButton } from "@/components/funding/SupportButton";
import { Avatar, Chip, EmptyState, Progress, StatusMark } from "@/components/ui";

/**
 * Buscador de proyectos.
 *
 * El documento marca como no-goal "una red social con feed infinito", así
 * que esto es un buscador y no un muro: filtros explícitos, sin scroll
 * infinito, sin recomendaciones opacas.
 *
 * Se entra por dos motivos distintos y la interfaz los separa arriba del
 * todo: unirse a un equipo o apoyar un proyecto. Antes el listado
 * descartaba en silencio los proyectos sin roles abiertos, lo que dejaba
 * fuera precisamente a los que alguien podría querer financiar.
 */

type Intent = "todos" | "unirme" | "apoyar";

const INTENTS: { id: Intent; label: string; hint: string }[] = [
  { id: "todos", label: "Todos", hint: "Todo lo publicado" },
  { id: "unirme", label: "Unirme a un equipo", hint: "Con roles abiertos" },
  { id: "apoyar", label: "Apoyar un proyecto", hint: "Con tesorería abierta" },
];

const AREAS = ["Todos", "Hardware", "Software", "Datos", "Educación"] as const;
const HOURS = [
  { id: "all", label: "Cualquiera" },
  { id: "low", label: "Hasta 5h" },
  { id: "mid", label: "6 a 8h" },
  { id: "high", label: "Más de 8h" },
] as const;

export function ProjectsFeed({
  funding,
  chain,
}: {
  funding: Record<string, FundingSummary>;
  chain: ChainInfo | null;
}) {
  const [intent, setIntent] = useState<Intent>("todos");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("Todos");
  const [hours, setHours] = useState<string>("all");
  const [newcomersOnly, setNewcomersOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    return projects.filter((p) => {
      const q = query.trim().toLowerCase();
      if (
        q &&
        !`${p.title} ${p.summary} ${p.area} ${p.roles.map((r) => r.title).join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;

      if (area !== "Todos" && !p.area.toLowerCase().includes(area.toLowerCase()))
        return false;

      const open = p.roles.filter((r) => r.status === "abierto");

      if (intent === "unirme" && open.length === 0) return false;
      if (intent === "apoyar" && !funding[p.slug]) return false;

      // Los filtros de compromiso solo tienen sentido si buscas un rol.
      if (intent !== "apoyar") {
        if (hours !== "all") {
          const ok = open.some((r) =>
            hours === "low"
              ? r.hoursPerWeek <= 5
              : hours === "mid"
                ? r.hoursPerWeek >= 6 && r.hoursPerWeek <= 8
                : r.hoursPerWeek > 8
          );
          if (!ok) return false;
        }
        if (newcomersOnly && !open.some((r) => r.reservedForNewcomers)) return false;
      }

      return true;
    });
  }, [query, area, hours, newcomersOnly, intent, funding]);

  const filtersOn = area !== "Todos" || hours !== "all" || newcomersOnly;
  const showRoleFilters = intent !== "apoyar";

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-5 lg:max-w-6xl lg:px-8 lg:py-8">
      <h1 className="display text-3xl lg:text-5xl">Proyectos</h1>
      <p className="mt-1 max-w-xl text-[14px] text-dim lg:text-[16px]">
        Únete a un equipo o apoya con dinero el trabajo de otro. Cualquiera
        puede hacer las dos cosas.
      </p>

      {/* Intención. Va primero porque cambia qué tiene sentido filtrar. */}
      <div className="-mx-4 mt-5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {INTENTS.map((i) => (
            <button
              key={i.id}
              onClick={() => setIntent(i.id)}
              className={`rounded-xl border px-3.5 py-2 text-left transition-colors ${
                intent === i.id
                  ? "border-brand bg-brand-soft"
                  : "border-line hover:border-brand/50"
              }`}
            >
              <span
                className={`block whitespace-nowrap text-[14px] ${
                  intent === i.id ? "font-medium text-brand" : "text-dim"
                }`}
              >
                {i.label}
              </span>
              <span className="label mt-0.5 block whitespace-nowrap">{i.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mt-4 flex gap-2 lg:max-w-xl">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rol, tecnología o problema"
            className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-9 text-[15px] outline-none transition-colors focus:border-brand placeholder:text-dim/70"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-dim hover:text-text"
              aria-label="Borrar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {showRoleFilters && (
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
              filtersOn
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-surface text-dim"
            }`}
            aria-label="Filtros"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Áreas */}
      <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`label whitespace-nowrap rounded-full border px-3.5 py-2 transition-colors ${
                area === a ? "border-transparent bg-text text-bg" : "border-line text-dim"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de rol */}
      {showFilters && showRoleFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 overflow-hidden lg:max-w-xl"
        >
          <div className="card space-y-4 p-4">
            <div>
              <p className="label">Compromiso semanal</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {HOURS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHours(h.id)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                      hours === h.id
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line text-dim"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={newcomersOnly}
                onChange={(e) => setNewcomersOnly(e.target.checked)}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              <span className="text-[14px]">
                Solo con cupo de arranque
                <span className="label mt-0.5 block">
                  Roles abiertos a gente sin historial
                </span>
              </span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Resultados */}
      <div className="mt-5 space-y-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {results.length === 0 ? (
          <div className="lg:col-span-2 xl:col-span-3">
            <EmptyState
              label="Sin resultados"
              title="Ningún proyecto encaja con eso"
              body={
                intent === "apoyar"
                  ? "Todavía no hay proyectos con tesorería abierta que encajen. Prueba quitando el filtro de área."
                  : "Prueba ampliando el compromiso semanal o quitando el filtro de área. También puedes publicar el proyecto que estás buscando."
              }
              action={{ text: "Publicar un proyecto", href: "/proyectos/nuevo" }}
            />
          </div>
        ) : (
          results.map((p, i) => {
            const leader = getUserById(p.leaderId)!;
            const open = p.roles.filter((r) => r.status === "abierto");
            const closed = p.sprints.filter((s) => s.status === "cerrado").length;
            const money = funding[p.slug];

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.24) }}
                className="h-full"
              >
                {/* El enlace envuelve solo el contenido. El botón de apoyo
                    queda fuera: un <button> dentro de un <a> es HTML
                    inválido y el clic dispararía las dos acciones. */}
                <div className="card flex h-full flex-col p-4 transition-colors hover:border-brand/50">
                  <Link
                    href={`/proyectos/${p.slug}`}
                    className="flex flex-1 flex-col"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <StatusMark status={p.status} />
                      <span className="label">{p.modality}</span>
                    </div>

                    <h2 className="display mt-3 text-2xl">{p.title}</h2>
                    <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-dim">
                      {p.summary}
                    </p>

                    {open.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {open.slice(0, 3).map((r) => (
                          <Chip key={r.id} verified={r.reservedForNewcomers}>
                            {r.title} · {r.hoursPerWeek}h
                          </Chip>
                        ))}
                      </div>
                    )}

                    {p.sprints.length > 0 && (
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span className="label">Avance</span>
                          <span className="figure text-[12px] text-dim">
                            {closed} / {p.sprints.length} sprints
                          </span>
                        </div>
                        <Progress value={(closed / p.sprints.length) * 100} />
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar name={leader.name} size={26} />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">
                            {leader.name}
                          </span>
                          <span className="label">
                            {Math.round((leader.completionRate ?? 0) * 100)}% finalización
                          </span>
                        </span>
                      </span>
                      <span className="label shrink-0 text-brand">
                        {open.length > 0
                          ? `${open.length} ${open.length === 1 ? "rol" : "roles"} →`
                          : "Ver →"}
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
          })
        )}
      </div>
    </div>
  );
}
