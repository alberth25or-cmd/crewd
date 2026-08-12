/**
 * Genera docs/Crewd-Arquitectura.pdf a partir de docs/arquitectura.html.
 *
 * Usa el Chrome que ya está instalado en modo headless en lugar de añadir
 * Puppeteer como dependencia: son ~300 MB de Chromium duplicado para una
 * tarea que se ejecuta a mano cada varios meses.
 *
 *   node scripts/build-pdf.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Sin `path.dirname`: la URL ya termina en barra, y dirname sobre eso
// quitaría un segmento de más y apuntaría fuera del proyecto.
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "docs", "arquitectura.html");
const output = path.join(root, "docs", "Crewd-Arquitectura.pdf");

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const browser = CANDIDATES.find((p) => p && existsSync(p));
if (!browser) {
  console.error("No se encontró Chrome ni Edge. Rutas probadas:\n  " + CANDIDATES.join("\n  "));
  process.exit(1);
}

if (!existsSync(source)) {
  console.error(`Falta ${source}`);
  process.exit(1);
}

execFileSync(browser, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${output}`,
  pathToFileURL(source).href,
]);

const kb = (statSync(output).size / 1024).toFixed(1);
console.log(`Generado docs/Crewd-Arquitectura.pdf (${kb} KB) con ${path.basename(browser)}`);
