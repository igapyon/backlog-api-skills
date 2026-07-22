#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const repoName = "backlog-api-skills";
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8")
);
const bundleRoot = path.resolve(repoRoot, "bundle", repoName);
const zipName = `igapyon-${repoName}-${packageJson.version}.zip`;
const zipPath = path.resolve(repoRoot, "bundle", zipName);

main();

function main() {
  execFileSync("node", ["scripts/build-skill-bundle.mjs"], {
    cwd: repoRoot,
    stdio: "inherit"
  });

  fs.rmSync(zipPath, { force: true });
  execFileSync("zip", ["-qr", zipPath, "."], {
    cwd: bundleRoot,
    stdio: "inherit"
  });

  process.stdout.write(`[build:bundle:zip] generated bundle/${zipName}\n`);
}
