import type {
  MicroChallenge,
  Project,
  Reputation,
  Trajectory,
  User,
} from "./types";

/**
 * Datos semilla. Sin base de datos en fase 1.
 *
 * Las muestras de reputación se escriben a mano en lugar de generarse
 * al azar porque la dispersión cuenta una historia: Kwame tiene alta
 * habilidad con confiabilidad irregular, Ana es lo contrario. El campo
 * bidimensional solo tiene sentido si los datos lo demuestran.
 */

function rep(samples: [number, number][]): Reputation {
  const pts = samples.map(([reliability, skill]) => ({ reliability, skill }));
  const avg = (xs: number[]) =>
    Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
  return {
    reliability: avg(pts.map((p) => p.reliability)),
    skill: avg(pts.map((p) => p.skill)),
    count: pts.length,
    samples: pts,
  };
}

export const users: User[] = [
  {
    id: "u1",
    handle: "mariar",
    name: "María Riveros",
    location: "Lima, Perú",
    timezone: "GMT-5",
    headline: "Ingeniera electrónica · Lidera proyectos de hardware social",
    bio: "Trabajo en sensores de bajo costo para comunidades sin acceso a laboratorios de agua. Llevo tres proyectos terminados y uno que se me cayó: aprendí más de ese.",
    skills: [
      { name: "Electrónica", verified: true },
      { name: "Firmware C", verified: true },
      { name: "Gestión de equipos", verified: false },
      { name: "Diseño de producto", verified: false },
    ],
    reputation: rep([
      [5, 4], [4.5, 4.5], [5, 4], [4.5, 4], [5, 4.5], [4.5, 4], [5, 4.5],
      [4, 4], [5, 4.5], [4.5, 4], [5, 4], [4.5, 4.5], [5, 4], [4.5, 4],
      [5, 4.5], [4, 3.5], [5, 4], [4.5, 4.5], [5, 4], [4.5, 4], [5, 4.5],
      [4.5, 4], [5, 4], [4, 4.5], [5, 4], [4.5, 4], [5, 4.5],
    ]),
    completionRate: 0.75,
    memberships: [
      { userId: "u1", projectId: "p1", projectTitle: "Agua Limpia", roleTitle: "Líder", joinedAt: "2026-04-02" },
      { userId: "u1", projectId: "px1", projectTitle: "Red de sensores sísmicos", roleTitle: "Firmware", joinedAt: "2025-09-10", leftAt: "2025-12-20", exitType: "completo" },
      { userId: "u1", projectId: "px2", projectTitle: "Kit educativo de robótica", roleTitle: "Líder", joinedAt: "2025-03-01", leftAt: "2025-07-15", exitType: "completo" },
      { userId: "u1", projectId: "px3", projectTitle: "App de reciclaje barrial", roleTitle: "Hardware", joinedAt: "2024-11-05", leftAt: "2025-01-30", exitType: "acordada" },
    ],
    events: [
      { id: "e1", userId: "u1", source: "sprint", reliabilityDelta: 0.1, skillDelta: 0.05, note: "Sprint 3 de Agua Limpia cerrado con todos los entregables", date: "2026-07-20" },
      { id: "e2", userId: "u1", source: "salida", reliabilityDelta: 0, skillDelta: 0, note: "Salida acordada de App de reciclaje barrial — documentó y entregó el avance", date: "2025-01-30" },
      { id: "e3", userId: "u1", source: "verificacion", reliabilityDelta: 0, skillDelta: 0.2, note: "Firmware C verificado contra repositorio externo", date: "2024-10-12" },
    ],
    isNew: false,
  },
  {
    id: "u2",
    handle: "kwame",
    name: "Kwame Adjei",
    location: "Accra, Ghana",
    timezone: "GMT",
    headline: "Backend · Sistemas de datos en tiempo real",
    skills: [
      { name: "Go", verified: true },
      { name: "PostgreSQL", verified: true },
      { name: "MQTT", verified: false },
    ],
    reputation: rep([
      [3.5, 5], [3, 5], [4, 4.5], [3, 5], [3.5, 4.5], [2.5, 5], [4, 5],
      [3, 4.5], [3.5, 5], [3, 4.5], [4, 5], [2.5, 4.5], [3.5, 5], [3, 5],
    ]),
    completionRate: 0.6,
    memberships: [
      { userId: "u2", projectId: "p1", projectTitle: "Agua Limpia", roleTitle: "Backend", joinedAt: "2026-04-10" },
      { userId: "u2", projectId: "px4", projectTitle: "Panel de calidad del aire", roleTitle: "Backend", joinedAt: "2025-06-01", leftAt: "2025-10-15", exitType: "completo" },
      { userId: "u2", projectId: "px5", projectTitle: "Bot de alertas agrícolas", roleTitle: "Backend", joinedAt: "2025-01-20", leftAt: "2025-03-02", exitType: "causa-mayor" },
    ],
    events: [],
    isNew: false,
  },
  {
    id: "u3",
    handle: "anasofia",
    name: "Ana Sofía Beltrán",
    location: "Bogotá, Colombia",
    timezone: "GMT-5",
    headline: "Diseño de producto · Investigación con usuarios en campo",
    skills: [
      { name: "Figma", verified: true },
      { name: "Investigación de usuarios", verified: true },
      { name: "Diseño de sistemas", verified: false },
    ],
    reputation: rep([
      [5, 3.5], [5, 4], [4.5, 3.5], [5, 3], [5, 4], [4.5, 3.5], [5, 3.5],
      [5, 4], [4.5, 3], [5, 3.5], [5, 4], [4.5, 3.5], [5, 3.5], [5, 3],
      [4.5, 4], [5, 3.5], [5, 3.5], [4.5, 3.5],
    ]),
    completionRate: 1,
    memberships: [
      { userId: "u3", projectId: "p1", projectTitle: "Agua Limpia", roleTitle: "Investigación de campo", joinedAt: "2026-04-15" },
      { userId: "u3", projectId: "px6", projectTitle: "Mapa de comedores comunitarios", roleTitle: "Diseño", joinedAt: "2025-08-01", leftAt: "2025-11-30", exitType: "completo" },
    ],
    events: [],
    isNew: false,
  },
  {
    id: "u4",
    handle: "rina",
    name: "Rina Salvador",
    location: "Manila, Filipinas",
    timezone: "GMT+8",
    headline: "Estudiante de ingeniería ambiental · Primer proyecto",
    skills: [
      { name: "Análisis de agua", verified: false },
      { name: "Python", verified: false },
    ],
    /** Cold start: cero evaluaciones. Nunca sería elegida sin las reglas de arranque. */
    reputation: rep([]),
    completionRate: null,
    memberships: [],
    events: [],
    isNew: true,
  },
  {
    id: "u5",
    handle: "diegom",
    name: "Diego Manzur",
    location: "Buenos Aires, Argentina",
    timezone: "GMT-3",
    headline: "Frontend · Interfaces de datos",
    skills: [
      { name: "React", verified: true },
      { name: "Visualización de datos", verified: true },
    ],
    reputation: rep([
      [4, 4], [4.5, 4], [4, 4.5], [3.5, 4], [4, 4], [4.5, 4.5], [4, 4],
      [4, 4.5], [4.5, 4], [4, 4],
    ]),
    completionRate: 0.67,
    memberships: [],
    events: [],
    isNew: false,
  },
  {
    id: "u6",
    handle: "nadia",
    name: "Nadia Okonkwo",
    location: "Lagos, Nigeria",
    timezone: "GMT+1",
    headline: "Datos y analítica · Salud pública",
    skills: [
      { name: "Python", verified: true },
      { name: "Estadística", verified: true },
    ],
    reputation: rep([
      [4.5, 4.5], [5, 4], [4.5, 4.5], [4, 4.5], [4.5, 5], [5, 4.5],
      [4.5, 4], [4, 4.5], [4.5, 4.5],
    ]),
    completionRate: 1,
    memberships: [],
    events: [],
    isNew: false,
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    slug: "agua-limpia",
    title: "Agua Limpia",
    summary:
      "Un sensor de bajo costo que mide contaminación del agua y avisa a la comunidad antes de que alguien se enferme.",
    description:
      "En los distritos donde trabajamos, el análisis de agua depende de que una brigada municipal pase cada tres meses. Cuando el resultado llega, la gente ya tomó esa agua durante semanas.\n\nEstamos construyendo un sensor que cuesta menos de veinte dólares, se instala en el punto de captación y manda una alerta por SMS cuando los valores se salen de rango. El hardware ya funciona en mesa. Lo que falta es que sobreviva en campo, que alguien entienda cómo lo va a usar una junta vecinal, y que los datos lleguen a algún lado.\n\nNo buscamos gente que quiera practicar. Buscamos gente que quiera que esto termine instalado.",
    sdg: { number: 6, label: "Agua limpia y saneamiento" },
    status: "activo",
    leaderId: "u1",
    modality: "remoto",
    area: "Hardware · Impacto social",
    createdAt: "2026-04-02",
    roles: [
      { id: "r1", projectId: "p1", title: "Backend", skills: ["Go", "MQTT", "PostgreSQL"], hoursPerWeek: 8, status: "cubierto", filledBy: "u2" },
      { id: "r2", projectId: "p1", title: "Investigación de campo", skills: ["Investigación de usuarios", "Trabajo de campo"], hoursPerWeek: 6, status: "cubierto", filledBy: "u3" },
      { id: "r3", projectId: "p1", title: "Frontend · Panel de alertas", skills: ["React", "Visualización de datos"], hoursPerWeek: 8, status: "abierto" },
      { id: "r4", projectId: "p1", title: "Análisis de datos", skills: ["Python", "Estadística"], hoursPerWeek: 5, status: "abierto" },
      { id: "r5", projectId: "p1", title: "Aprendiz · Documentación técnica", skills: ["Redacción técnica"], hoursPerWeek: 4, status: "abierto", reservedForNewcomers: true },
    ],
    members: [
      { userId: "u1", roleTitle: "Líder" },
      { userId: "u2", roleTitle: "Backend" },
      { userId: "u3", roleTitle: "Investigación de campo" },
    ],
    sprints: [
      {
        id: "s1", projectId: "p1", number: 1, startDate: "2026-04-16", endDate: "2026-05-06", status: "cerrado",
        milestones: [{ id: "m1", title: "Prototipo en protoboard midiendo turbidez", sprintNumber: 1, done: true }],
        deliverables: [],
      },
      {
        id: "s2", projectId: "p1", number: 2, startDate: "2026-05-07", endDate: "2026-05-27", status: "cerrado",
        milestones: [{ id: "m2", title: "Placa impresa v1 y carcasa estanca", sprintNumber: 2, done: true }],
        deliverables: [],
      },
      {
        id: "s3", projectId: "p1", number: 3, startDate: "2026-05-28", endDate: "2026-06-17", status: "cerrado",
        milestones: [{ id: "m3", title: "Envío de datos por MQTT desde el sensor", sprintNumber: 3, done: true }],
        deliverables: [],
      },
      {
        id: "s4", projectId: "p1", number: 4, startDate: "2026-07-23", endDate: "2026-08-12", status: "en-curso",
        milestones: [
          { id: "m4", title: "Panel web con lecturas en vivo", sprintNumber: 4, done: false },
          { id: "m5", title: "Entrevistas con dos juntas vecinales", sprintNumber: 4, done: true },
          { id: "m6", title: "Alerta por SMS funcionando de punta a punta", sprintNumber: 4, done: false },
        ],
        deliverables: [
          { id: "d1", sprintId: "s4", ownerId: "u2", description: "Endpoint de ingesta con reintentos", evidence: "PR #48", status: "entregado" },
          { id: "d2", sprintId: "s4", ownerId: "u3", description: "Notas de las entrevistas de campo", evidence: "Documento compartido", status: "entregado" },
          { id: "d3", sprintId: "s4", ownerId: "u2", description: "Integración con la pasarela de SMS", status: "en-progreso" },
        ],
      },
      {
        id: "s5", projectId: "p1", number: 5, startDate: "2026-08-13", endDate: "2026-09-02", status: "planificado",
        milestones: [{ id: "m7", title: "Piloto instalado en un punto real", sprintNumber: 5, done: false }],
        deliverables: [],
      },
      {
        id: "s6", projectId: "p1", number: 6, startDate: "2026-09-03", endDate: "2026-09-23", status: "planificado",
        milestones: [{ id: "m8", title: "Manual de instalación y traspaso a la comunidad", sprintNumber: 6, done: false }],
        deliverables: [],
      },
    ],
    applications: [
      { id: "a1", userId: "u5", roleId: "r3", message: "Trabajé dos años en paneles de monitoreo industrial. Lo que me interesa acá es que la lectura la va a mirar alguien que no es técnico, y eso cambia todo el diseño.", status: "pendiente", agreementSigned: true, appliedAt: "2026-08-01" },
      { id: "a2", userId: "u6", roleId: "r4", message: "Vengo de salud pública. He visto morir proyectos de sensores porque nadie definió qué contaba como valor fuera de rango. Me gustaría trabajar esa parte.", status: "pendiente", agreementSigned: true, appliedAt: "2026-08-03" },
      { id: "a3", userId: "u4", roleId: "r5", message: "Es mi primer proyecto acá. Estudio ingeniería ambiental y he hecho análisis de agua en laboratorio de la universidad. Puedo documentar lo que el equipo construya.", status: "pendiente", agreementSigned: true, appliedAt: "2026-08-04" },
    ],
    funding: { raised: 0, goal: 2400, backers: 0 },
  },
  {
    id: "p2",
    slug: "bitacora-docente",
    title: "Bitácora Docente",
    summary:
      "Una herramienta para que profesores de escuelas rurales registren asistencia sin conexión y sincronicen cuando llegue señal.",
    description:
      "Los profesores de escuelas rurales llevan la asistencia en cuadernos que se pierden, se mojan o nunca llegan a la dirección regional. Sin ese dato no hay presupuesto, y sin presupuesto no hay almuerzo escolar.\n\nQuiero construir algo que funcione en un teléfono viejo, sin datos, y que sincronice solo cuando el profesor baje al pueblo. La parte difícil no es técnica: es que el registro tome menos de treinta segundos al día, o nadie lo va a usar.\n\nEstoy empezando. Todavía no hay nadie más en el equipo.",
    sdg: { number: 4, label: "Educación de calidad" },
    status: "reclutando",
    leaderId: "u3",
    modality: "remoto",
    area: "Software · Educación",
    createdAt: "2026-08-01",
    roles: [
      { id: "r6", projectId: "p2", title: "Desarrollo móvil offline-first", skills: ["React Native", "SQLite"], hoursPerWeek: 8, status: "abierto" },
      { id: "r7", projectId: "p2", title: "Diseño de interacción", skills: ["Figma", "Diseño para baja alfabetización digital"], hoursPerWeek: 6, status: "abierto" },
      { id: "r8", projectId: "p2", title: "Aprendiz · Investigación", skills: ["Entrevistas"], hoursPerWeek: 4, status: "abierto", reservedForNewcomers: true },
    ],
    members: [{ userId: "u3", roleTitle: "Líder" }],
    sprints: [
      {
        id: "s7", projectId: "p2", number: 1, startDate: "2026-08-18", endDate: "2026-09-07", status: "planificado",
        milestones: [{ id: "m9", title: "Prototipo navegable validado con tres profesores", sprintNumber: 1, done: false }],
        deliverables: [],
      },
    ],
    /** Estado vacío: proyecto publicado sin una sola postulación. */
    applications: [],
    funding: { raised: 0, goal: 800, backers: 0 },
  },
  {
    id: "p3",
    slug: "ruta-segura",
    title: "Ruta Segura",
    summary:
      "Un mapa colaborativo de las calles que las mujeres del barrio evitan de noche, y por qué.",
    description:
      "La data de inseguridad que existe viene de denuncias formales, y la mayoría de las cosas que hacen que una calle dé miedo nunca se denuncian: el poste apagado, el terreno baldío, el grupo que se para en la esquina.\n\nQueremos recoger eso de forma anónima y devolvérselo al municipio como un mapa que se pueda accionar. Ya tenemos el acuerdo verbal de dos juntas vecinales.",
    sdg: { number: 11, label: "Ciudades y comunidades sostenibles" },
    status: "activo",
    leaderId: "u6",
    modality: "híbrido",
    area: "Datos · Seguridad urbana",
    createdAt: "2026-06-10",
    roles: [
      { id: "r9", projectId: "p3", title: "Frontend de mapas", skills: ["React", "Mapbox"], hoursPerWeek: 7, status: "abierto" },
      { id: "r10", projectId: "p3", title: "Análisis de datos", skills: ["Python", "Geoespacial"], hoursPerWeek: 6, status: "cubierto", filledBy: "u6" },
    ],
    members: [{ userId: "u6", roleTitle: "Líder" }],
    sprints: [
      { id: "s8", projectId: "p3", number: 1, startDate: "2026-06-15", endDate: "2026-07-05", status: "cerrado", milestones: [{ id: "m10", title: "Formulario anónimo de reporte", sprintNumber: 1, done: true }], deliverables: [] },
      { id: "s9", projectId: "p3", number: 2, startDate: "2026-07-06", endDate: "2026-07-26", status: "cerrado", milestones: [{ id: "m11", title: "Primeros 200 reportes recogidos", sprintNumber: 2, done: true }], deliverables: [] },
      { id: "s10", projectId: "p3", number: 3, startDate: "2026-07-27", endDate: "2026-08-16", status: "en-curso", milestones: [{ id: "m12", title: "Mapa de calor navegable", sprintNumber: 3, done: false }], deliverables: [] },
    ],
    applications: [],
    funding: { raised: 0, goal: 1200, backers: 0 },
  },
  {
    id: "p4",
    slug: "voz-quechua",
    title: "Voz Quechua",
    summary:
      "Un corpus de audio en quechua grabado por hablantes nativos, abierto para quien quiera entrenar modelos de voz.",
    description:
      "No existe reconocimiento de voz decente en quechua porque no existe la data. Las grandes empresas no la van a hacer: son ocho millones de hablantes que no son un mercado.\n\nEstamos grabando y etiquetando audio con hablantes de Cusco y Puno, y publicándolo con licencia abierta. El trabajo es tedioso y ese es justo el punto: nadie más lo va a hacer.",
    sdg: { number: 4, label: "Educación de calidad" },
    status: "reclutando",
    leaderId: "u5",
    modality: "remoto",
    area: "Datos · Lengua",
    createdAt: "2026-07-28",
    roles: [
      { id: "r11", projectId: "p4", title: "Ingeniería de audio", skills: ["Procesamiento de señal", "Python"], hoursPerWeek: 6, status: "abierto" },
      { id: "r12", projectId: "p4", title: "Coordinación con hablantes", skills: ["Quechua", "Trabajo de campo"], hoursPerWeek: 5, status: "abierto" },
      { id: "r13", projectId: "p4", title: "Aprendiz · Etiquetado", skills: ["Atención al detalle"], hoursPerWeek: 4, status: "abierto", reservedForNewcomers: true },
    ],
    members: [{ userId: "u5", roleTitle: "Líder" }],
    sprints: [
      { id: "s11", projectId: "p4", number: 1, startDate: "2026-08-20", endDate: "2026-09-09", status: "planificado", milestones: [{ id: "m13", title: "Protocolo de grabación y 10 horas de piloto", sprintNumber: 1, done: false }], deliverables: [] },
    ],
    applications: [],
    funding: { raised: 0, goal: 1500, backers: 0 },
  },
];

/**
 * Trayectoria por usuario. Todo lo que se cuenta aquí es un cierre:
 * sprints entregados, proyectos terminados, horas efectivamente
 * comprometidas. No hay puntos por entrar ni por invitar a nadie.
 */
export const trajectories: Record<string, Trajectory> = {
  u1: {
    projectsCompleted: 2,
    projectsJoined: 4,
    sprintsClosed: 14,
    onTimeStreak: 7,
    bestStreak: 9,
    hoursCommitted: 312,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: true },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: true },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: true },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: false },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: false },
    ],
  },
  u2: {
    projectsCompleted: 1,
    projectsJoined: 3,
    sprintsClosed: 8,
    onTimeStreak: 0,
    bestStreak: 4,
    hoursCommitted: 168,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: true },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: true },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: false },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: false },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: false },
    ],
  },
  u3: {
    projectsCompleted: 1,
    projectsJoined: 2,
    sprintsClosed: 9,
    onTimeStreak: 9,
    bestStreak: 9,
    hoursCommitted: 144,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: true },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: true },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: false },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: false },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: false },
    ],
  },
  u4: {
    projectsCompleted: 0,
    projectsJoined: 0,
    sprintsClosed: 0,
    onTimeStreak: 0,
    bestStreak: 0,
    hoursCommitted: 0,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: false },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: false },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: false },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: false },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: false },
    ],
  },
  u5: {
    projectsCompleted: 2,
    projectsJoined: 3,
    sprintsClosed: 10,
    onTimeStreak: 3,
    bestStreak: 6,
    hoursCommitted: 190,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: true },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: true },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: false },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: false },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: false },
    ],
  },
  u6: {
    projectsCompleted: 3,
    projectsJoined: 3,
    sprintsClosed: 12,
    onTimeStreak: 12,
    bestStreak: 12,
    hoursCommitted: 228,
    marks: [
      { id: "t1", label: "Primer cierre", description: "Cerraste tu primer sprint entregando lo comprometido", unlocked: true },
      { id: "t2", label: "Proyecto terminado", description: "Llegaste al final de un proyecto con el equipo", unlocked: true },
      { id: "t3", label: "Salida limpia", description: "Te retiraste avisando y entregando el avance", unlocked: false },
      { id: "t4", label: "Racha de diez", description: "Diez sprints seguidos entregados a tiempo", unlocked: true },
      { id: "t5", label: "Formó equipo", description: "Lideraste un proyecto que terminó sin que nadie hiciera ghosting", unlocked: true },
    ],
  },
};

/**
 * Micro-retos. Reemplazan a los "retos rápidos" del prototipo previo
 * ("invita a un amigo", "completa tu perfil"), que premiaban actividad.
 * Cada uno de estos tiene un entregable verificable y otorga reputación
 * inicial real, que es como el documento resuelve el cold start.
 */
export const microChallenges: MicroChallenge[] = [
  {
    id: "mc1",
    title: "Traducir la guía de instalación al quechua",
    description:
      "El manual del sensor está en español. Necesitamos una versión en quechua cusqueño que una junta vecinal pueda leer sin ayuda.",
    deliverable: "Documento traducido y revisado por un hablante nativo",
    hours: 5,
    projectTitle: "Agua Limpia",
    skills: ["Quechua", "Redacción"],
    takenBy: 1,
    slots: 2,
  },
  {
    id: "mc2",
    title: "Diseñar el ícono de alerta del panel",
    description:
      "Un ícono que se entienda sin texto y funcione a 16px en un teléfono viejo con pantalla rayada.",
    deliverable: "SVG en tres tamaños con las variantes de estado",
    hours: 3,
    projectTitle: "Agua Limpia",
    skills: ["Diseño de íconos"],
    takenBy: 0,
    slots: 1,
  },
  {
    id: "mc3",
    title: "Probar el formulario en cinco teléfonos distintos",
    description:
      "Necesitamos saber qué se rompe en Android 8 y en pantallas de menos de 5 pulgadas antes de salir a campo.",
    deliverable: "Reporte con capturas y lista de fallos reproducibles",
    hours: 4,
    projectTitle: "Ruta Segura",
    skills: ["QA", "Atención al detalle"],
    takenBy: 2,
    slots: 4,
  },
  {
    id: "mc4",
    title: "Escribir tres preguntas para la entrevista de campo",
    description:
      "Preguntas que no induzcan la respuesta. Vamos a entrevistar profesores rurales sobre cómo llevan la asistencia hoy.",
    deliverable: "Guion de entrevista con justificación de cada pregunta",
    hours: 2,
    projectTitle: "Bitácora Docente",
    skills: ["Investigación de usuarios"],
    takenBy: 0,
    slots: 3,
  },
];

export function getUser(handle: string): User | undefined {
  return users.find((u) => u.handle === handle);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
