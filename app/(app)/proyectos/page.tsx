import { projects } from "@/lib/data";
import { getFundingSummaries } from "@/lib/chain/read";
import { ProjectsFeed } from "@/components/projects/ProjectsFeed";

/**
 * Listado de proyectos.
 *
 * Componente de servidor: lee el estado de las tesorerías de todos los
 * proyectos en una sola tanda y se lo pasa al buscador, que sí es de
 * cliente porque filtra en vivo.
 *
 * Si la cadena no está configurada, `getFundingSummaries` devuelve un objeto
 * vacío y el listado se renderiza igual, sin cifras de financiamiento.
 */
export default async function ProjectsPage() {
  const funding = await getFundingSummaries(projects.map((p) => p.slug));

  return <ProjectsFeed funding={funding} />;
}
