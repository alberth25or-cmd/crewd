import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Los ejes SOFT/WONK son lo que le da carácter a Fraunces. Sin declararlos,
// next/font solo carga el eje de peso y la tipografía se aplana hasta
// parecer una serif genérica cualquiera.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crewd — Encuentra tu equipo. Termina lo que empiezas.",
  description:
    "Propón un proyecto real, recluta el equipo que necesitas y llévalo hasta el final. Con una reputación verificable de lo que efectivamente entregaste.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Aplica el tema antes del primer pintado. Sin esto, quien tenga el tema
 *  oscuro guardado ve un destello blanco en cada carga. */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('crewd-theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`dark ${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* El shell lo pone cada grupo de rutas: (marketing) usa cabecera
          pública y (app) la barra lateral con navegación. */}
      <body>{children}</body>
    </html>
  );
}
