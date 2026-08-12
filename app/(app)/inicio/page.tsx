import { projects } from "@/lib/data";
import { getChainInfo, getFundingSummaries } from "@/lib/chain/read";
import { HomeDashboard } from "@/components/home/HomeDashboard";

/**
 * Panel de inicio.
 *
 * El panel es de cliente porque abre el modal de evaluación de sprint, así
 * que la lectura de la cadena se hace aquí, en el servidor, y baja como
 * props. Si no hay contratos configurados ambas devuelven vacío y el panel
 * se renderiza igual, sin cifras ni botón de apoyo.
 */
export default async function InicioPage() {
  const funding = await getFundingSummaries(projects.map((p) => p.slug));

  return <HomeDashboard funding={funding} chain={getChainInfo()} />;
}
