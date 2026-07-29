#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf8"));
const runtime = path.resolve(
  root,
  "skills",
  "igapyon-backlog-api",
  "runtime",
  `backlog-api-${packageJson.version}.mjs`
);

assert.equal(fs.existsSync(runtime), true, `missing runtime: ${runtime}`);

const version = execFileSync("node", [runtime, "--version"], { encoding: "utf8" }).trim();
const catalog = JSON.parse(
  execFileSync("node", [runtime, "tools", "list"], { encoding: "utf8" })
);

assert.equal(version, packageJson.version);
assert.equal(catalog.product.name, "backlog-api");
assert.equal(catalog.product.version, packageJson.version);
assert.equal(catalog.operations.length, 59);

const description = JSON.parse(
  execFileSync("node", [runtime, "tools", "describe", "get_issue"], {
    encoding: "utf8"
  })
);
assert.equal(description.operation.name, "get_issue");
assert.equal(description.operation.requiredPermission, "READ");
assert.equal(description.operation.credentialsRequiredForDryRun, false);

process.stdout.write("[smoke:runtime] bundled backlog-api runtime passed\n");
