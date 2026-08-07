"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { ReputationField } from "@/components/ReputationField";
import { users } from "@/lib/data";

/**
 * Héroe de la landing.
 *
 * La tesis del producto entera cabe en una imagen: dos personas que un
 * sistema de estrellas describiría casi igual, y que en realidad sirven
 * para cosas opuestas. Kwame entrega trabajo excelente tarde; Ana
 * entrega trabajo correcto siempre a tiempo. Un promedio los aplana; el
 * plano los distingue.
 *
 * Son datos reales de la semilla, no maquetas: los mismos perfiles que
 * el visitante puede abrir después en el producto.
 */

const HANDLES = ["kwame", "anasofia"] as const;

export function HeroField() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % HANDLES.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const user = users.find((u) => u.handle === HANDLES[i])!;
  const { reliability, skill, count } = user.reputation;
  const collapsed = ((reliability + skill) / 2).toFixed(1);

  return (
    <div
      className="card p-5 lg:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label">Reputación real de un perfil</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <p className="mt-1 text-[17px] font-semibold">{user.name}</p>
              <p className="label mt-0.5">{user.location}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 gap-1.5 pt-1">
          {HANDLES.map((h, idx) => (
            <button
              key={h}
              onClick={() => setI(idx)}
              aria-label={`Ver perfil ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand" : "w-1.5 bg-line hover:bg-dim"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <ReputationField reputation={user.reputation} size={240} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* La comparación. Arriba lo que verías en cualquier otra parte,
          abajo lo que ese número escondía. */}
      <div className="mt-6 space-y-2.5">
        <div className="flex items-center justify-between rounded-xl border border-line px-3.5 py-3">
          <span className="label">En otras plataformas</span>
          <span className="figure flex items-center gap-1.5 text-[15px] text-dim">
            <Star className="h-3.5 w-3.5 fill-current" />
            {collapsed}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-brand/40 bg-brand-soft px-3.5 py-3">
          <span className="label text-brand">Aquí</span>
          <span className="figure flex items-center gap-4 text-[15px]">
            <span>
              <span className="text-dim">conf </span>
              <span className="font-semibold text-brand">
                {reliability.toFixed(1)}
              </span>
            </span>
            <span>
              <span className="text-dim">hab </span>
              <span className="font-semibold text-brand">{skill.toFixed(1)}</span>
            </span>
          </span>
        </div>
      </div>

      <p className="label mt-3 leading-relaxed">
        {count} evaluaciones de compañeros de equipo · cada punto es una
      </p>
    </div>
  );
}
