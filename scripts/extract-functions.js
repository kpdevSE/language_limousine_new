/*
 Utility: Extract all function names from JS/JSX/TS/TSX files and output a grouped list.
 Usage: node scripts/extract-functions.js
 Output: ALL_FUNCTIONS.txt at repo root
*/

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const INCLUDE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".next",
  "out",
  "coverage",
  ".turbo",
]);

function listFilesRecursively(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(fullPath));
    } else if (INCLUDE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractFunctionNames(content) {
  const names = new Set();

  for (const m of content.matchAll(/\bfunction\s+([A-Za-z0-9_]+)\s*\(/g)) {
    names.add(m[1]);
  }
  for (const m of content.matchAll(
    /export\s+function\s+([A-Za-z0-9_]+)\s*\(/g
  )) {
    names.add(m[1]);
  }
  for (const m of content.matchAll(
    /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/g
  )) {
    names.add(m[1]);
  }
  for (const m of content.matchAll(
    /\b(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(?[\s\S]*?=>/g
  )) {
    names.add(m[1]);
  }
  for (const m of content.matchAll(
    /\b(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s+)?function\b/g
  )) {
    names.add(m[1]);
  }

  return names;
}

function main() {
  const allFiles = listFilesRecursively(repoRoot);
  const results = new Map();

  for (const file of allFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const names = extractFunctionNames(content);
    if (names.size > 0) {
      results.set(
        file,
        Array.from(names).sort((a, b) => a.localeCompare(b))
      );
    }
  }

  const sortedFiles = Array.from(results.keys()).sort((a, b) =>
    a.localeCompare(b)
  );
  let totalFunctions = 0;

  const lines = [];
  lines.push("ALL FUNCTIONS IN PROJECT");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  for (const file of sortedFiles) {
    const relative = path.relative(repoRoot, file).replace(/\\/g, "/");
    const names = results.get(file) || [];
    totalFunctions += names.length;
    lines.push(`FILE: ${relative} (${names.length})`);
    for (const name of names) {
      lines.push(`- ${name}`);
    }
    lines.push("");
  }

  lines.unshift(`TOTAL FUNCTIONS: ${totalFunctions}`);
  lines.splice(1, 0, "");

  const outPath = path.join(repoRoot, "ALL_FUNCTIONS.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(
    `Wrote ALL_FUNCTIONS.txt with ${totalFunctions} functions across ${sortedFiles.length} files.`
  );
}

main();
