import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const runtimeDir = path.resolve(ROOT, "skills", "igapyon-backlog-api", "runtime");
const source = JSON.parse(
  fs.readFileSync(path.resolve(runtimeDir, "backlog-api-source.json"), "utf8")
);
const runtime = path.resolve(runtimeDir, source.artifact.file);

test("bundled runtime matches the pinned backlog-api source record", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8"));
  const sha256 = crypto.createHash("sha256").update(fs.readFileSync(runtime)).digest("hex");

  assert.equal(source.source.repository, "https://github.com/igapyon/backlog-api");
  assert.equal(source.source.version, packageJson.version);
  assert.equal(source.artifact.file, `backlog-api-${packageJson.version}.mjs`);
  assert.equal(source.artifact.sha256, sha256);
  assert.match(source.source.commit, /^[0-9a-f]{40}$/);
});
