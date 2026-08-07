import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Send } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  teamMembers: Array<{
    id: number;
    name: string;
    avatar: string;
    role: string;
  }>;
}

const ratingCategories = [
  { id: "responsibility", label: "Responsabilidad" },
  { id: "commitment", label: "Compromiso" },
  { id: "leadership", label: "Liderazgo" },
  { id: "teamwork", label: "Trabajo en equipo" },
  { id: "punctuality", label: "Puntualidad" },
];

export function RatingModal({
  isOpen,
  onClose,
  projectName,
  teamMembers,
}: RatingModalProps) {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const currentMember = teamMembers[currentMemberIndex];

  const handleRating = (category: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [`${currentMember.id}-${category}`]: rating,
    }));
  };

  const getRating = (category: string) => {
    return ratings[`${currentMember.id}-${category}`] || 0;
  };

  const handleNext = () => {
    if (currentMemberIndex < teamMembers.length - 1) {
      setCurrentMemberIndex((prev) => prev + 1);
      setComment("");
    } else {
      alert("¡Gracias por calificar a tu equipo! 🎉");
      onClose();
    }
  };

  const isCurrentMemberRated = ratingCategories.every(
    (cat) => getRating(cat.id) > 0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-3xl z-50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">Califica a tu equipo</h2>
                  <p className="text-white/80 text-sm">{projectName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {teamMembers.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      index <= currentMemberIndex
                        ? "bg-white"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMember.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Member Info */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--yape-purple)] to-[var(--yape-lilac)] flex items-center justify-center text-white text-xl font-bold">
                      {currentMember.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{currentMember.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentMember.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating Categories */}
                  <div className="space-y-6 mb-6">
                    {ratingCategories.map((category) => (
                      <div key={category.id}>
                        <label className="block text-sm font-semibold mb-3">
                          {category.label}
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRating(category.id, rating)}
                              className="flex-1 aspect-square transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-full h-full transition-colors ${
                                  rating <= getRating(category.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Comentario (opcional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comparte tu experiencia trabajando con este miembro..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--yape-purple)] resize-none"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                <span>
                  Miembro {currentMemberIndex + 1} de {teamMembers.length}
                </span>
                {!isCurrentMemberRated && (
                  <span className="text-orange-600 font-semibold">
                    Califica todas las categorías
                  </span>
                )}
              </div>
              <button
                onClick={handleNext}
                disabled={!isCurrentMemberRated}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isCurrentMemberRated
                    ? "bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentMemberIndex < teamMembers.length - 1 ? (
                  <>
                    Siguiente
                    <Send className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Enviar Calificaciones
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
