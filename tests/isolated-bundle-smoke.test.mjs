import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const repoName = "backlog-api-skills";
const skillName = "igapyon-backlog-api";

test("generated Skill bundle runs from an isolated install shape", () => {
  execFileSync("npm", ["run", "build:bundle"], {
    cwd: ROOT,
    encoding: "utf8"
  });

  const sourceBundle = path.resolve(ROOT, "bundle", repoName);
  const isolatedRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${repoName}-bundle-`));

  try {
    fs.cpSync(sourceBundle, isolatedRoot, { recursive: true });
    const installedSkillRoot = path.resolve(isolatedRoot, "skills", skillName);
    const runtime = path.resolve(installedSkillRoot, "runtime", "backlog-api-0.5.0.mjs");

    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "SKILL.md")), true);
    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "index.json")), true);
    assert.equal(fs.existsSync(runtime), true);
    assert.equal(
      fs.existsSync(path.resolve(installedSkillRoot, "runtime", "backlog-api-source.json")),
      true
    );
    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "vendor")), false);

    assert.equal(execFileSync("node", [runtime, "--version"], { encoding: "utf8" }).trim(), "0.5.0");
    const help = execFileSync("node", [runtime, "--help"], { encoding: "utf8" });
    assert.match(help, /resource IDs\/keys/);
    assert.match(help, /under target/);
    assert.match(help, /BACKLOG_API_ALLOWED_PERMISSIONS/);
    const catalog = JSON.parse(
      execFileSync("node", [runtime, "tools", "list"], { encoding: "utf8" })
    );
    assert.equal(catalog.operations.length, 59);
    const description = JSON.parse(
      execFileSync("node", [runtime, "tools", "describe", "get_issue"], {
        encoding: "utf8"
      })
    );
    assert.equal(description.operation.credentialsRequiredForDryRun, false);
  } finally {
    fs.rmSync(isolatedRoot, { recursive: true, force: true });
  }
});
