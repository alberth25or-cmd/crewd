"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

/** El tema vive en el `class` del <html>, que escribe un script antes del
 *  primer pintado. Eso lo hace estado externo a React, así que se lee con
 *  useSyncExternalStore en vez de duplicarlo en un useState sincronizado
 *  por efecto — que provocaría un render en cascada y un parpadeo del
 *  ícono en cada carga. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => true // En el servidor el tema por defecto es oscuro.
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("crewd-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-dim transition-colors hover:bg-surface-2 hover:text-text"
      aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      {dark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
