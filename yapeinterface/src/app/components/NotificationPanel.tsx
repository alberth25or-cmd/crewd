import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Heart,
  UserPlus,
  Award,
  MessageSquare,
  Target,
  Trophy,
  CheckCircle2,
  Clock
} from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: "new_member",
    title: "¡Nuevo miembro en tu proyecto!",
    message: "Carlos Mendoza se unió a 'Limpieza de Playas'",
    time: "Hace 5 min",
    icon: UserPlus,
    color: "from-blue-500 to-indigo-600",
    unread: true,
  },
  {
    id: 2,
    type: "achievement",
    title: "¡Badge desbloqueado!",
    message: "Conseguiste el badge 'Eco Warrior' 🌱",
    time: "Hace 1 hora",
    icon: Award,
    color: "from-yellow-400 to-orange-500",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    title: "Nuevo comentario en tu proyecto",
    message: "Ana Torres comentó en 'App de Reciclaje'",
    time: "Hace 2 horas",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-600",
    unread: true,
  },
  {
    id: 4,
    type: "project_update",
    title: "Actualización de proyecto",
    message: "Tu proyecto 'Tutorías Online' alcanzó 30 miembros",
    time: "Hace 3 horas",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    unread: false,
  },
  {
    id: 5,
    type: "ranking",
    title: "¡Subiste en el ranking!",
    message: "Ahora estás en el puesto #15 🎉",
    time: "Ayer",
    icon: Trophy,
    color: "from-orange-500 to-red-600",
    unread: false,
  },
  {
    id: 6,
    type: "reminder",
    title: "Recordatorio de evento",
    message: "Hackathon Cívico mañana a las 10:00 AM",
    time: "Ayer",
    icon: Clock,
    color: "from-cyan-500 to-blue-600",
    unread: false,
  },
  {
    id: 7,
    type: "like",
    title: "Tu proyecto recibió 25 likes",
    message: "¡La comunidad está apoyando tu iniciativa!",
    time: "Hace 2 días",
    icon: Heart,
    color: "from-pink-500 to-red-500",
    unread: false,
  },
  {
    id: 8,
    type: "completion",
    title: "Proyecto completado",
    message: "Califica a tu equipo de 'Reforestación Lima'",
    time: "Hace 3 días",
    icon: CheckCircle2,
    color: "from-green-500 to-teal-600",
    unread: false,
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

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

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--yape-purple)] to-[var(--yape-purple-light)] text-white p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Notificaciones</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-white/80">
                    {unreadCount} sin leer
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? "bg-[var(--yape-lilac-light)]/20" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${notification.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <notification.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm">
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[var(--yape-turquoise)] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full py-2 text-[var(--yape-purple)] font-semibold text-sm hover:bg-gray-100 rounded-lg transition-colors">
                Marcar todas como leídas
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
