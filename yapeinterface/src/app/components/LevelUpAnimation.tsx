import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface LevelUpAnimationProps {
  isVisible: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpAnimation({
  isVisible,
  newLevel,
  onClose,
}: LevelUpAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#722F8F", "#A855F7", "#2DD4BF", "#FCD34D"],
        startVelocity: 45,
      });

      const timer = setTimeout(() => {
        onClose();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Background Gradient */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 3 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-[var(--yape-purple)]/20 via-[var(--yape-purple-light)]/20 to-[var(--yape-lilac)]/20 backdrop-blur-sm"
          />

          {/* Level Up Card */}
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative pointer-events-auto"
          >
            {/* Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
              className="absolute inset-0 -m-8"
            >
              <div className="w-full h-full border-4 border-[var(--yape-turquoise)] border-dashed rounded-full opacity-50" />
            </motion.div>

            {/* Content */}
            <div className="relative bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] rounded-3xl p-10 shadow-2xl text-white text-center min-w-[300px]">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <Zap className="w-16 h-16 mx-auto mb-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2"
              >
                ¡NIVEL {newLevel}!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg mb-4"
              >
                ¡Sigue así, estás haciendo la diferencia!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 text-[var(--yape-turquoise)]"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+500 XP Bonus</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
