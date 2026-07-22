#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const sourceRoot = resolveSourceRoot(process.argv.slice(2));
const sourcePackage = readJson(path.resolve(sourceRoot, "package.json"));

if (sourcePackage.name !== "backlog-api") {
  throw new Error(`expected backlog-api package, found: ${sourcePackage.name ?? "unknown"}`);
}

const sourceArtifact = path.resolve(sourceRoot, "bundle", "backlog-api.mjs");
if (!fs.existsSync(sourceArtifact)) {
  throw new Error(`missing Node artifact; run npm run build in backlog-api first: ${sourceArtifact}`);
}

const runtimeDir = path.resolve(root, "skills", "igapyon-backlog-api", "runtime");
const runtimeName = `backlog-api-${sourcePackage.version}.mjs`;
const runtimePath = path.resolve(runtimeDir, runtimeName);

fs.mkdirSync(runtimeDir, { recursive: true });
for (const filename of fs.readdirSync(runtimeDir)) {
  if (/^backlog-api-\d+\.\d+\.\d+\.mjs$/.test(filename)) {
    fs.rmSync(path.resolve(runtimeDir, filename));
  }
}
fs.copyFileSync(sourceArtifact, runtimePath);
fs.chmodSync(runtimePath, 0o755);

const commit = git(sourceRoot, ["rev-parse", "HEAD"]).trim();
const dirty = git(sourceRoot, ["status", "--porcelain"]).trim().length > 0;
const sha256 = crypto.createHash("sha256").update(fs.readFileSync(runtimePath)).digest("hex");
const sourceRecord = {
  schemaVersion: 1,
  source: {
    repository: "https://github.com/igapyon/backlog-api",
    version: sourcePackage.version,
    commit,
    dirty
  },
  artifact: {
    file: runtimeName,
    sha256
  },
  upstream: {
    repository: "https://github.com/nulab/backlog-mcp-server",
    version: "0.13.2",
    tag: "v0.13.2",
    commit: "d12f010de976af11bcd43f1d3497dc7043d26e62"
  }
};

fs.writeFileSync(
  path.resolve(runtimeDir, "backlog-api-source.json"),
  `${JSON.stringify(sourceRecord, null, 2)}\n`
);

process.stdout.write(
  `[sync:runtime] copied ${runtimeName} from backlog-api ${sourcePackage.version} (${commit.slice(0, 12)}, dirty=${dirty})\n`
);

function resolveSourceRoot(args) {
  if (args.length === 0) {
    return path.resolve(root, "..", "backlog-api");
  }
  if (args.length === 2 && args[0] === "--from") {
    return path.resolve(args[1]);
  }
  throw new Error("usage: npm run sync:runtime -- [--from <backlog-api-directory>]");
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}
