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

if (sourcePackage.name !== "miku-backlog-api") {
  throw new Error(`expected miku-backlog-api package, found: ${sourcePackage.name ?? "unknown"}`);
}

const sourceArtifact = path.resolve(sourceRoot, "bundle", "miku-backlog-api.mjs");
if (!fs.existsSync(sourceArtifact)) {
  throw new Error(`missing Node artifact; run npm run build in miku-backlog-api first: ${sourceArtifact}`);
}
const upstream = readUpstreamIdentity(sourceArtifact);

const runtimeDir = path.resolve(root, "skills", "igapyon-miku-backlog-api", "runtime");
const runtimeName = `miku-backlog-api-${sourcePackage.version}.mjs`;
const runtimePath = path.resolve(runtimeDir, runtimeName);

fs.mkdirSync(runtimeDir, { recursive: true });
for (const filename of fs.readdirSync(runtimeDir)) {
  if (/^(?:backlog-api|miku-backlog-api)-\d+\.\d+\.\d+\.mjs$/.test(filename)) {
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
    repository: "https://github.com/igapyon/miku-backlog-api",
    version: sourcePackage.version,
    commit,
    dirty
  },
  artifact: {
    file: runtimeName,
    sha256
  },
  upstream
};

fs.writeFileSync(
  path.resolve(runtimeDir, "miku-backlog-api-source.json"),
  `${JSON.stringify(sourceRecord, null, 2)}\n`
);

process.stdout.write(
  `[sync:runtime] copied ${runtimeName} from miku-backlog-api ${sourcePackage.version} (${commit.slice(0, 12)}, dirty=${dirty})\n`
);

function resolveSourceRoot(args) {
  if (args.length === 0) {
    const candidates = [
      path.resolve(root, "..", "miku-backlog-api"),
      path.resolve(root, "..", "backlog-api")
    ];
    return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
  }
  if (args.length === 2 && args[0] === "--from") {
    return path.resolve(args[1]);
  }
  throw new Error("usage: npm run sync:runtime -- [--from <miku-backlog-api-directory>]");
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

function readUpstreamIdentity(runtime) {
  const trace = JSON.parse(execFileSync(process.execPath, [runtime, "trace", "get_space"], {
    encoding: "utf8"
  }));
  const { repository, version, tag, commit } = trace;

  if (
    repository !== "https://github.com/nulab/backlog-mcp-server" ||
    !/^\d+\.\d+\.\d+$/.test(version ?? "") ||
    tag !== `v${version}` ||
    !/^[0-9a-f]{40}$/.test(commit ?? "")
  ) {
    throw new Error("runtime returned an invalid upstream trace identity");
  }

  return { repository, version, tag, commit };
}
