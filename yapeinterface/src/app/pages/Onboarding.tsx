import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Users,
  Trophy,
  Zap,
  ChevronRight,
  Target,
  Award,
  TrendingUp
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Bienvenido a Yape Social",
    description: "La plataforma donde jóvenes peruanos generan impacto real en sus comunidades",
    icon: Heart,
    color: "from-purple-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Encuentra Proyectos",
    description: "Descubre iniciativas sociales alineadas a tus pasiones y habilidades",
    icon: Target,
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Colabora y Crece",
    description: "Trabaja en equipo, aprende nuevas habilidades y crea conexiones valiosas",
    icon: Users,
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Gana Experiencia",
    description: "Sube de nivel, desbloquea badges y destaca en rankings nacionales",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Genera Impacto",
    description: "Cada acción cuenta. Mide tu contribución a los ODS y transforma el Perú",
    icon: TrendingUp,
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] z-[100] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Skip Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={handleSkip}
            className="text-white/80 hover:text-white text-sm font-semibold"
          >
            Saltar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {/* Image */}
              <div className="relative mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="aspect-square max-w-xs mx-auto rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} opacity-40`} />
                </motion.div>

                {/* Icon Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${slide.color} shadow-2xl flex items-center justify-center`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="text-center text-white mt-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold mb-4"
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/90 leading-relaxed"
                >
                  {slide.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Section */}
        <div className="p-6 pb-8">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: currentSlide === index ? 32 : 8,
                  backgroundColor:
                    currentSlide === index
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full max-w-md mx-auto block bg-white text-[var(--yape-purple)] py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-2"
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Siguiente
                <ChevronRight className="w-6 h-6" />
              </>
            ) : (
              <>
                ¡Empezar!
                <Zap className="w-6 h-6" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
