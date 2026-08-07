"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { projects, getUserById } from "@/lib/data";
import {
  Avatar,
  Chip,
  EmptyState,
  Progress,
  StatusMark,
} from "@/components/ui";

/**
 * Feed de proyectos.
 *
 * El documento marca como no-goal "una red social con feed infinito",
 * así que esto es un buscador, no un muro: filtros explícitos, sin
 * scroll infinito, sin recomendaciones opacas. El filtro de compromiso
 * semanal va primero porque es el que evita que alguien postule a algo
 * que no puede sostener.
 */

const AREAS = ["Todos", "Hardware", "Software", "Datos", "Educación"] as const;
const HOURS = [
  { id: "all", label: "Cualquiera" },
  { id: "low", label: "Hasta 5h" },
  { id: "mid", label: "6 a 8h" },
  { id: "high", label: "Más de 8h" },
] as const;

export default function ProjectsPage() {
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
      if (open.length === 0) return false;

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

      return true;
    });
  }, [query, area, hours, newcomersOnly]);

  const filtersOn = area !== "Todos" || hours !== "all" || newcomersOnly;

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-5 lg:max-w-6xl lg:px-8 lg:py-8">
      <h1 className="display text-3xl lg:text-5xl">Proyectos</h1>
      <p className="mt-1 text-[14px] text-dim lg:text-[16px]">
        {projects.length} publicados · filtra por lo que puedes sostener
      </p>

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
      </div>

      {/* Áreas */}
      <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`label whitespace-nowrap rounded-full border px-3.5 py-2 transition-colors ${
                area === a
                  ? "border-transparent bg-text text-bg"
                  : "border-line text-dim"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
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
              body="Prueba ampliando el compromiso semanal o quitando el filtro de área. También puedes publicar el proyecto que estás buscando."
              action={{ text: "Publicar un proyecto", href: "/proyectos/nuevo" }}
            />
          </div>
        ) : (
          results.map((p, i) => {
            const leader = getUserById(p.leaderId)!;
            const open = p.roles.filter((r) => r.status === "abierto");
            const closed = p.sprints.filter((s) => s.status === "cerrado").length;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.24) }}
                className="h-full"
              >
                <Link
                  href={`/proyectos/${p.slug}`}
                  className="card flex h-full flex-col p-4 transition-colors hover:border-brand/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <StatusMark status={p.status} />
                    <span className="label">{p.modality}</span>
                  </div>

                  <h2 className="display mt-3 text-2xl">{p.title}</h2>
                  <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-dim">
                    {p.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {open.slice(0, 3).map((r) => (
                      <Chip key={r.id} verified={r.reservedForNewcomers}>
                        {r.title} · {r.hoursPerWeek}h
                      </Chip>
                    ))}
                  </div>

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
                    <span className="flex items-center gap-2">
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
                      {open.length} {open.length === 1 ? "rol" : "roles"} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
