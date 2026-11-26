// 数观中国 — 提交入口：把 app/ 与 screenshots/ 复制到输出目录，
// 并用 kit 提供的 buildDossier 写出 dossier.json。
// 只用 Node 标准库；输出目录由 MAKEFUN_OUTPUT_DIR 指定，否则用 /output。
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = dirname(fileURLToPath(import.meta.url));
const dest = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");

mkdirSync(dest, { recursive: true });

for (const folder of ["app", "screenshots"]) {
  cpSync(join(here, folder), join(dest, folder), { recursive: true });
}

const dossier = await buildDossier(dest, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

writeFileSync(join(dest, "dossier.json"), dossier);
console.log("wrote", join(dest, "dossier.json"), dossier.length, "bytes");
