#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf8"));
const source = JSON.parse(
  fs.readFileSync(
    path.resolve(root, "skills", "igapyon-backlog-api", "runtime", "backlog-api-source.json"),
    "utf8"
  )
);
const runtime = path.resolve(
  root,
  "skills",
  "igapyon-backlog-api",
  "runtime",
  source.artifact.file
);
const deletionRunner = path.resolve(
  root,
  "skills",
  "igapyon-backlog-api",
  "scripts",
  "backlog-api-skill-run.mjs"
);

assert.equal(fs.existsSync(runtime), true, `missing runtime: ${runtime}`);
assert.equal(fs.existsSync(deletionRunner), true, `missing deletion runner: ${deletionRunner}`);

const version = execFileSync("node", [runtime, "--version"], { encoding: "utf8" }).trim();
const deletionRunnerVersion = execFileSync("node", [deletionRunner, "--version"], {
  encoding: "utf8"
}).trim();
const catalog = JSON.parse(
  execFileSync("node", [runtime, "tools", "list"], { encoding: "utf8" })
);

assert.match(packageJson.version, /^\d+\.\d+\.\d+$/);
assert.equal(version, source.source.version);
assert.equal(deletionRunnerVersion, packageJson.version);
assert.equal(catalog.product.name, "backlog-api");
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

const deletionWorkflows = JSON.parse(
  execFileSync("node", [deletionRunner, "--format", "json", "--list-workflows"], {
    encoding: "utf8"
  })
);
assert.deepEqual(
  deletionWorkflows.workflows.map((workflow) => workflow.id),
  ["issue.delete.preflight", "issue.delete.handoff.apply"]
);

process.stdout.write("[smoke:runtime] bundled backlog-api runtime and deletion runner passed\n");
