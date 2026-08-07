import Link from "next/link";
import type { ExitType, ProjectStatus, SprintStatus } from "@/lib/types";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`card p-4 ${className}`}>{children}</div>;
}

/** Marca de estado. El color codifica el dominio, no decora. */
export function StatusMark({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { text: string; className: string }> = {
    reclutando: { text: "Reclutando", className: "text-accent bg-accent-soft" },
    activo: { text: "Activo", className: "text-brand bg-brand-soft" },
    completado: { text: "Completado", className: "text-brand bg-brand-soft" },
    detenido: { text: "Detenido", className: "text-dim bg-surface-2" },
  };
  const s = map[status];
  return (
    <span className={`label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${s.className}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {s.text}
    </span>
  );
}

/**
 * Etiqueta de tipo de salida.
 *
 * Regla del dominio: salir bien no se castiga. Por eso "acordada" y
 * "causa mayor" son neutras y solo "ghosting" usa el único rojo del
 * sistema. Si las cuatro se vieran igual de graves, la interfaz estaría
 * contradiciendo el principio del producto.
 */
export function ExitMark({ exit }: { exit?: ExitType }) {
  if (!exit) return <span className="label text-brand">En curso</span>;
  const map: Record<ExitType, { text: string; className: string }> = {
    completo: { text: "Completó", className: "text-brand" },
    acordada: { text: "Salida acordada", className: "text-dim" },
    "causa-mayor": { text: "Causa mayor", className: "text-dim" },
    ghosting: { text: "Ghosting", className: "text-danger" },
  };
  const s = map[exit];
  return <span className={`label ${s.className}`}>{s.text}</span>;
}

export function SprintMark({ status }: { status: SprintStatus }) {
  const map: Record<SprintStatus, { text: string; className: string }> = {
    planificado: { text: "Planificado", className: "text-dim" },
    "en-curso": { text: "En curso", className: "text-brand" },
    cerrado: { text: "Cerrado", className: "text-dim" },
    vencido: { text: "Vencido", className: "text-danger" },
  };
  const s = map[status];
  return <span className={`label ${s.className}`}>{s.text}</span>;
}

export function Chip({
  children,
  verified,
}: {
  children: React.ReactNode;
  verified?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] ${
        verified ? "border-brand/40 bg-brand-soft text-brand" : "border-line text-dim"
      }`}
    >
      {children}
      {verified && <span className="text-[10px]" title="Verificada con evidencia externa">✓</span>}
    </span>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "md" | "sm";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";
  const sizes = {
    md: "min-h-[44px] px-5 text-[15px]",
    sm: "min-h-[36px] px-3.5 text-[13px]",
  };
  const variants = {
    primary: "brand-grad text-on-brand shadow-lg shadow-brand/20 disabled:shadow-none",
    secondary: "border border-line bg-surface text-text hover:border-brand hover:text-brand",
    quiet: "text-dim hover:text-text",
    danger: "border border-danger/40 bg-danger-soft text-danger",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/**
 * Estado vacío.
 *
 * El documento de producto los marca como los que "casi siempre se
 * olvidan" y donde el producto vive o muere. Nunca son un encogimiento
 * de hombros: siempre nombran qué pasó y ofrecen la siguiente acción.
 */
export function EmptyState({
  label,
  title,
  body,
  action,
}: {
  label: string;
  title: string;
  body: string;
  action?: { text: string; href: string };
}) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface-2/50 px-5 py-8 text-center">
      <p className="label">{label}</p>
      <p className="display mt-2.5 text-xl">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-dim">{body}</p>
      {action && (
        <div className="mt-5">
          <Button href={action.href} variant="secondary" size="sm">
            {action.text}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Hueco reservado para fase 2. Existe para que el layout ya contemple el
 *  espacio, pero no promete nada que no exista. */
export function ReservedSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line px-4 py-3">
      <p className="label leading-relaxed">{children}</p>
    </div>
  );
}

export function SectionHead({
  title,
  href,
  hrefText = "Ver todo",
  aside,
}: {
  title: string;
  href?: string;
  hrefText?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-[17px] font-semibold">{title}</h2>
      {href ? (
        <Link href={href} className="label text-brand hover:underline">
          {hrefText}
        </Link>
      ) : (
        aside
      )}
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className="brand-grad figure inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-on-brand"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Barra de progreso. Se usa solo para avance hacia una finalización
 *  real (sprints cerrados, roles cubiertos), nunca para XP acumulado. */
export function Progress({
  value,
  tone = "brand",
}: {
  value: number;
  tone?: "brand" | "accent";
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ${
          tone === "brand" ? "brand-grad" : "bg-accent"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function StatTile({
  value,
  label,
  tone = "text",
}: {
  value: React.ReactNode;
  label: string;
  tone?: "text" | "brand" | "accent";
}) {
  const colors = { text: "text-text", brand: "text-brand", accent: "text-accent" };
  return (
    <div className="rounded-card bg-surface-2 px-3 py-2.5 text-center">
      <p className={`figure text-xl font-semibold ${colors[tone]}`}>{value}</p>
      <p className="label mt-0.5">{label}</p>
    </div>
  );
}
