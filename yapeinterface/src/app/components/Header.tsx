import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({
  title = "Yape Social",
  showNotifications = true,
  isDarkMode = false,
  onToggleDarkMode,
}: HeaderProps) {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white">
        <div className="flex items-center justify-between h-14 px-4 max-w-screen-lg mx-auto">
          <button className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">{title}</h1>
          <div className="flex items-center gap-2">
            {onToggleDarkMode && (
              <div className="scale-75">
                <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} />
              </div>
            )}
            {showNotifications ? (
              <button
                onClick={() => setShowNotificationPanel(true)}
                className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--yape-turquoise)] rounded-full border-2 border-white animate-pulse" />
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </div>
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
      />
    </>
  );
}
