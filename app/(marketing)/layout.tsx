import { MarketingShell } from "@/components/marketing/MarketingShell";

/** Rutas públicas: cabecera de conversión, sin navegación de producto. */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return <MarketingShell>{children}</MarketingShell>;
}
