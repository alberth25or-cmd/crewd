import { notFound } from "next/navigation";
import { getProject, getUserById } from "@/lib/data";
import { ApplyForm } from "./ApplyForm";

/**
 * Pantalla 5 — Postular a un rol.
 *
 * Fuera del alcance elegido para esta pasada, pero el botón "Postular"
 * del detalle de proyecto tenía que llevar a algún lado. Está en su
 * versión mínima: lo único que se construyó completo es el acuerdo de
 * compromiso, porque es el diferenciador y sin él la pantalla no
 * significa nada.
 */
export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>;
}) {
  const { slug, roleId } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const role = project.roles.find((r) => r.id === roleId);
  if (!role) notFound();

  const leader = getUserById(project.leaderId)!;
  const totalWeeks = project.sprints.length * 3;

  return (
    <ApplyForm
      projectTitle={project.title}
      projectSlug={project.slug}
      leaderName={leader.name}
      roleTitle={role.title}
      roleSkills={role.skills}
      hoursPerWeek={role.hoursPerWeek}
      totalWeeks={totalWeeks}
      forNewcomers={role.reservedForNewcomers ?? false}
    />
  );
}
