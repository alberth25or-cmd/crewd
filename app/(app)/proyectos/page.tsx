import { projects } from "@/lib/data";
import { getChainInfo, getFundingSummaries } from "@/lib/chain/read";
import { ProjectsFeed } from "@/components/projects/ProjectsFeed";

/**
 * Listado de proyectos.
 *
 * Componente de servidor: lee el estado de las tesorerías de todos los
 * proyectos en una tanda y se lo pasa al buscador, que sí es de cliente
 * porque filtra en vivo.
 *
 * `getChainInfo()` viaja como props en lugar de que el cliente importe la
 * configuración: así el listado no arrastra el cliente RPC al bundle solo
 * para pintar un botón.
 *
 * Si la cadena no está configurada, ambas devuelven vacío y el listado se
 * renderiza igual, sin cifras ni botón de apoyo.
 */
export default async function ProjectsPage() {
  const funding = await getFundingSummaries(projects.map((p) => p.slug));

  return <ProjectsFeed funding={funding} chain={getChainInfo()} />;
}
