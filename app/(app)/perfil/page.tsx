import { redirect } from "next/navigation";

/** El perfil propio es el mismo componente que el ajeno. Sin sesión real
 *  en fase 1, la pestaña apunta al usuario semilla. */
export default function MyProfilePage() {
  redirect("/u/mariar");
}
