#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const options = parseArgs(process.argv.slice(2));
const releaseFile = `backlog-api-${options.version}.mjs`;
const releaseUrl = `https://github.com/igapyon/backlog-api/releases/download/${options.tag}/${releaseFile}`;
const checksumUrl = `https://github.com/igapyon/backlog-api/releases/download/${options.tag}/SHA256SUMS`;
const artifact = path.resolve(options.artifact);

if (!fs.existsSync(artifact)) {
  throw new Error(`release artifact not found: ${artifact}`);
}

const actualSha256 = crypto.createHash("sha256").update(fs.readFileSync(artifact)).digest("hex");
if (actualSha256 !== options.expectedSha256) {
  throw new Error(`release artifact checksum mismatch: expected ${options.expectedSha256}, got ${actualSha256}`);
}

const reportedVersion = execFileSync(process.execPath, [artifact, "--version"], {
  encoding: "utf8"
}).trim();
if (reportedVersion !== options.version) {
  throw new Error(`release artifact version mismatch: expected ${options.version}, got ${reportedVersion}`);
}
const upstream = readUpstreamIdentity(artifact);

const runtimeDir = path.resolve(root, "skills", "igapyon-backlog-api", "runtime");
const runtimePath = path.resolve(runtimeDir, releaseFile);

fs.mkdirSync(runtimeDir, { recursive: true });
for (const filename of fs.readdirSync(runtimeDir)) {
  if (/^backlog-api-\d+\.\d+\.\d+\.mjs$/.test(filename)) {
    fs.rmSync(path.resolve(runtimeDir, filename));
  }
}
fs.copyFileSync(artifact, runtimePath);
fs.chmodSync(runtimePath, 0o755);

const sourceRecord = {
  schemaVersion: 1,
  source: {
    repository: "https://github.com/igapyon/backlog-api",
    version: options.version,
    tag: options.tag,
    commit: options.commit,
    release: `https://github.com/igapyon/backlog-api/releases/tag/${options.tag}`,
    dirty: false
  },
  artifact: {
    origin: "github-release-asset",
    file: releaseFile,
    url: releaseUrl,
    sha256: actualSha256,
    checksumFile: checksumUrl
  },
  upstream
};

fs.writeFileSync(
  path.resolve(runtimeDir, "backlog-api-source.json"),
  `${JSON.stringify(sourceRecord, null, 2)}\n`
);

process.stdout.write(
  `[import:runtime:release] imported ${releaseFile} from ${options.tag} (${options.commit.slice(0, 12)}, sha256=${actualSha256})\n`
);

function parseArgs(args) {
  const values = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(usage());
    }
    values[key.slice(2)] = value;
  }

  const version = values.version;
  const tag = values.tag;
  const commit = values.commit;
  const artifact = values.artifact;
  const expectedSha256 = values["expected-sha256"];

  if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) throw new Error(usage());
  if (tag !== `v${version}`) throw new Error(`tag must be v${version}`);
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error(usage());
  if (!artifact || !/^[0-9a-f]{64}$/.test(expectedSha256 ?? "")) throw new Error(usage());

  return { version, tag, commit, artifact, expectedSha256 };
}

function usage() {
  return "usage: npm run import:runtime:release -- --version <x.y.z> --tag <vx.y.z> --commit <40-hex> --artifact <path> --expected-sha256 <64-hex>";
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
    throw new Error("release artifact returned an invalid upstream trace identity");
  }

  return { repository, version, tag, commit };
}
