import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const skillRoot = path.resolve(ROOT, "skills", "igapyon-miku-backlog-api");
const skill = fs.readFileSync(path.resolve(skillRoot, "SKILL.md"), "utf8");
const requestRouting = fs.readFileSync(
  path.resolve(skillRoot, "references", "workflow", "request-routing.md"),
  "utf8"
);
const safety = fs.readFileSync(path.resolve(skillRoot, "references", "safety.md"), "utf8");
const runtimeSource = JSON.parse(
  fs.readFileSync(path.resolve(skillRoot, "runtime", "miku-backlog-api-source.json"), "utf8")
);

test("skill contract keeps explicit activation and CLI-only boundary", () => {
  assert.match(skill, /^---\nname: igapyon-miku-backlog-api\n/m);
  assert.match(skill, /`igapyon-miku-backlog-api`/);
  assert.match(skill, /`miku-backlog-api`/);
  assert.match(skill, /`miku-backlog-api-skills`/);
  assert.match(skill, /`igapyon-backlog-api`/);
  assert.match(skill, /`backlog-api`/);
  assert.match(skill, /`backlog-api-skills`/);
  assert.match(skill, /Do not activate from the word `Backlog` alone/);
  assert.match(skill, /This skill is `cli-only`/);
  assert.match(skill, /do not call the Backlog REST API directly/);
  assert.match(skill, /do not probe MCP tools as an automatic fallback/i);
  assert.match(skill, /tools describe <operation>/);
  assert.match(skill, /BACKLOG_API_ALLOWED_PERMISSIONS/);
  assert.match(skill, /does not resolve credentials or perform a Backlog request/);
});

test("skill contract protects credentials and destructive operations", () => {
  assert.match(skill, /never ask the user to paste an API key/i);
  assert.match(skill, /Before every create, update, or delete, obtain just-in-time user approval/i);
  assert.match(skill, /fixed single-issue deletion route is the narrow exception/i);
  assert.match(skill, /separate final destructive confirmation/i);
  assert.match(skill, /If any of them changes, discard the\s+prior approval and obtain a new one/i);
  assert.match(skill, /obtain a second, separate confirmation after\s+the mutation approval/i);
  assert.match(skill, /never treat one reply as\s+satisfying both approvals/i);
  assert.match(skill, /Pass `--confirm-destructive` only after the second confirmation/i);
  assert.match(skill, /actual Backlog API call during the beta period/i);
  assert.match(skill, /Treat verbose stderr as transient diagnostics/i);
});

test("skill provides guidance-only API key setup", () => {
  assert.match(skill, /explicitly asks how to issue or configure a Backlog API key/i);
  assert.match(skill, /Provide procedural guidance only/i);
  assert.match(skill, /Do not issue an API key/i);
  assert.match(skill, /they will perform the registration and copy steps/i);
  assert.match(skill, /leave `BACKLOG_API_KEY=`\s+blank/i);
  assert.match(skill, /Do not ask for a screenshot after registration/i);
  assert.match(skill, /do not repeat, transcribe, store,\s+or use it/i);
  assert.match(skill, /revoke that key and issue a replacement/i);
  assert.match(skill, /read-only `get_space`\s+connection test/i);
});

test("single-target deletion routes through the deterministic handoff runner", () => {
  assert.match(skill, /## Fixed Single-Issue Deletion Route/);
  assert.match(skill, /issue\.delete\.preflight/);
  assert.match(skill, /issue\.delete\.handoff\.apply --apply/);
  assert.match(skill, /Return the runner's human output unchanged/i);
  assert.match(skill, /Do not repeat a target key, ID, organization, `--allow`, or a\s+`--confirm-destructive` argument/i);
  assert.match(skill, /Do not\s+fall back to a direct `delete_issue` CLI command/i);
  assert.match(requestRouting, /The fixed runner performs exactly two Backlog API calls/i);
  assert.match(requestRouting, /does not\s+run a routine `--dry-run` or post-delete read-back/i);
  assert.match(requestRouting, /Do not repeat\s+the target or reconstruct any apply argument/i);
  assert.match(safety, /integrity-checked handoff/i);
  assert.match(safety, /do not retry\s+it automatically/i);
});

test("required bundled files exist", () => {
  const required = [
    "index.json",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "licenses/backlog-mcp-server-MIT.txt",
    `runtime/${runtimeSource.artifact.file}`,
    "runtime/miku-backlog-api-source.json",
    "references/INDEX.md",
    "references/runtime/operations-map.md",
    "references/runtime/setup.md",
    "references/workflow/request-routing.md",
    "references/safety.md",
    "references/upstream-compatibility.md",
    "scripts/backlog-api-workflow-manifest.mjs",
    "scripts/backlog-api-skill-run.mjs"
  ];

  for (const relativePath of required) {
    assert.equal(
      fs.existsSync(path.resolve(skillRoot, relativePath)),
      true,
      `missing skill file: ${relativePath}`
    );
  }
});

test("generated discovery index matches the indexed files", () => {
  const index = JSON.parse(fs.readFileSync(path.resolve(skillRoot, "index.json"), "utf8"));

  assert.ok(index.generation.includeExtensions.includes("mjs"));
  assert.ok(index.files.some((entry) => entry.path === "scripts/backlog-api-workflow-manifest.mjs"));
  assert.ok(index.files.some((entry) => entry.path === "scripts/backlog-api-skill-run.mjs"));

  for (const entry of index.files) {
    assert.equal(
      fs.statSync(path.resolve(skillRoot, entry.path)).size,
      entry.size,
      `stale index size: ${entry.path}`
    );
  }
});

test("the skill bundle does not contain a vendored source tree", () => {
  assert.equal(fs.existsSync(path.resolve(skillRoot, "vendor")), false);
});
