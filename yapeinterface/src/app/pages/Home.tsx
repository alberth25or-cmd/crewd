import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Target,
  Heart,
  Leaf,
  GraduationCap,
  Zap,
  ChevronRight,
  Star,
  Award,
  Trophy,
  Plus
} from "lucide-react";
import { RatingModal } from "../components/RatingModal";

export function Home() {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const stats = [
    { label: "Proyectos", value: 12, icon: Target, color: "text-[var(--yape-purple)]" },
    { label: "Impacto", value: 850, icon: Heart, color: "text-[var(--yape-turquoise)]" },
    { label: "Nivel", value: 8, icon: TrendingUp, color: "text-[var(--yape-lilac)]" },
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "Limpieza de Playas Lima",
      leader: "María García",
      category: "Medio Ambiente",
      ods: "Vida Submarina",
      members: 45,
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 2,
      title: "Tutorías Online Gratuitas",
      leader: "Carlos Mendoza",
      category: "Educación",
      ods: "Educación de Calidad",
      members: 32,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 3,
      title: "App de Salud Mental",
      leader: "Andrea Solis",
      category: "Tecnología Social",
      ods: "Salud y Bienestar",
      members: 18,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const quickChallenges = [
    { title: "Dona 1 hora de voluntariado", points: 50, icon: Heart },
    { title: "Completa tu perfil", points: 30, icon: Star },
    { title: "Invita a un amigo", points: 100, icon: Users },
  ];

  const topLeaders = [
    { name: "Ana Torres", points: 2450, level: 15, avatar: "AT" },
    { name: "Luis Romero", points: 2180, level: 14, avatar: "LR" },
    { name: "Sofia Castro", points: 2050, level: 13, avatar: "SC" },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen relative">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] text-white px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-1">¡Hola, Diego! 👋</h1>
          <p className="text-white/80 text-sm mb-6">
            Estás generando un impacto increíble
          </p>

          {/* Level Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Nivel 8 - Activista</span>
              <span className="text-sm">850 / 1000 XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--yape-turquoise)] to-white"
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Challenges */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Retos Rápidos ⚡</h2>
            <button className="text-[var(--yape-purple)] text-sm font-semibold">
              Ver todos
            </button>
          </div>
          <div className="space-y-2">
            {quickChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--yape-purple-light)] to-[var(--yape-lilac)] flex items-center justify-center">
                    <challenge.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{challenge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      +{challenge.points} puntos
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Proyectos Destacados 🌟</h2>
            <button className="text-[var(--yape-purple)] text-sm font-semibold">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="relative h-40">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60`} />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center text-white text-xs font-bold">
                        {project.leader.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{project.leader}</p>
                        <p className="text-xs text-muted-foreground">Líder</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">{project.members}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-[var(--yape-turquoise)]" />
                    <span className="text-xs text-muted-foreground">
                      ODS: {project.ods}
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-shadow">
                    Postular
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Leaders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Top Líderes 🏆</h2>
            <button className="text-[var(--yape-purple)] text-sm font-semibold">
              Ver ranking
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {topLeaders.map((leader, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center text-white font-bold">
                      {leader.avatar}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        {index === 0 ? (
                          <Trophy className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Award className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{leader.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Nivel {leader.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--yape-purple)]">
                    {leader.points}
                  </p>
                  <p className="text-xs text-muted-foreground">puntos</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowRatingModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        projectName="Limpieza de Playas Lima"
        teamMembers={[
          { id: 1, name: "María García", avatar: "MG", role: "Coordinadora" },
          { id: 2, name: "Carlos Mendoza", avatar: "CM", role: "Voluntario" },
          { id: 3, name: "Ana Torres", avatar: "AT", role: "Logística" },
        ]}
      />
    </div>
  );
}
