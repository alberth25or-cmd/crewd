import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] p-1 transition-all hover:shadow-lg"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
        animate={{
          x: isDark ? 30 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-[var(--yape-purple)]" />
        ) : (
          <Sun className="w-4 h-4 text-[var(--yape-purple)]" />
        )}
      </motion.div>
    </button>
  );
}
