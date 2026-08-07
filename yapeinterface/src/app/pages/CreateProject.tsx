import { useState } from "react";
import { motion } from "motion/react";
import {
  Leaf,
  GraduationCap,
  Laptop,
  Heart,
  Shield,
  Scale,
  UserCheck,
  Target,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Code,
  Palette,
  MessageSquare,
  BarChart,
  Gavel,
  Brain,
  Users,
  CheckCircle2
} from "lucide-react";

const odsOptions = [
  "Fin de la Pobreza",
  "Hambre Cero",
  "Salud y Bienestar",
  "Educación de Calidad",
  "Igualdad de Género",
  "Agua Limpia",
  "Energía Asequible",
  "Trabajo Decente",
  "Industria e Innovación",
  "Reducción de Desigualdades",
  "Ciudades Sostenibles",
  "Consumo Responsable",
  "Acción por el Clima",
  "Vida Submarina",
  "Vida Terrestre",
  "Paz y Justicia",
  "Alianzas",
];

const skillsOptions = [
  { name: "Programación", icon: Code },
  { name: "Marketing", icon: MessageSquare },
  { name: "Diseño UX/UI", icon: Palette },
  { name: "Derecho", icon: Gavel },
  { name: "Comunicación", icon: MessageSquare },
  { name: "Data Science", icon: BarChart },
  { name: "Psicología", icon: Brain },
  { name: "Gestión Pública", icon: Briefcase },
];

const categories = [
  { id: "environment", name: "Medio Ambiente", icon: Leaf },
  { id: "education", name: "Educación", icon: GraduationCap },
  { id: "tech", name: "Tecnología Social", icon: Laptop },
  { id: "health", name: "Salud Mental", icon: Heart },
  { id: "corruption", name: "Anti-Corrupción", icon: Shield },
  { id: "inclusion", name: "Inclusión Social", icon: UserCheck },
  { id: "security", name: "Seguridad Ciudadana", icon: Scale },
];

export function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    ods: "",
    category: "",
    modality: "",
    roles: [] as string[],
    startDate: "",
    duration: "",
    commitment: "",
    selectedSkills: [] as string[],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const handleSubmit = () => {
    console.log("Proyecto creado:", formData);
    alert("¡Proyecto creado exitosamente! 🎉");
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Crear Proyecto Social</h1>
        <p className="text-white/80 text-sm">
          Comparte tu idea y encuentra colaboradores comprometidos
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  step <= currentStep
                    ? "bg-white text-[var(--yape-purple)]"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    step < currentStep ? "bg-white" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-screen-lg mx-auto">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg mb-4">Información Básica</h2>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Limpieza de Playas en Lima"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Descripción *
                </label>
                <textarea
                  placeholder="Describe tu proyecto en pocas palabras"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  ¿Qué problema busca resolver? *
                </label>
                <textarea
                  placeholder="Explica el problema social que quieres abordar"
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.id })
                      }
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        formData.category === cat.id
                          ? "border-[var(--yape-purple)] bg-[var(--yape-lilac-light)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <cat.icon className="w-5 h-5 text-[var(--yape-purple)]" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  ODS Relacionado *
                </label>
                <select
                  value={formData.ods}
                  onChange={(e) => setFormData({ ...formData, ods: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                >
                  <option value="">Selecciona un ODS</option>
                  {odsOptions.map((ods) => (
                    <option key={ods} value={ods}>
                      {ods}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Team & Skills */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg mb-4">Equipo y Habilidades</h2>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Habilidades Solicitadas *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {skillsOptions.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => handleSkillToggle(skill.name)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        formData.selectedSkills.includes(skill.name)
                          ? "border-[var(--yape-purple)] bg-[var(--yape-lilac-light)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <skill.icon className="w-5 h-5 text-[var(--yape-purple)]" />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Roles Específicos
                </label>
                <input
                  type="text"
                  placeholder="Ej: Community Manager, Diseñador Gráfico"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separa los roles con comas
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Modalidad *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Virtual", "Presencial", "Híbrido"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() =>
                        setFormData({ ...formData, modality: mode })
                      }
                      className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                        formData.modality === mode
                          ? "border-[var(--yape-purple)] bg-[var(--yape-lilac-light)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {formData.modality === "Presencial" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Ubicación
                  </label>
                  <input
                    type="text"
                    placeholder="Distrito o dirección"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Timeline & Commitment */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg mb-4">Cronograma</h2>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duración Estimada *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)]"
                >
                  <option value="">Selecciona duración</option>
                  <option value="1-week">1 semana</option>
                  <option value="2-weeks">2 semanas</option>
                  <option value="1-month">1 mes</option>
                  <option value="2-months">2 meses</option>
                  <option value="3-months">3 meses</option>
                  <option value="6-months">6 meses</option>
                  <option value="ongoing">Indefinido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Nivel de Compromiso *
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "low",
                      label: "Bajo",
                      desc: "1-2 horas por semana",
                    },
                    {
                      value: "medium",
                      label: "Medio",
                      desc: "3-5 horas por semana",
                    },
                    {
                      value: "high",
                      label: "Alto",
                      desc: "6+ horas por semana",
                    },
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() =>
                        setFormData({ ...formData, commitment: level.value })
                      }
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.commitment === level.value
                          ? "border-[var(--yape-purple)] bg-[var(--yape-lilac-light)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold">{level.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {level.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[var(--yape-lilac-light)] to-[var(--yape-turquoise)]/20 rounded-xl p-4">
                <p className="text-sm">
                  <strong>💡 Tip:</strong> Proyectos con objetivos claros y
                  cronogramas realistas tienen 3x más postulantes comprometidos.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex-1 py-3 bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-[var(--yape-turquoise)] to-[var(--yape-turquoise-dark)] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Crear Proyecto 🚀
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
