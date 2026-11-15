import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const EXT = [".js", ".jsx", ".ts", ".tsx", ".json", ".css"];
let problems = 0;

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

// True only if every part of the path exists with exactly this letter case
const existsExact = (target) => {
  let cur = root;
  for (const part of path.relative(root, target).split(path.sep)) {
    if (!fs.existsSync(cur) || !fs.readdirSync(cur).includes(part)) return false;
    cur = path.join(cur, part);
  }
  return true;
};

const resolves = (base) => {
  if (existsExact(base) && fs.statSync(base).isFile()) return true;
  if (EXT.some((e) => existsExact(base + e))) return true;
  return EXT.some((e) => existsExact(path.join(base, `index${e}`)));
};

const importRe =
  /(?:import|export)\s[^'"]*?from\s+["'](\.[^"']+)["']|import\s*\(\s*["'](\.[^"']+)["']\s*\)|import\s+["'](\.[^"']+)["']/g;

for (const file of walk(root).filter((f) => /\.(jsx?|tsx?)$/.test(f))) {
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = importRe.exec(src))) {
    const spec = m[1] || m[2] || m[3];
    const base = path.resolve(path.dirname(file), spec);
    if (!base.startsWith(root)) continue; // outside src (for example package.json)
    if (!resolves(base)) {
      problems++;
      console.log(`✗ ${path.relative(root, file)} → "${spec}" (wrong letter case, or the file is missing)`);
    }
  }
}

console.log(
  problems
    ? `\n${problems} problem(s) found. Fix them before deploying.`
    : "✓ Every relative import matches its file name exactly.",
);
process.exit(problems ? 1 : 0);