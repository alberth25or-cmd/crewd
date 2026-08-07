import { useState } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Target,
  TrendingUp,
  Crown,
  Star,
  Flame,
  Building2
} from "lucide-react";

const categories = [
  { id: "leaders", name: "Líderes", icon: Trophy },
  { id: "volunteers", name: "Voluntarios", icon: Users },
  { id: "universities", name: "Universidades", icon: Building2 },
  { id: "projects", name: "Proyectos", icon: Target },
];

const topLeaders = [
  {
    rank: 1,
    name: "Ana Torres",
    avatar: "AT",
    university: "PUCP",
    points: 5450,
    level: 22,
    projects: 18,
    streak: 45,
    badges: 12,
  },
  {
    rank: 2,
    name: "Luis Romero",
    avatar: "LR",
    university: "UPC",
    points: 4980,
    level: 20,
    projects: 15,
    streak: 38,
    badges: 10,
  },
  {
    rank: 3,
    name: "Sofia Castro",
    avatar: "SC",
    university: "UNMSM",
    points: 4720,
    level: 19,
    projects: 16,
    streak: 42,
    badges: 11,
  },
  {
    rank: 4,
    name: "Carlos Mendoza",
    avatar: "CM",
    university: "UNI",
    points: 4350,
    level: 18,
    projects: 14,
    streak: 30,
    badges: 9,
  },
  {
    rank: 5,
    name: "María García",
    avatar: "MG",
    university: "ULIMA",
    points: 4180,
    level: 18,
    projects: 13,
    streak: 35,
    badges: 8,
  },
];

const topUniversities = [
  {
    rank: 1,
    name: "PUCP",
    fullName: "Pontificia Universidad Católica del Perú",
    students: 450,
    projects: 89,
    points: 45800,
    color: "from-red-500 to-red-600",
  },
  {
    rank: 2,
    name: "UPC",
    fullName: "Universidad Peruana de Ciencias Aplicadas",
    students: 420,
    projects: 82,
    points: 42300,
    color: "from-red-600 to-orange-600",
  },
  {
    rank: 3,
    name: "UNMSM",
    fullName: "Universidad Nacional Mayor de San Marcos",
    students: 380,
    projects: 75,
    points: 38900,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    rank: 4,
    name: "UNI",
    fullName: "Universidad Nacional de Ingeniería",
    students: 320,
    projects: 68,
    points: 34200,
    color: "from-blue-500 to-blue-600",
  },
  {
    rank: 5,
    name: "ULIMA",
    fullName: "Universidad de Lima",
    students: 290,
    projects: 62,
    points: 31500,
    color: "from-green-500 to-green-600",
  },
];

const topProjects = [
  {
    rank: 1,
    name: "Plataforma Anti-Corrupción",
    leader: "Sofia Castro",
    category: "Tecnología Social",
    members: 45,
    impact: 9500,
    rating: 5.0,
    color: "from-purple-500 to-purple-600",
  },
  {
    rank: 2,
    name: "Red de Tutorías Gratuitas",
    leader: "Carlos Mendoza",
    category: "Educación",
    members: 38,
    impact: 8900,
    rating: 4.9,
    color: "from-blue-500 to-blue-600",
  },
  {
    rank: 3,
    name: "Reforestación Nacional",
    leader: "Ana Torres",
    category: "Medio Ambiente",
    members: 52,
    impact: 8700,
    rating: 4.8,
    color: "from-green-500 to-green-600",
  },
  {
    rank: 4,
    name: "Salud Mental Universitaria",
    leader: "Luis Romero",
    category: "Salud",
    members: 30,
    impact: 7800,
    rating: 4.9,
    color: "from-pink-500 to-pink-600",
  },
  {
    rank: 5,
    name: "Espacios Seguros para Mujeres",
    leader: "María García",
    category: "Inclusión",
    members: 28,
    impact: 7200,
    rating: 5.0,
    color: "from-orange-500 to-orange-600",
  },
];

const topVolunteers = [
  {
    rank: 1,
    name: "Diego Ríos",
    avatar: "DR",
    university: "UPC",
    hours: 156,
    projects: 12,
    rating: 5.0,
  },
  {
    rank: 2,
    name: "Andrea Solis",
    avatar: "AS",
    university: "PUCP",
    hours: 142,
    projects: 10,
    rating: 4.9,
  },
  {
    rank: 3,
    name: "Martín Silva",
    avatar: "MS",
    university: "UNMSM",
    hours: 138,
    projects: 11,
    rating: 4.8,
  },
  {
    rank: 4,
    name: "Laura Flores",
    avatar: "LF",
    university: "UNI",
    hours: 125,
    projects: 9,
    rating: 5.0,
  },
  {
    rank: 5,
    name: "Pedro Vargas",
    avatar: "PV",
    university: "ULIMA",
    hours: 118,
    projects: 8,
    rating: 4.7,
  },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
  return null;
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return "from-yellow-400 to-orange-500";
  if (rank === 2) return "from-gray-300 to-gray-400";
  if (rank === 3) return "from-orange-400 to-orange-600";
  return "from-[var(--yape-purple)] to-[var(--yape-lilac)]";
};

export function Rankings() {
  const [selectedCategory, setSelectedCategory] = useState("leaders");

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] text-white px-4 py-8">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">Rankings</h1>
          <p className="text-white/80">
            Los jóvenes que están cambiando el Perú
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 max-w-screen-lg mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Top Leaders */}
        {selectedCategory === "leaders" && (
          <motion.div
            key="leaders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Podium */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[topLeaders[1], topLeaders[0], topLeaders[2]].map(
                (leader, index) => {
                  const actualRank = leader.rank;
                  const podiumOrder = [2, 1, 3];
                  const height = actualRank === 1 ? "h-32" : actualRank === 2 ? "h-24" : "h-20";
                  return (
                    <div
                      key={leader.rank}
                      className={`flex flex-col items-center ${
                        actualRank === 1 ? "order-2" : actualRank === 2 ? "order-1" : "order-3"
                      }`}
                    >
                      <div className="relative mb-2">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRankBadgeColor(
                            actualRank
                          )} flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg ${
                            actualRank === 1 ? "w-20 h-20" : ""
                          }`}
                        >
                          {leader.avatar}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          {getRankIcon(actualRank)}
                        </div>
                      </div>
                      <div
                        className={`${height} w-full bg-gradient-to-br ${getRankBadgeColor(
                          actualRank
                        )} rounded-t-2xl flex flex-col items-center justify-center text-white`}
                      >
                        <div className="text-2xl font-bold mb-1">#{actualRank}</div>
                        <div className="text-xs font-semibold text-center px-2">
                          {leader.name.split(" ")[0]}
                        </div>
                        <div className="text-xs opacity-80">{leader.points}</div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Full List */}
            <div className="space-y-3">
              {topLeaders.map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    leader.rank <= 3 ? "ring-2 ring-yellow-400/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankBadgeColor(
                          leader.rank
                        )} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {leader.avatar}
                      </div>
                      {leader.rank <= 3 && (
                        <div className="absolute -top-1 -right-1">
                          {getRankIcon(leader.rank)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{leader.name}</h3>
                        {leader.streak >= 30 && (
                          <Flame className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {leader.university} • Nivel {leader.level}
                      </p>
                      <div className="flex gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {leader.projects} proyectos
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {leader.badges} badges
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--yape-purple)]">
                        #{leader.rank}
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        {leader.points} pts
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Volunteers */}
        {selectedCategory === "volunteers" && (
          <motion.div
            key="volunteers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {topVolunteers.map((volunteer, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-4 shadow-sm ${
                  volunteer.rank <= 3 ? "ring-2 ring-[var(--yape-turquoise)]/30" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankBadgeColor(
                        volunteer.rank
                      )} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {volunteer.avatar}
                    </div>
                    {volunteer.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        {getRankIcon(volunteer.rank)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{volunteer.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {volunteer.university}
                    </p>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {volunteer.rating}
                      </span>
                      <span>{volunteer.projects} proyectos</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--yape-turquoise)]">
                      {volunteer.hours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      voluntariado
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Top Universities */}
        {selectedCategory === "universities" && (
          <motion.div
            key="universities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {topUniversities.map((uni, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                  uni.rank <= 3 ? "ring-2 ring-blue-400/30" : ""
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${uni.color}`} />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${uni.color} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        #{uni.rank}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{uni.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {uni.fullName}
                        </p>
                      </div>
                    </div>
                    {uni.rank <= 3 && getRankIcon(uni.rank)}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--yape-purple)]">
                        {uni.students}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        estudiantes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--yape-turquoise)]">
                        {uni.projects}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        proyectos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--yape-lilac)]">
                        {uni.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">puntos</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Top Projects */}
        {selectedCategory === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {topProjects.map((project, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                  project.rank <= 3 ? "ring-2 ring-purple-400/30" : ""
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${project.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-bold`}
                        >
                          #{project.rank}
                        </div>
                        {project.rank <= 3 && getRankIcon(project.rank)}
                      </div>
                      <h3 className="font-bold mb-1">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Por {project.leader} • {project.category}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.members} miembros
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {project.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--yape-purple)]">
                        {project.impact.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        impacto
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
