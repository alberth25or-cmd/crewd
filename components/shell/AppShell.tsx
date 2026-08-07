"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  House,
  Compass,
  Plus,
  Zap,
  User,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Shell de la aplicación.
 *
 * Dos formas para el mismo producto:
 *  - Móvil: navegación inferior fija, una columna. El usuario objetivo
 *    está en Lima, Bogotá, Lagos o Manila con 20-28 años, y eso es un
 *    teléfono.
 *  - Escritorio (lg+): barra lateral persistente y contenido ancho. Es
 *    la forma que espera alguien que paga por una herramienta de
 *    trabajo, y es donde un líder revisa postulaciones y cierra sprints.
 *
 * No son dos productos: son las mismas rutas con distinta densidad.
 */

interface Tab {
  href: string;
  icon: LucideIcon;
  label: string;
  /** En móvil la acción de crear va al centro con tratamiento propio. */
  center?: boolean;
}

const TABS: Tab[] = [
  { href: "/inicio", icon: House, label: "Inicio" },
  { href: "/proyectos", icon: Compass, label: "Proyectos" },
  { href: "/proyectos/nuevo", icon: Plus, label: "Crear", center: true },
  { href: "/retos", icon: Zap, label: "Retos" },
  { href: "/perfil", icon: User, label: "Perfil" },
];

function isActive(pathname: string, href: string) {
  // "/proyectos" no debe quedar activo cuando estás en "/proyectos/nuevo",
  // que tiene su propia pestaña.
  if (href === "/proyectos") {
    return pathname.startsWith("/proyectos") && !pathname.startsWith("/proyectos/nuevo");
  }
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar pathname={pathname} />

      <div className="flex min-h-dvh flex-1 flex-col lg:pl-64">
        <TopBar />
        <main className="flex-1 pb-24 lg:pb-12">{children}</main>
        <BottomNav pathname={pathname} />
      </div>
    </div>
  );
}

/* ------------------------------- Escritorio ------------------------------ */

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 py-5">
        <Link href="/inicio" className="display text-[26px] leading-none">
          Crewd
        </Link>
        <p className="label mt-1.5 leading-relaxed">
          Termina lo que empiezas
        </p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {TABS.filter((t) => !t.center).map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                    active
                      ? "bg-brand-soft font-medium text-brand"
                      : "text-dim hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-indicator"
                      className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand"
                      transition={{ type: "spring", stiffness: 500, damping: 34 }}
                    />
                  )}
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/proyectos/nuevo"
          className="brand-grad mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-[14px] font-medium text-on-brand shadow-lg shadow-brand/20 transition-transform active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Publicar proyecto
        </Link>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2">
          <Link
            href="/perfil"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2"
          >
            <span className="brand-grad figure flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-on-brand">
              MR
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium">
                María Riveros
              </span>
              <span className="label">Lima, Perú</span>
            </span>
          </Link>
          <NotificationButton />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

/* --------------------------------- Móvil -------------------------------- */

function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-md lg:hidden">
      <Link href="/inicio" className="display text-[22px] leading-none">
        Crewd
      </Link>
      <div className="flex items-center gap-1">
        <NotificationButton />
        <ThemeToggle />
      </div>
    </header>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[520px] items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;

          if (tab.center) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-1 flex-col items-center justify-center py-2"
                aria-label="Crear proyecto"
              >
                <span className="brand-grad flex h-11 w-11 items-center justify-center rounded-full text-on-brand shadow-lg">
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              {active && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              )}
              <Icon
                className={`h-5 w-5 transition-colors ${active ? "text-brand" : "text-dim"}`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[10px] transition-colors ${
                  active ? "font-semibold text-brand" : "text-dim"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------- Compartido ------------------------------ */

function NotificationButton() {
  return (
    <button
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-dim transition-colors hover:bg-surface-2 hover:text-text"
      aria-label="Notificaciones"
    >
      <Bell className="h-[18px] w-[18px]" />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
    </button>
  );
}

