"use strict";

const fs = require("fs");
const path = require("path");
const { getPalette } = require("./palette");
const { workbenchColors } = require("./workbench");
const { tokenColors, semanticTokenColors } = require("./syntax");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "themes");
const FILE = "autumno-dark.json";

function buildTheme() {
  const p = getPalette();
  return {
    $schema: "vscode://schemas/color-theme",
    name: "Autumno Dark",
    type: "dark",
    semanticHighlighting: true,
    colors: workbenchColors(p),
    tokenColors: tokenColors(p),
    semanticTokenColors: semanticTokenColors(p),
  };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const pkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
  );
  const declared = new Set(
    pkg.contributes.themes.map((t) => path.normalize(t.path)),
  );
  if (!declared.has(path.normalize(`./themes/${FILE}`))) {
    throw new Error(
      `themes/${FILE} is not declared in package.json contributes.themes`,
    );
  }

  fs.writeFileSync(
    path.join(OUT_DIR, FILE),
    JSON.stringify(buildTheme(), null, 2) + "\n",
  );
  console.log(`  wrote themes/${FILE}`);
}

main();
