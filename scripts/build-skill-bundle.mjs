#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const repoName = "miku-backlog-api-skills";
const skillName = "igapyon-miku-backlog-api";
const bundleRoot = path.resolve(repoRoot, "bundle", repoName);
const sourceSkillRoot = path.resolve(repoRoot, "skills", skillName);
const bundleSkillRoot = path.resolve(bundleRoot, "skills", skillName);

main();

function main() {
  ensureSourceExists(sourceSkillRoot, `skills/${skillName}`);

  fs.rmSync(bundleRoot, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100
  });
  fs.mkdirSync(path.dirname(bundleSkillRoot), { recursive: true });

  fs.cpSync(sourceSkillRoot, bundleSkillRoot, {
    recursive: true,
    filter: shouldCopyBundleEntry
  });

  process.stdout.write([
    `[build:bundle] generated bundle/${repoName}`,
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    `  - skills/${skillName}`
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}

function shouldCopyBundleEntry(sourcePath) {
  const name = path.basename(sourcePath);
  if (name === ".DS_Store") {
    return false;
  }
  if (name === "tmp" || name === "output" || name === "state") {
    return false;
  }
  return true;
}
