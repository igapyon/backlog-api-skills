import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const runtimeDir = path.resolve(ROOT, "skills", "igapyon-backlog-api", "runtime");
const source = JSON.parse(
  fs.readFileSync(path.resolve(runtimeDir, "backlog-api-source.json"), "utf8")
);
const runtime = path.resolve(runtimeDir, source.artifact.file);
const environment = {
  ...process.env,
  BACKLOG_DOMAIN: "example.backlog.com",
  BACKLOG_API_KEY: "test"
};

function runRuntime(args, input) {
  return spawnSync(process.execPath, [runtime, ...args], {
    encoding: "utf8",
    env: environment,
    ...(input === undefined ? {} : { input: JSON.stringify(input) })
  });
}

function firstDiagnosticCode(execution) {
  return JSON.parse(execution.stdout).diagnostics?.[0]?.code;
}

test("bundled runtime matches the pinned backlog-api source record", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8"));
  const sha256 = crypto.createHash("sha256").update(fs.readFileSync(runtime)).digest("hex");

  assert.equal(source.source.repository, "https://github.com/igapyon/backlog-api");
  assert.equal(source.source.version, packageJson.version);
  assert.equal(source.source.tag, `v${packageJson.version}`);
  assert.equal(source.source.dirty, false);
  assert.equal(source.artifact.origin, "github-release-asset");
  assert.equal(source.artifact.file, `backlog-api-${packageJson.version}.mjs`);
  assert.equal(source.artifact.sha256, sha256);
  assert.match(source.artifact.url, /\/releases\/download\/v0\.3\.4\/backlog-api-0\.3\.4\.mjs$/);
  assert.match(source.source.commit, /^[0-9a-f]{40}$/);
});

test("bundled runtime defaults to READ and requires explicit CREATE permission", () => {
  const input = JSON.stringify({
    projectId: 1,
    summary: "permission test",
    issueTypeId: 1,
    priorityId: 3
  });
  const common = [runtime, "call", "add_issue", "--input", "-", "--dry-run"];

  const denied = spawnSync(process.execPath, common, {
    encoding: "utf8",
    env: environment,
    input
  });
  assert.equal(denied.status, 1);
  assert.equal(JSON.parse(denied.stdout).diagnostics[0].code, "PERMISSION_REQUIRED");

  const allowed = spawnSync(process.execPath, [...common, "--allow", "CREATE", "--verbose"], {
    encoding: "utf8",
    env: environment,
    input
  });
  assert.equal(allowed.status, 0);
  assert.equal(JSON.parse(allowed.stdout).dryRun, true);
});

test("all 58 operations are classified and every mutation is denied without permission", () => {
  const catalogExecution = runRuntime(["tools", "list"]);
  assert.equal(catalogExecution.status, 0);
  const catalog = JSON.parse(catalogExecution.stdout);
  const expectedCounts = { READ: 35, CREATE: 9, UPDATE: 10, DELETE: 4 };
  const actualCounts = Object.fromEntries(
    Object.keys(expectedCounts).map((permission) => [
      permission,
      catalog.operations.filter((operation) => operation.requiredPermission === permission).length
    ])
  );

  assert.equal(catalog.operations.length, 58);
  assert.deepEqual(actualCounts, expectedCounts);

  for (const operation of catalog.operations.filter(
    (candidate) => candidate.requiredPermission !== "READ"
  )) {
    const denied = runRuntime(
      ["call", operation.name, "--input", "-", "--dry-run"],
      {}
    );
    assert.equal(denied.status, 1, operation.name);
    assert.equal(firstDiagnosticCode(denied), "PERMISSION_REQUIRED", operation.name);
  }
});

test("every DELETE operation requires the separate destructive confirmation gate", () => {
  const catalog = JSON.parse(runRuntime(["tools", "list"]).stdout);
  const deletes = catalog.operations.filter(
    (operation) => operation.requiredPermission === "DELETE"
  );

  assert.equal(deletes.length, 4);
  for (const operation of deletes) {
    const unconfirmed = runRuntime(
      ["call", operation.name, "--input", "-", "--dry-run", "--allow", "DELETE"],
      {}
    );
    assert.equal(unconfirmed.status, 1, operation.name);
    assert.equal(firstDiagnosticCode(unconfirmed), "CONFIRMATION_REQUIRED", operation.name);
  }
});

test("bundled runtime requires DELETE permission and a separate destructive gate", () => {
  const common = [
    runtime,
    "call",
    "delete_issue",
    "--input",
    "-",
    "--dry-run",
    "--allow",
    "DELETE"
  ];

  const unconfirmed = spawnSync(process.execPath, common, {
    encoding: "utf8",
    env: environment,
    input: JSON.stringify({ issueKey: "PROJ-1" })
  });
  assert.equal(unconfirmed.status, 1);
  assert.equal(
    JSON.parse(unconfirmed.stdout).diagnostics[0].code,
    "CONFIRMATION_REQUIRED"
  );

  const confirmed = spawnSync(process.execPath, [...common, "--confirm-destructive"], {
    encoding: "utf8",
    env: environment,
    input: JSON.stringify({ issueKey: "PROJ-1" })
  });
  assert.equal(confirmed.status, 0);
  assert.equal(JSON.parse(confirmed.stdout).dryRun, true);
});
