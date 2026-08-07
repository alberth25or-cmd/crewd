import { useState } from "react";
import { motion } from "motion/react";
import {
  Zap,
  Heart,
  Clock,
  Target,
  Award,
  MapPin,
  Calendar,
  Users,
  Flame,
  CheckCircle2,
  TrendingUp,
  Star,
  ChevronRight,
  Filter
} from "lucide-react";

const dailyMissions = [
  {
    id: 1,
    title: "Completa tu perfil al 100%",
    description: "Agrega tu foto, bio y habilidades",
    xp: 50,
    progress: 80,
    completed: false,
    icon: Star,
  },
  {
    id: 2,
    title: "Postula a un proyecto",
    description: "Encuentra un proyecto que te apasione",
    xp: 100,
    progress: 0,
    completed: false,
    icon: Target,
  },
  {
    id: 3,
    title: "Invita a un amigo",
    description: "Comparte Yape Social con alguien más",
    xp: 150,
    progress: 0,
    completed: false,
    icon: Users,
  },
];

const quickChallenges = [
  {
    id: 1,
    title: "Limpieza de Parque Kennedy",
    organization: "Municipalidad de Miraflores",
    type: "Voluntariado",
    category: "Medio Ambiente",
    duration: "2 horas",
    date: "Sábado 25 May",
    time: "9:00 AM",
    location: "Parque Kennedy, Miraflores",
    spots: 15,
    spotsTotal: 30,
    xp: 200,
    badge: "Eco Warrior",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=300&fit=crop",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 2,
    title: "Hackathon Cívico: Apps para la Ciudad",
    organization: "Code for Peru",
    type: "Evento",
    category: "Tecnología Social",
    duration: "8 horas",
    date: "Domingo 26 May",
    time: "10:00 AM",
    location: "Virtual - Zoom",
    spots: 8,
    spotsTotal: 50,
    xp: 500,
    badge: "Tech Innovator",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Taller de Primeros Auxilios",
    organization: "Cruz Roja Peruana",
    type: "Capacitación",
    category: "Salud",
    duration: "3 horas",
    date: "Viernes 24 May",
    time: "6:00 PM",
    location: "San Isidro",
    spots: 5,
    spotsTotal: 25,
    xp: 300,
    badge: "Life Saver",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    color: "from-red-500 to-pink-600",
  },
  {
    id: 4,
    title: "Mentoría Virtual a Escolares",
    organization: "Enseña Perú",
    type: "Reto Rápido",
    category: "Educación",
    duration: "1 hora",
    date: "Hoy",
    time: "Flexible",
    location: "Virtual",
    spots: 20,
    spotsTotal: 40,
    xp: 150,
    badge: "Mentor",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 5,
    title: "Recolección de Donaciones",
    organization: "Caritas del Perú",
    type: "Voluntariado",
    category: "Inclusión Social",
    duration: "4 horas",
    date: "Sábado 25 May",
    time: "2:00 PM",
    location: "Cercado de Lima",
    spots: 12,
    spotsTotal: 20,
    xp: 250,
    badge: "Helper",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    color: "from-orange-500 to-red-600",
  },
];

const streakData = {
  current: 15,
  longest: 23,
  goal: 30,
};

const weekProgress = [
  { day: "L", completed: true },
  { day: "M", completed: true },
  { day: "X", completed: true },
  { day: "J", completed: true },
  { day: "V", completed: true },
  { day: "S", completed: false },
  { day: "D", completed: false },
];

export function Challenges() {
  const [filter, setFilter] = useState<string>("all");

  const filteredChallenges =
    filter === "all"
      ? quickChallenges
      : quickChallenges.filter((c) => c.type === filter);

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Streak Banner */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{streakData.current} días</h2>
              <p className="text-white/80 text-sm">Racha actual</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{streakData.longest}</div>
            <p className="text-white/80 text-xs">Mejor racha</p>
          </div>
        </div>

        {/* Week Progress */}
        <div className="flex gap-2 mb-3">
          {weekProgress.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center mb-1 transition-all ${
                  day.completed
                    ? "bg-white text-orange-500 font-bold shadow-lg scale-110"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {day.completed ? <CheckCircle2 className="w-5 h-5" /> : day.day}
              </div>
              <span className="text-xs text-white/70">{day.day}</span>
            </div>
          ))}
        </div>

        {/* Progress to Goal */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Meta: {streakData.goal} días</span>
            <span>{streakData.current} / {streakData.goal}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${(streakData.current / streakData.goal) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Daily Missions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--yape-purple)]" />
              Misiones Diarias
            </h2>
            <span className="text-sm text-muted-foreground">
              {dailyMissions.filter((m) => m.completed).length}/{dailyMissions.length}
            </span>
          </div>
          <div className="space-y-3">
            {dailyMissions.map((mission) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-2xl p-4 shadow-sm ${
                  mission.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center">
                    <mission.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {mission.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--yape-turquoise)]">
                      +{mission.xp}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                </div>
                {!mission.completed && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progreso</span>
                      <span>{mission.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-turquoise)]"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Filter Tabs */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--yape-purple)]" />
              Oportunidades Disponibles
            </h2>
            <button className="text-[var(--yape-purple)] text-sm font-semibold flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {[
              { id: "all", label: "Todos" },
              { id: "Voluntariado", label: "Voluntariados" },
              { id: "Evento", label: "Eventos" },
              { id: "Reto Rápido", label: "Retos Rápidos" },
              { id: "Capacitación", label: "Capacitaciones" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? "bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white shadow-md"
                    : "bg-white text-gray-700 shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Challenges Grid */}
        <section className="space-y-4">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Image Header */}
              <div className="relative h-40">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${challenge.color} opacity-50`}
                />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full">
                    {challenge.type}
                  </span>
                  <div className="flex flex-col gap-2 items-end">
                    <span className="bg-[var(--yape-turquoise)] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{challenge.xp} XP
                    </span>
                    {challenge.badge && (
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {challenge.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {challenge.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {challenge.organization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {challenge.category}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-gray-600">
                      {challenge.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-gray-600">
                      {challenge.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-gray-600 truncate">
                      {challenge.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-gray-600">
                      {challenge.spots} cupos libres
                    </span>
                  </div>
                </div>

                {/* Spots Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Cupos disponibles</span>
                    <span>
                      {challenge.spotsTotal - challenge.spots}/{challenge.spotsTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${challenge.color}`}
                      style={{
                        width: `${
                          ((challenge.spotsTotal - challenge.spots) /
                            challenge.spotsTotal) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                  Inscribirme
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Stats Summary */}
        <section>
          <div className="bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tu Impacto Este Mes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">8</div>
                <div className="text-xs text-white/80">Retos completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24h</div>
                <div className="text-xs text-white/80">Horas donadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1.2K</div>
                <div className="text-xs text-white/80">XP ganados</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
