#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf8"));
const source = JSON.parse(
  fs.readFileSync(
    path.resolve(root, "skills", "igapyon-miku-backlog-api", "runtime", "miku-backlog-api-source.json"),
    "utf8"
  )
);
const runtime = path.resolve(
  root,
  "skills",
  "igapyon-miku-backlog-api",
  "runtime",
  source.artifact.file
);
const skillRunner = path.resolve(
  root,
  "skills",
  "igapyon-miku-backlog-api",
  "scripts",
  "backlog-api-skill-run.mjs"
);

assert.equal(fs.existsSync(runtime), true, `missing runtime: ${runtime}`);
assert.equal(fs.existsSync(skillRunner), true, `missing skill runner: ${skillRunner}`);

const version = execFileSync("node", [runtime, "--version"], { encoding: "utf8" }).trim();
const skillRunnerVersion = execFileSync("node", [skillRunner, "--version"], {
  encoding: "utf8"
}).trim();
const catalog = JSON.parse(
  execFileSync("node", [runtime, "tools", "list"], { encoding: "utf8" })
);

assert.match(packageJson.version, /^\d+\.\d+\.\d+$/);
assert.equal(version, source.source.version);
assert.equal(skillRunnerVersion, packageJson.version);
assert.equal(catalog.product.name, "miku-backlog-api");
assert.equal(catalog.product.version, source.source.version);
assert.equal(catalog.operations.length, 63);

const description = JSON.parse(
  execFileSync("node", [runtime, "tools", "describe", "get_issue"], {
    encoding: "utf8"
  })
);
assert.equal(description.operation.name, "get_issue");
assert.equal(description.operation.requiredPermission, "READ");
assert.equal(description.operation.credentialsRequiredForDryRun, false);

const skillWorkflows = JSON.parse(
  execFileSync("node", [skillRunner, "--format", "json", "--list-workflows"], {
    encoding: "utf8"
  })
);
assert.deepEqual(
  skillWorkflows.workflows.map((workflow) => workflow.id),
  [
    "issue.search",
    "issue.list.incomplete",
    "issue.delete.preflight",
    "issue.delete.handoff.apply"
  ]
);

process.stdout.write("[smoke:runtime] bundled miku-backlog-api runtime and skill runner passed\n");
