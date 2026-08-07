import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { CreateProject } from "./pages/CreateProject";
import { Profile } from "./pages/Profile";
import { Rankings } from "./pages/Rankings";
import { Challenges } from "./pages/Challenges";
import { Onboarding } from "./pages/Onboarding";
import confetti from "canvas-confetti";

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[var(--yape-purple)] via-[var(--yape-purple-light)] to-[var(--yape-lilac)] flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 10L65 35H35L50 10Z"
                fill="#722F8F"
                className="animate-pulse"
              />
              <circle cx="50" cy="55" r="20" fill="#2DD4BF" />
              <path
                d="M30 85C30 75 40 70 50 70C60 70 70 75 70 85"
                stroke="#A855F7"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Yape Social
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-lg"
        >
          Impacto que se paga con acción
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="inline-flex gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0.2,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0.4,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleNavigate = (path: string) => {
    if (path === "/crear") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#722F8F", "#A855F7", "#2DD4BF"],
      });
    }
    navigate(path);
  };

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Yape Social";
      case "/proyectos":
        return "Proyectos";
      case "/crear":
        return "Crear Proyecto";
      case "/retos":
        return "Retos y Voluntariados";
      case "/ranking":
        return "Rankings";
      case "/perfil":
        return "Mi Perfil";
      default:
        return "Yape Social";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname !== "/crear" &&
        location.pathname !== "/ranking" &&
        location.pathname !== "/retos" && (
          <Header
            title={getHeaderTitle()}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/crear" element={<CreateProject />} />
          <Route path="/retos" element={<Challenges />} />
          <Route path="/ranking" element={<Rankings />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </AnimatePresence>
      <BottomNav
        currentPath={location.pathname}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("yape_social_onboarding_complete") === "true";
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem("yape_social_onboarding_complete", "true");
  };

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : showOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <AppContent />
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}