import { motion } from "motion/react";
import {
  Settings,
  Share2,
  Star,
  Award,
  Trophy,
  Target,
  Heart,
  Users,
  Calendar,
  TrendingUp,
  Code,
  MessageSquare,
  Palette,
  CheckCircle2,
  Zap,
  Flame,
  Medal
} from "lucide-react";

const badges = [
  {
    name: "Iniciador",
    description: "Creó su primer proyecto",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    unlocked: true,
  },
  {
    name: "Eco-Warrior",
    description: "Participó en 5 proyectos ambientales",
    icon: Heart,
    color: "from-green-400 to-emerald-600",
    unlocked: true,
  },
  {
    name: "Streak Master",
    description: "30 días consecutivos activo",
    icon: Flame,
    color: "from-red-500 to-orange-600",
    unlocked: true,
  },
  {
    name: "Top Colaborador",
    description: "100+ horas de voluntariado",
    icon: Trophy,
    color: "from-purple-500 to-pink-600",
    unlocked: true,
  },
  {
    name: "ODS Champion",
    description: "Apoyó los 17 ODS",
    icon: Target,
    color: "from-blue-500 to-cyan-600",
    unlocked: false,
  },
  {
    name: "Líder Comunitario",
    description: "Lideró 3 proyectos exitosos",
    icon: Award,
    color: "from-indigo-500 to-purple-600",
    unlocked: false,
  },
];

const skills = [
  { name: "Programación", level: 85, icon: Code },
  { name: "Comunicación", level: 70, icon: MessageSquare },
  { name: "Diseño UX/UI", level: 60, icon: Palette },
];

const projectHistory = [
  {
    title: "Limpieza de Playas",
    role: "Voluntario",
    status: "Completado",
    rating: 5,
    date: "Abr 2026",
    impact: "+150 pts",
  },
  {
    title: "Tutorías Online",
    role: "Tutor",
    status: "En progreso",
    rating: null,
    date: "May 2026",
    impact: "En curso",
  },
  {
    title: "App de Reciclaje",
    role: "Developer",
    status: "Completado",
    rating: 5,
    date: "Mar 2026",
    impact: "+200 pts",
  },
];

const odsSupported = [
  { ods: "Educación de Calidad", count: 5, color: "bg-red-500" },
  { ods: "Acción por el Clima", count: 4, color: "bg-green-500" },
  { ods: "Salud y Bienestar", count: 3, color: "bg-blue-500" },
  { ods: "Paz y Justicia", count: 2, color: "bg-purple-500" },
];

export function Profile() {
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] text-white">
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[var(--yape-purple)] text-3xl font-bold border-4 border-white shadow-lg">
                  DR
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-white">
                  <span className="text-white font-bold text-sm">8</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Diego Ríos</h1>
                <p className="text-white/80 text-sm mb-2">
                  Universidad Peruana de Ciencias Aplicadas
                </p>
                <p className="text-white/80 text-sm">Ingeniería de Software</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-white/70">Proyectos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">2,450</div>
              <div className="text-xs text-white/70">Puntos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">#15</div>
              <div className="text-xs text-white/70">Ranking</div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="px-4 pb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5" />
                <span className="font-semibold">Nivel 8 - Activista</span>
              </div>
              <span className="text-sm">850 / 1000 XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--yape-turquoise)] to-white"
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2">
              150 XP más para alcanzar Nivel 9
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Badges Section */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--yape-purple)]" />
            Insignias y Logros
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className={`bg-white rounded-2xl p-4 text-center shadow-sm ${
                  !badge.unlocked && "opacity-50 grayscale"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 shadow-lg`}
                >
                  <badge.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xs mb-1">{badge.name}</h3>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--yape-purple)]" />
            Habilidades
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <skill.icon className="w-4 h-4 text-[var(--yape-purple)]" />
                    <span className="text-sm font-semibold">{skill.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--yape-purple)]">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-lilac)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.3 + 0.1 * index }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project History */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--yape-purple)]" />
            Historial de Proyectos
          </h2>
          <div className="space-y-3">
            {projectHistory.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {project.role}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      project.status === "Completado"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {project.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < project.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {project.date}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--yape-turquoise)]">
                    {project.impact}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ODS Supported */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--yape-purple)]" />
            ODS Más Apoyados
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            {odsSupported.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{item.ods}</span>
                    <span className="text-sm font-bold text-[var(--yape-purple)]">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.count / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reputation Section */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--yape-purple)]" />
            Reputación
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Calificación General</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-bold text-lg">5.0</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Responsabilidad", value: 5 },
                { label: "Compromiso", value: 5 },
                { label: "Liderazgo", value: 4.5 },
                { label: "Trabajo en equipo", value: 5 },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-[var(--yape-purple)]">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
