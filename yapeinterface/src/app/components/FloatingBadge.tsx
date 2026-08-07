import { motion } from "motion/react";
import { Award } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface FloatingBadgeProps {
  badge: {
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
  onClose: () => void;
}

export function FloatingBadge({ badge, onClose }: FloatingBadgeProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#722F8F", "#A855F7", "#2DD4BF", "#FCD34D"],
    });

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
    >
      <div className="relative pointer-events-auto">
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-30 blur-3xl animate-pulse`}
        />

        {/* Badge Card */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm"
        >
          <div className="text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] bg-clip-text text-transparent">
              ¡Badge Desbloqueado!
            </h2>
            <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
            <p className="text-muted-foreground">{badge.description}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
