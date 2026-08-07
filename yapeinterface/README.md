# Yape Social Impact - Plataforma de Impacto Social para Jóvenes Peruanos

## 🌟 Descripción

**Yape Social Impact** es una funcionalidad nativa dentro de Yape diseñada para reducir las barreras que enfrentan los jóvenes peruanos de 18 a 29 años para involucrarse en iniciativas comunitarias, proyectos sociales y espacios de toma de decisiones locales.

La plataforma combina:
- 🎮 **Gamificación** estilo Duolingo
- 💼 **Networking profesional** tipo LinkedIn
- 🤝 **Colaboración** estilo Discord
- 📊 **Organización** tipo Notion
- 💰 **Diseño fintech** moderno y minimalista

## ✨ Características Principales

### 🏠 Home Principal
- Saludo personalizado con nombre del usuario
- Sistema de niveles y XP (850/1000 puntos)
- Estadísticas personales (proyectos, impacto, nivel)
- Feed de proyectos destacados con imágenes
- Retos rápidos con recompensas XP
- Top líderes juveniles con rankings

### 📱 Feed de Proyectos
- Búsqueda y filtros avanzados
- 7 categorías principales:
  - 🌱 Medio Ambiente
  - 📚 Educación
  - 💻 Tecnología Social
  - 🧠 Salud Mental
  - ⚖️ Anti-Corrupción
  - 🤝 Inclusión Social
  - 🛡️ Seguridad Ciudadana
- Filtros por modalidad (virtual, presencial, cerca de mí)
- Cards con información completa del proyecto
- Sistema de "guardar" proyectos
- Botón de postulación directa

### ➕ Crear Proyecto
- Formulario multi-paso (3 pasos)
- Paso 1: Información básica
  - Título, descripción, problema a resolver
  - Categoría del proyecto
  - ODS relacionado (17 opciones)
- Paso 2: Equipo y habilidades
  - Selector visual de 8 habilidades profesionales
  - Roles específicos
  - Modalidad (virtual/presencial/híbrido)
  - Ubicación
- Paso 3: Cronograma
  - Fecha de inicio
  - Duración estimada
  - Nivel de compromiso (bajo/medio/alto)

### ⚡ Retos y Voluntariados
- Banner de racha (streak) con gamificación
- Progreso semanal visual
- Misiones diarias con XP
- Oportunidades de voluntariado
- Eventos y capacitaciones
- Retos rápidos con badges desbloqueables
- Filtros por tipo de actividad
- Información detallada de cada oportunidad

### 👤 Perfil Gamificado
- Avatar personalizado con iniciales
- Universidad y carrera
- Sistema de niveles (1-100)
- Ranking nacional (#15)
- Puntos totales acumulados
- 6+ badges desbloqueables:
  - 🔥 Iniciador
  - 💚 Eco-Warrior
  - ⚡ Streak Master
  - 🏆 Top Colaborador
  - 🎯 ODS Champion
  - 👑 Líder Comunitario
- Skills con barras de progreso
- Historial de proyectos con calificaciones
- ODS más apoyados
- Sistema de reputación (5 estrellas)

### ⭐ Sistema de Calificaciones
- Modal interactivo multi-paso
- 5 categorías de evaluación:
  - Responsabilidad
  - Compromiso
  - Liderazgo
  - Trabajo en equipo
  - Puntualidad
- Sistema de 5 estrellas por categoría
- Comentarios opcionales
- Progreso visual del proceso

### 🏆 Rankings
- 4 categorías de ranking:
  - 👥 Top Líderes Juveniles
  - 🎓 Top Universidades
  - 💪 Top Voluntarios
  - 🚀 Top Proyectos
- Podio visual para top 3
- Medallas y trofeos
- Estadísticas detalladas por categoría
- Indicadores de racha y badges

## 🎨 Diseño Visual

### Paleta de Colores Yape
- **Morado Principal**: `#722F8F`
- **Morado Claro**: `#A855F7`
- **Morado Oscuro**: `#581C87`
- **Lila**: `#C084FC`
- **Lila Claro**: `#E9D5FF`
- **Turquesa**: `#2DD4BF`
- **Turquesa Oscuro**: `#14B8A6`

### Características de Diseño
- ✨ Gradientes suaves
- 🔮 Glassmorphism ligero
- 🎴 Cards flotantes con sombras
- ⚡ Animaciones micro-interactivas
- 📱 Mobile-first responsive
- 🌙 Dark mode integrado
- 🔔 Sistema de notificaciones en tiempo real

## 🛠️ Stack Tecnológico

- **Framework**: React 18.3.1
- **Routing**: React Router 7.13.0
- **Animaciones**: Motion (Framer Motion) 12.23.24
- **Estilos**: Tailwind CSS 4.1.12
- **Iconos**: Lucide React 0.487.0
- **Efectos**: Canvas Confetti 1.9.4
- **Build Tool**: Vite 6.3.5
- **Package Manager**: pnpm

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo (ya está corriendo)
# El servidor Vite está activo automáticamente

# Build de producción (NO usar en este entorno)
# pnpm build
```

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── BottomNav.tsx          # Navegación inferior estilo Yape
│   │   ├── Header.tsx              # Header con notificaciones y dark mode
│   │   ├── NotificationPanel.tsx   # Panel lateral de notificaciones
│   │   ├── ThemeToggle.tsx         # Toggle de modo oscuro
│   │   ├── RatingModal.tsx         # Modal de calificaciones
│   │   ├── FloatingBadge.tsx       # Animación de badge desbloqueado
│   │   └── LevelUpAnimation.tsx    # Animación de subida de nivel
│   ├── pages/
│   │   ├── Home.tsx                # Pantalla principal
│   │   ├── Projects.tsx            # Feed de proyectos
│   │   ├── CreateProject.tsx       # Crear proyecto
│   │   ├── Challenges.tsx          # Retos y voluntariados
│   │   ├── Rankings.tsx            # Rankings y leaderboards
│   │   └── Profile.tsx             # Perfil del usuario
│   └── App.tsx                     # App principal con routing
└── styles/
    ├── theme.css                   # Variables de tema Yape
    └── fonts.css                   # Importación de fuentes
```

## 🎯 Funcionalidades Clave

### Gamificación
- ⚡ Sistema de XP y niveles
- 🏅 Badges desbloqueables
- 🔥 Streaks y rachas diarias
- 🎯 Misiones diarias
- 🏆 Rankings y competencia sana
- 📊 Barras de progreso visuales

### Social
- 👥 Perfiles profesionales
- ⭐ Sistema de calificaciones
- 💬 Comentarios y feedback
- 🤝 Red de colaboradores
- 🏫 Rankings por universidad
- 🎖️ Reputación pública

### Impacto
- 🌍 17 ODS de la ONU
- 📈 Métricas de impacto
- ⏱️ Horas de voluntariado
- 🎯 Proyectos completados
- 💪 Comunidad activa

## 🌙 Dark Mode

El dark mode está implementado y puede ser activado desde el header. Los colores se ajustan automáticamente para mantener la identidad visual de Yape en ambos modos.

## 🔔 Notificaciones

Sistema completo de notificaciones que incluye:
- ➕ Nuevos miembros en proyectos
- 🏅 Badges desbloqueados
- 💬 Comentarios en proyectos
- 📊 Actualizaciones de proyectos
- 🏆 Cambios en rankings
- ⏰ Recordatorios de eventos
- ❤️ Likes y reacciones
- ✅ Completación de proyectos

## 🎨 Animaciones

- Splash screen al inicio con logo animado
- Transiciones suaves entre páginas
- Confetti al crear proyectos
- Animaciones de badges desbloqueados
- Level up con efectos especiales
- Micro-interacciones en todos los botones
- Progress bars animadas
- Cards con hover effects

## 📱 Responsive Design

- Mobile-first approach
- Optimizado para iOS y Android
- Safe area insets para notch
- Touch-friendly targets
- Scroll suave y natural

## 🎯 Objetivos Cumplidos

✅ Diseño 100% compatible con Yape  
✅ Paleta de colores oficial (morado/lila/turquesa)  
✅ 7 pantallas principales completas  
✅ Sistema de gamificación completo  
✅ Dark mode funcional  
✅ Notificaciones en tiempo real  
✅ Sistema de calificaciones  
✅ Rankings y leaderboards  
✅ Animaciones y microinteracciones  
✅ Mobile-first responsive  
✅ Splash screen animado  
✅ Navegación estilo Yape  

## 🚀 Próximos Pasos (Sugerencias)

- Integración con backend real
- Sistema de chat en tiempo real
- Geolocalización para proyectos cercanos
- Notificaciones push
- Compartir en redes sociales
- Exportar certificados de participación
- Integración con universidades
- API para municipalidades y ONGs
- Sistema de verificación de identidad
- Badges NFT en blockchain

## 👥 Experiencia del Usuario

La aplicación está diseñada para generar:
- 💜 **Comunidad**: Sentirse parte de algo más grande
- 🎯 **Motivación**: Gamificación que impulsa la acción
- 🏆 **Reconocimiento**: Visibilidad y badges públicos
- 💪 **Orgullo**: Impacto medible y cuantificable
- 🤝 **Conexión**: Red de jóvenes comprometidos

---

**Hecho con 💜 para jóvenes peruanos que quieren cambiar el mundo**
