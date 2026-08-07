import { Home, Compass, PlusCircle, Trophy, User, Zap } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function BottomNav({ currentPath, onNavigate }: BottomNavProps) {
  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/proyectos", icon: Compass, label: "Proyectos" },
    { path: "/retos", icon: Zap, label: "Retos" },
    { path: "/ranking", icon: Trophy, label: "Ranking" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-b from-[var(--yape-lilac-light)] to-transparent opacity-30"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-[var(--yape-purple)]" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs mt-1 transition-colors ${
                  isActive ? "text-[var(--yape-purple)] font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
