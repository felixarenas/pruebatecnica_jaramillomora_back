/**
 * Genera src/core/docs/readme.generated.ts a partir de README.md.
 * Ejecutado por npm run docs:build (hook prebuild).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = path.join(rootDir, 'README.md');
const outDir = path.join(rootDir, 'src', 'core', 'docs');
const outPath = path.join(outDir, 'readme.generated.ts');

if (!fs.existsSync(readmePath)) {
  console.error(`[docs:build] No se encontró README.md en ${readmePath}`);
  process.exit(1);
}

const markdown = fs.readFileSync(readmePath, 'utf8');
const html = marked.parse(markdown, { async: false });

fs.mkdirSync(outDir, { recursive: true });

const fileContent = `// Archivo generado por scripts/embed-readme.mjs — no editar a mano.
// Fuente: README.md

/** Contenido de README.md en Markdown */
export const README_MARKDOWN: string = ${JSON.stringify(markdown)};

/** README.md convertido a HTML (marked) para Swagger u otras vistas */
export const README_HTML: string = ${JSON.stringify(html)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`[docs:build] Generado ${path.relative(rootDir, outPath)}`);
