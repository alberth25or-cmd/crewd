"use client";

import { motion } from "motion/react";

/** Aparición al entrar en pantalla. `once` para que no se repita al
 *  volver a subir, que es lo que hace que una landing se sienta
 *  inquieta. La preferencia de movimiento reducido la respeta la regla
 *  global de globals.css. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
