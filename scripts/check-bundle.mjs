import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = ".next/static";
const MAX_TOTAL_KB = 600;
const MAX_CHUNK_KB = 110;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (path.endsWith(".js") || path.endsWith(".css")) files.push(path);
  }
  return files;
}

let files;
try {
  files = walk(ROOT);
} catch {
  console.error(`No existe ${ROOT}. Ejecuta npm run build antes del presupuesto.`);
  process.exit(1);
}

const measured = files
  .map((file) => ({
    file,
    gzip: gzipSync(readFileSync(file)).length,
  }))
  .sort((a, b) => b.gzip - a.gzip);

const totalKb = measured.reduce((sum, item) => sum + item.gzip, 0) / 1024;
const largestKb = (measured[0]?.gzip ?? 0) / 1024;

console.log("Presupuesto de rendimiento");
console.log(`Total JS+CSS (gzip): ${totalKb.toFixed(1)} KB / ${MAX_TOTAL_KB} KB`);
console.log(`Mayor chunk (gzip): ${largestKb.toFixed(1)} KB / ${MAX_CHUNK_KB} KB`);
console.log("Mayores chunks:");
for (const item of measured.slice(0, 5)) {
  console.log(`  ${(item.gzip / 1024).toFixed(1)} KB  ${item.file}`);
}

const errors = [];
if (totalKb > MAX_TOTAL_KB) {
  errors.push(
    `El total supera el presupuesto: ${totalKb.toFixed(1)} KB > ${MAX_TOTAL_KB} KB`,
  );
}
if (largestKb > MAX_CHUNK_KB) {
  errors.push(
    `Un chunk supera el presupuesto: ${largestKb.toFixed(1)} KB > ${MAX_CHUNK_KB} KB`,
  );
}

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}

console.log("✓ Dentro del presupuesto");
