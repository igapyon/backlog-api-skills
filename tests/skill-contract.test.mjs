import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const skillRoot = path.resolve(ROOT, "skills", "igapyon-backlog-api");
const skill = fs.readFileSync(path.resolve(skillRoot, "SKILL.md"), "utf8");

test("skill contract keeps explicit activation and CLI-only boundary", () => {
  assert.match(skill, /^---\nname: igapyon-backlog-api\n/m);
  assert.match(skill, /Do not activate from the word `Backlog` alone/);
  assert.match(skill, /This skill is `cli-only`/);
  assert.match(skill, /do not call the Backlog REST API directly/);
  assert.match(skill, /do not probe MCP tools as an automatic fallback/i);
});

test("skill contract protects credentials and destructive operations", () => {
  assert.match(skill, /never ask the user to paste an API key/i);
  assert.match(skill, /Before every create, update, or delete, obtain just-in-time user approval/i);
  assert.match(skill, /request that initiated the workflow does not itself satisfy this approval/i);
  assert.match(skill, /obtain a second, separate confirmation after\s+the mutation approval/i);
  assert.match(skill, /never treat one reply as\s+satisfying both approvals/i);
  assert.match(skill, /Pass `--confirm-destructive` only after the second confirmation/i);
});

test("required bundled files exist", () => {
  const required = [
    "index.json",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "licenses/backlog-mcp-server-MIT.txt",
    "runtime/backlog-api-0.3.2.mjs",
    "runtime/backlog-api-source.json",
    "references/INDEX.md",
    "references/runtime/operations-map.md",
    "references/runtime/setup.md",
    "references/workflow/request-routing.md",
    "references/safety.md",
    "references/upstream-compatibility.md"
  ];

  for (const relativePath of required) {
    assert.equal(
      fs.existsSync(path.resolve(skillRoot, relativePath)),
      true,
      `missing skill file: ${relativePath}`
    );
  }
});

test("the skill bundle does not contain a vendored source tree", () => {
  assert.equal(fs.existsSync(path.resolve(skillRoot, "vendor")), false);
});
