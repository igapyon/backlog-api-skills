import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const repoName = "backlog-api-skills";
const skillName = "igapyon-backlog-api";
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8")
);
const zipPath = path.resolve(ROOT, `bundle/igapyon-${repoName}-${packageJson.version}.zip`);

test("release zip contains installable skill files and excludes development-only files", () => {
  execFileSync("npm", ["run", "build:bundle:zip"], {
    cwd: ROOT,
    encoding: "utf8"
  });

  assert.equal(fs.existsSync(zipPath), true);

  const entries = execFileSync("unzip", ["-Z1", zipPath], {
    cwd: ROOT,
    encoding: "utf8"
  }).trim().split(/\n/).filter(Boolean);

  assertIncludes(entries, `skills/${skillName}/SKILL.md`);
  assertIncludes(entries, `skills/${skillName}/index.json`);
  assertIncludes(entries, `skills/${skillName}/references/INDEX.md`);
  assertIncludes(entries, `skills/${skillName}/references/runtime/operations-map.md`);
  assertIncludes(entries, `skills/${skillName}/references/runtime/setup.md`);
  assertIncludes(entries, `skills/${skillName}/references/workflow/request-routing.md`);
  assertIncludes(entries, `skills/${skillName}/references/safety.md`);
  assertIncludes(entries, `skills/${skillName}/references/upstream-compatibility.md`);
  assertIncludes(entries, `skills/${skillName}/runtime/backlog-api-0.3.4.mjs`);
  assertIncludes(entries, `skills/${skillName}/runtime/backlog-api-source.json`);
  assertIncludes(entries, `skills/${skillName}/LICENSE`);
  assertIncludes(entries, `skills/${skillName}/THIRD_PARTY_NOTICES.md`);
  assertIncludes(entries, `skills/${skillName}/licenses/backlog-mcp-server-MIT.txt`);

  assert.equal(entries.some((entry) => entry.includes(".DS_Store")), false);
  assert.equal(entries.some((entry) => entry.startsWith("tests/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("docs/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("bundle/")), false);
  assert.equal(entries.some((entry) => entry.includes("node_modules/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("workplace/")), false);
  assert.equal(entries.some((entry) => entry.includes("/vendor/")), false);
});

function assertIncludes(entries, expected) {
  assert.ok(entries.includes(expected), `missing zip entry: ${expected}`);
}
