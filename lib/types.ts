/**
 * Modelo de dominio de Crewd (sección 7 del documento de producto).
 *
 * Estos tipos son el contrato. En fase 2, `ReputationEvent` se convierte
 * en una atestación on-chain sin que cambie su forma: por eso lleva ya
 * `source` y deltas explícitos en lugar de un score recalculado.
 */

export type ExitType = "completo" | "acordada" | "causa-mayor" | "ghosting";

export type ProjectStatus = "reclutando" | "activo" | "completado" | "detenido";

export type RoleStatus = "abierto" | "cubierto";

export type SprintStatus = "planificado" | "en-curso" | "cerrado" | "vencido";

export type DeliverableStatus =
  | "pendiente"
  | "en-progreso"
  | "entregado"
  | "vencido";

export type ApplicationStatus = "pendiente" | "aceptada" | "rechazada";

/** Objetivos de Desarrollo Sostenible. Opcional en el proyecto. */
export interface SDG {
  number: number;
  label: string;
}

export interface Skill {
  name: string;
  /** Verificada contra evidencia externa (portafolio, repo). Señal de arranque. */
  verified: boolean;
}

/**
 * Una evaluación individual. Se guarda la puntuación en los DOS ejes
 * porque son independientes: un crack impuntual y un mediocre confiable
 * no pueden colapsar al mismo número.
 */
export interface Evaluation {
  id: string;
  evaluatorId: string;
  subjectId: string;
  sprintId: string;
  /** 0–5. Cumple: entrega a tiempo, responde, avisa. Predice el abandono. */
  reliability: number;
  /** 0–5. Calidad del trabajo entregado, evaluada por rol. */
  skill: number;
  comment?: string;
  /** Solo visible cuando ambas partes evaluaron o venció el plazo. */
  revealed: boolean;
}

/**
 * La reputación NO se guarda como promedio. Se guarda la nube de
 * evaluaciones y se derivan las agregaciones, porque la regla del
 * dominio exige mostrar la distribución y no solo la media.
 */
export interface Reputation {
  reliability: number;
  skill: number;
  /** Número de evaluaciones que sostienen esos números. */
  count: number;
  /** Puntos individuales, para graficar la dispersión real. */
  samples: { reliability: number; skill: number }[];
}

export interface ReputationEvent {
  id: string;
  userId: string;
  source: "sprint" | "micro-reto" | "salida" | "verificacion";
  reliabilityDelta: number;
  skillDelta: number;
  note: string;
  date: string;
}

export interface User {
  id: string;
  handle: string;
  name: string;
  /** Ciudad y país. El alcance global es parte de la tesis del producto. */
  location: string;
  timezone: string;
  headline: string;
  bio?: string;
  skills: Skill[];
  reputation: Reputation;
  /** Proyectos terminados / proyectos en los que entró. */
  completionRate: number | null;
  memberships: Membership[];
  events: ReputationEvent[];
  /** Aún sin historial: activa el tratamiento de cold start. */
  isNew: boolean;
}

export interface Role {
  id: string;
  projectId: string;
  title: string;
  skills: string[];
  /** Carga horaria semanal esperada. Se declara antes de postular. */
  hoursPerWeek: number;
  status: RoleStatus;
  /** Cupo reservado para gente sin historial. Opcional para el líder. */
  reservedForNewcomers?: boolean;
  filledBy?: string;
}

export interface Milestone {
  id: string;
  title: string;
  sprintNumber: number;
  done: boolean;
}

export interface Deliverable {
  id: string;
  sprintId: string;
  ownerId: string;
  description: string;
  evidence?: string;
  status: DeliverableStatus;
}

export interface Sprint {
  id: string;
  projectId: string;
  number: number;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  milestones: Milestone[];
  deliverables: Deliverable[];
}

export interface Membership {
  userId: string;
  projectId: string;
  projectTitle: string;
  roleTitle: string;
  joinedAt: string;
  leftAt?: string;
  exitType?: ExitType;
}

export interface Application {
  id: string;
  userId: string;
  roleId: string;
  message: string;
  status: ApplicationStatus;
  /** El acuerdo de compromiso se firma ANTES de ser aceptado. */
  agreementSigned: boolean;
  appliedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  sdg?: SDG;
  status: ProjectStatus;
  leaderId: string;
  modality: "remoto" | "híbrido";
  area: string;
  createdAt: string;
  roles: Role[];
  sprints: Sprint[];
  members: { userId: string; roleTitle: string }[];
  applications: Application[];
  /** Reservado para fase 2 (tesorería on-chain). No se implementa aún. */
  funding?: { raised: number; goal: number; backers: number };
}

/* -----------------------------------------------------------------
   Trayectoria — la capa de progreso, reencuadrada.

   El prototipo anterior medía actividad: XP por invitar amigos, rachas
   de días conectado, niveles del 1 al 100. Eso premia entrar, y el
   principio 1 del documento dice lo contrario ("todo el sistema premia
   la finalización, no la actividad"). Peor: produce exactamente el
   anti-perfil descrito, el que se suma por el badge y desaparece al
   tercer sprint.

   Aquí todo lo que se cuenta es un cierre. La racha no mide días
   conectado sino sprints entregados a tiempo — se rompe por no
   entregar, nunca por no abrir la app.
   ----------------------------------------------------------------- */

export interface CompletionMark {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

export interface Trajectory {
  projectsCompleted: number;
  projectsJoined: number;
  sprintsClosed: number;
  /** Sprints consecutivos entregados a tiempo. */
  onTimeStreak: number;
  bestStreak: number;
  hoursCommitted: number;
  marks: CompletionMark[];
}

/**
 * Micro-reto: encargo corto y verificable que otorga reputación inicial.
 * Es la solución de cold start del documento, no un señuelo de
 * interacción — cada uno tiene un entregable real y se evalúa igual
 * que un sprint.
 */
export interface MicroChallenge {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  hours: number;
  projectTitle: string;
  skills: string[];
  takenBy: number;
  slots: number;
}
