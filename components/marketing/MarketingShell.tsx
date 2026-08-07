"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

/** Shell público. Cabecera de conversión, no de navegación de producto:
 *  pocas anclas y una sola acción principal repetida. */

const LINKS = [
  { href: "#problema", label: "El problema" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#reglas", label: "Las reglas" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 lg:px-8">
        <Link href="/" className="display shrink-0 text-[24px] leading-none">
          Crewd
        </Link>

        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-dim transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/inicio"
            className="hidden min-h-[40px] items-center rounded-full px-4 text-[14px] text-dim transition-colors hover:text-text sm:flex"
          >
            Entrar
          </Link>
          <Link
            href="/proyectos"
            className="brand-grad flex min-h-[40px] items-center rounded-full px-4 text-[14px] font-medium text-on-brand shadow-lg shadow-brand/20 transition-transform active:scale-[0.98]"
          >
            Empezar
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-dim lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <ul className="px-4 py-2">
              {[...LINKS, { href: "/inicio", label: "Entrar" }].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[15px] text-dim transition-colors hover:text-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="display text-2xl">Crewd</p>
            <p className="mt-1.5 max-w-xs text-[14px] leading-relaxed text-dim">
              Encuentra tu equipo. Termina lo que empiezas. Que quede probado.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="label">Producto</p>
              <ul className="mt-2.5 space-y-2">
                <li>
                  <Link href="/proyectos" className="text-[14px] text-dim hover:text-text">
                    Proyectos
                  </Link>
                </li>
                <li>
                  <Link href="/retos" className="text-[14px] text-dim hover:text-text">
                    Micro-retos
                  </Link>
                </li>
                <li>
                  <Link href="/inicio" className="text-[14px] text-dim hover:text-text">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label">Cómo funciona</p>
              <ul className="mt-2.5 space-y-2">
                <li>
                  <a href="#reglas" className="text-[14px] text-dim hover:text-text">
                    Las reglas
                  </a>
                </li>
                <li>
                  <a href="#reputacion" className="text-[14px] text-dim hover:text-text">
                    Reputación
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="label mt-10 border-t border-line pt-6">
          Prototipo de interfaz · Fase 1 · Los datos son de ejemplo
        </p>
      </div>
    </footer>
  );
}
