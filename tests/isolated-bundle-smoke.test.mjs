import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const repoName = "miku-backlog-api-skills";
const skillName = "igapyon-miku-backlog-api";

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
    const runtimeSource = JSON.parse(
      fs.readFileSync(path.resolve(installedSkillRoot, "runtime", "miku-backlog-api-source.json"), "utf8")
    );
    const runtime = path.resolve(installedSkillRoot, "runtime", runtimeSource.artifact.file);
    const runner = path.resolve(installedSkillRoot, "scripts", "backlog-api-skill-run.mjs");

    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "SKILL.md")), true);
    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "index.json")), true);
    assert.equal(fs.existsSync(runner), true);
    assert.equal(
      fs.existsSync(path.resolve(installedSkillRoot, "scripts", "backlog-api-workflow-manifest.mjs")),
      true
    );
    assert.equal(fs.existsSync(runtime), true);
    assert.equal(
      fs.existsSync(path.resolve(installedSkillRoot, "runtime", "miku-backlog-api-source.json")),
      true
    );
    assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "vendor")), false);

    assert.equal(
      execFileSync("node", [runtime, "--version"], { encoding: "utf8" }).trim(),
      runtimeSource.source.version
    );
    const help = execFileSync("node", [runtime, "--help"], { encoding: "utf8" });
    assert.match(help, /resource IDs\/keys/);
    assert.match(help, /under target/);
    assert.match(help, /BACKLOG_API_ALLOWED_PERMISSIONS/);
    const catalog = JSON.parse(
      execFileSync("node", [runtime, "tools", "list"], { encoding: "utf8" })
    );
    assert.equal(catalog.operations.length, 63);
    const description = JSON.parse(
      execFileSync("node", [runtime, "tools", "describe", "get_issue"], {
        encoding: "utf8"
      })
    );
    assert.equal(description.operation.credentialsRequiredForDryRun, false);

    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /context\.select --session SESSION --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\] --persist/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.list\.incomplete --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.search --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.save --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.export\.xlsx\.preflight --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.export\.xlsx\.apply --apply/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.create\.preflight --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.create\.apply --apply/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.update\.preflight --issue-key PROJ-123\|--issue-id ID/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.update\.apply --apply/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.hygiene --project PROJECT_KEY\|PROJECT_ID \[--organization NAME\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /notification\.triage \[--organization NAME\] \[--unread\]/
    );
    assert.match(
      execFileSync("node", [runner, "--help"], { encoding: "utf8" }),
      /issue\.delete\.handoff\.apply --apply/
    );
    const workflows = JSON.parse(
      execFileSync("node", [runner, "--format", "json", "--list-workflows"], {
        encoding: "utf8"
      })
    );
    assert.deepEqual(
      workflows.workflows.map((workflow) => workflow.id),
      [
        "context.list",
        "context.select",
        "context.show",
        "context.clear",
        "issue.recent.record",
        "issue.recent.list",
        "issue.recent.clear",
        "issue.search",
        "issue.save",
        "issue.export.xlsx.preflight",
        "issue.export.xlsx.apply",
        "issue.create.preflight",
        "issue.create.apply",
        "issue.update.preflight",
        "issue.update.apply",
        "issue.list.incomplete",
        "issue.hygiene",
        "notification.triage",
        "issue.delete.preflight",
        "issue.delete.handoff.apply"
      ]
    );
  } finally {
    fs.rmSync(isolatedRoot, { recursive: true, force: true });
  }
});
