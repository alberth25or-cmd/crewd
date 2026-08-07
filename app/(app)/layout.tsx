import { AppShell } from "@/components/shell/AppShell";

/** Rutas del producto: barra lateral en escritorio, navegación inferior
 *  en móvil. La landing vive en (marketing) y no pasa por aquí. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
