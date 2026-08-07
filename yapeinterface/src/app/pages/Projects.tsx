import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
  Target,
  Bookmark,
  Calendar,
  Leaf,
  GraduationCap,
  Laptop,
  Heart,
  Shield,
  Scale,
  UserCheck
} from "lucide-react";

const categories = [
  { id: "all", name: "Todos", icon: Target },
  { id: "environment", name: "Medio Ambiente", icon: Leaf },
  { id: "education", name: "Educación", icon: GraduationCap },
  { id: "tech", name: "Tecnología", icon: Laptop },
  { id: "health", name: "Salud Mental", icon: Heart },
  { id: "corruption", name: "Anti-Corrupción", icon: Shield },
  { id: "inclusion", name: "Inclusión", icon: UserCheck },
  { id: "security", name: "Seguridad", icon: Scale },
];

const filters = [
  { id: "near", label: "Cerca de mí" },
  { id: "virtual", label: "Virtual" },
  { id: "presencial", label: "Presencial" },
  { id: "popular", label: "Más populares" },
  { id: "new", label: "Nuevos" },
];

const allProjects = [
  {
    id: 1,
    title: "Reforestación en Villa El Salvador",
    leader: "Ana Torres",
    leaderAvatar: "AT",
    category: "environment",
    categoryLabel: "Medio Ambiente",
    ods: "Acción por el Clima",
    description: "Plantar 500 árboles en zonas deforestadas del distrito",
    skills: ["Trabajo en equipo", "Compromiso ambiental"],
    members: 45,
    maxMembers: 60,
    status: "En progreso",
    location: "Presencial - Villa El Salvador",
    startDate: "15 Jun 2026",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Clases de Programación para Niños",
    leader: "Carlos Mendoza",
    leaderAvatar: "CM",
    category: "education",
    categoryLabel: "Educación",
    ods: "Educación de Calidad",
    description: "Enseñar Python básico a niños de 10-14 años los sábados",
    skills: ["Programación", "Pedagogía", "Comunicación"],
    members: 12,
    maxMembers: 15,
    status: "Reclutando",
    location: "Virtual",
    startDate: "1 Jun 2026",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "App de Denuncias Ciudadanas",
    leader: "Sofia Castro",
    leaderAvatar: "SC",
    category: "tech",
    categoryLabel: "Tecnología Social",
    ods: "Paz y Justicia",
    description: "Desarrollar plataforma web para reportar casos de corrupción",
    skills: ["React", "Node.js", "UX/UI", "Derecho"],
    members: 8,
    maxMembers: 12,
    status: "En progreso",
    location: "Virtual",
    startDate: "20 May 2026",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Talleres de Salud Mental Universitaria",
    leader: "Diego Ríos",
    leaderAvatar: "DR",
    category: "health",
    categoryLabel: "Salud Mental",
    ods: "Salud y Bienestar",
    description: "Espacios seguros para estudiantes con ansiedad y estrés académico",
    skills: ["Psicología", "Empatía", "Facilitación"],
    members: 25,
    maxMembers: 30,
    status: "Activo",
    location: "Presencial - PUCP",
    startDate: "10 Jun 2026",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Observatorio de Gasto Público",
    leader: "Laura Flores",
    leaderAvatar: "LF",
    category: "corruption",
    categoryLabel: "Anti-Corrupción",
    ods: "Paz y Justicia",
    description: "Monitorear y transparentar el uso de presupuesto municipal",
    skills: ["Data Science", "Periodismo", "Análisis"],
    members: 15,
    maxMembers: 20,
    status: "Reclutando",
    location: "Híbrido",
    startDate: "25 Jun 2026",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Reciclatón Comunitario Mensual",
    leader: "Martín Silva",
    leaderAvatar: "MS",
    category: "environment",
    categoryLabel: "Medio Ambiente",
    ods: "Ciudades Sostenibles",
    description: "Organizar jornadas de reciclaje en barrios de Lima Norte",
    skills: ["Organización", "Logística", "Marketing"],
    members: 38,
    maxMembers: 50,
    status: "Activo",
    location: "Presencial - Los Olivos",
    startDate: "5 Jun 2026",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
  },
];

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProjects, setSavedProjects] = useState<number[]>([]);

  const filteredProjects = allProjects.filter((project) => {
    if (selectedCategory !== "all" && project.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleSave = (projectId: number) => {
    setSavedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200">
        <div className="p-4 max-w-screen-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--yape-purple)] text-white rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
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

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 max-w-screen-lg mx-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() =>
                setSelectedFilter(selectedFilter === filter.id ? null : filter.id)
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? "bg-[var(--yape-turquoise)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-4 space-y-4 max-w-screen-lg mx-auto">
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length} proyectos encontrados
        </p>
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Image Header */}
            <div className="relative h-48">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button
                onClick={() => toggleSave(project.id)}
                className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    savedProjects.includes(project.id)
                      ? "fill-[var(--yape-purple)] text-[var(--yape-purple)]"
                      : "text-gray-700"
                  }`}
                />
              </button>
              <div className="absolute top-3 left-3">
                <span className="bg-[var(--yape-turquoise)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {project.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-lg mb-1">
                  {project.title}
                </h3>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {project.categoryLabel}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Leader */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center text-white text-sm font-bold">
                  {project.leaderAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{project.leader}</p>
                  <p className="text-xs text-muted-foreground">Líder del proyecto</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>

              {/* ODS */}
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[var(--yape-turquoise)]" />
                <span className="text-xs text-muted-foreground">ODS: {project.ods}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[var(--yape-lilac-light)] text-[var(--yape-purple-dark)] text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-gray-600">
                    {project.members}/{project.maxMembers} miembros
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-gray-600">{project.startDate}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-gray-600">{project.location}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progreso de reclutamiento</span>
                  <span>
                    {Math.round((project.members / project.maxMembers) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-turquoise)]"
                    style={{
                      width: `${(project.members / project.maxMembers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow">
                Postular al Proyecto
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
