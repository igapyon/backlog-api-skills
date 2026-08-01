import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  BacklogSkillRunnerError,
  parseRunnerCliArgs,
  runWorkflow
} from "../skills/igapyon-backlog-api/scripts/backlog-api-skill-run.mjs";
import { WORKFLOW_MANIFEST } from "../skills/igapyon-backlog-api/scripts/backlog-api-workflow-manifest.mjs";

const RUNTIME = {
  path: "/fake/backlog-api.mjs",
  file: "backlog-api-0.6.0.mjs",
  sourceVersion: "0.6.0",
  sha256: "a".repeat(64)
};
const ENVIRONMENT = { BACKLOG_API_ALLOWED_PERMISSIONS: "READ,DELETE" };
const ISSUE = {
  id: 36038410,
  projectId: 8192,
  issueKey: "MIGTEST01-392",
  summary: "Example issue",
  status: { name: "処理中" }
};

function createWorkspace() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-api-skill-runner-"));
  return {
    cwd,
    artifactRoot: path.join(cwd, "handoffs"),
    cleanup() {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  };
}

function fixedNow() {
  let milliseconds = 0;
  return () => new Date(Date.UTC(2026, 7, 1, 0, 0, milliseconds++));
}

function createId(seed) {
  return `${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}-${seed}${seed}${seed}${seed}-4${seed}${seed}${seed}-8${seed}${seed}${seed}-${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}${seed}`;
}

test("workflow manifest exposes only fixed issue-delete routes", () => {
  assert.deepEqual(
    WORKFLOW_MANIFEST.map(({ id, mutationLevel, approvalGate, requiredParameters, runtimeReferences }) => ({
      id,
      mutationLevel,
      approvalGate,
      requiredParameters,
      runtimeReferences
    })),
    [
      {
        id: "issue.delete.preflight",
        mutationLevel: "readonly",
        approvalGate: "preflight",
        requiredParameters: ["issue-key or issue-id"],
        runtimeReferences: []
      },
      {
        id: "issue.delete.handoff.apply",
        mutationLevel: "remote",
        approvalGate: "apply",
        requiredParameters: ["--apply"],
        runtimeReferences: []
      }
    ]
  );
});

test("single issue delete preflight and apply use two fixed runtime calls", () => {
  const workspace = createWorkspace();
  const calls = [];
  try {
    const invokeRuntime = ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_issue") {
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
      if (operation === "delete_issue") {
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
      throw new Error(`unexpected operation: ${operation}`);
    };
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("1"),
      invokeRuntime
    };

    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    assert.equal(preflight.status, "preflight-ok");
    assert.equal(preflight.mutationInvoked, false);
    assert.equal(
      preflight.humanOutput,
      "組織 default の MIGTEST01-392（「Example issue」）を完全に削除します。復元できません。実行しますか？"
    );
    assert.match(preflight.handoffPath, /^handoffs\/[a-f0-9-]+\.json$/);
    assert.deepEqual(calls, [
      {
        operation: "get_issue",
        input: {
          issueKey: ISSUE.issueKey,
          fields: "{ id projectId issueKey summary status { name } }"
        },
        callOptions: ["--verbose"]
      }
    ]);

    const handoffPath = path.join(workspace.cwd, preflight.handoffPath);
    const pendingHandoff = fs.readFileSync(handoffPath, "utf8");
    assert.doesNotMatch(pendingHandoff, /BACKLOG_API_KEY|test-secret/i);
    assert.equal(JSON.parse(pendingHandoff).status, "pending");

    const applied = runWorkflow(
      "issue.delete.handoff.apply",
      ["--apply"],
      dependencies
    );
    assert.equal(applied.status, "success");
    assert.equal(applied.mutationInvoked, true);
    assert.equal(applied.humanOutput, "MIGTEST01-392 を削除しました。");
    assert.deepEqual(calls[1], {
      operation: "delete_issue",
      input: { issueId: ISSUE.id },
      callOptions: ["--allow", "DELETE", "--confirm-destructive", "--verbose"]
    });
    assert.equal(calls.some((call) => call.callOptions.includes("--dry-run")), false);
    const appliedHandoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
    assert.equal(appliedHandoff.status, "applied");
    assert.match(appliedHandoff.recordSha256, /^[a-f0-9]{64}$/);
  } finally {
    workspace.cleanup();
  }
});

test("delete apply requires --apply and leaves the reviewed handoff pending", () => {
  const workspace = createWorkspace();
  try {
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("2"),
      invokeRuntime: ({ operation }) => ({ operation, success: true, result: ISSUE, diagnostics: [] })
    };
    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    assert.throws(
      () => runWorkflow("issue.delete.handoff.apply", [], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "EXPLICIT_APPLY_REQUIRED"
    );
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8")).status,
      "pending"
    );
  } finally {
    workspace.cleanup();
  }
});

test("a delete attempt that fails becomes unresolved and cannot be retried automatically", () => {
  const workspace = createWorkspace();
  try {
    let callCount = 0;
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("3"),
      invokeRuntime: ({ operation }) => {
        callCount += 1;
        return operation === "get_issue"
          ? { operation, success: true, result: ISSUE, diagnostics: [] }
          : { operation, success: false, diagnostics: [{ code: "UPSTREAM_ERROR" }] };
      }
    };
    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    assert.throws(
      () => runWorkflow(
        "issue.delete.handoff.apply",
        ["--apply"],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "BACKLOG_CALL_FAILED"
    );
    const handoffPath = path.join(workspace.cwd, preflight.handoffPath);
    assert.equal(JSON.parse(fs.readFileSync(handoffPath, "utf8")).status, "unresolved");
    assert.equal(callCount, 2);
    assert.throws(
      () => runWorkflow(
        "issue.delete.handoff.apply",
        ["--apply"],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "PENDING_HANDOFF_NOT_FOUND"
    );
    assert.equal(callCount, 2);
  } finally {
    workspace.cleanup();
  }
});

test("apply rejects a runtime artifact that changed after preflight", () => {
  const workspace = createWorkspace();
  try {
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("4"),
      invokeRuntime: ({ operation }) => ({ operation, success: true, result: ISSUE, diagnostics: [] })
    };
    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    assert.throws(
      () => runWorkflow(
        "issue.delete.handoff.apply",
        ["--apply"],
        { ...dependencies, runtime: { ...RUNTIME, sourceVersion: "0.6.1" } }
      ),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "RUNTIME_IDENTITY_CHANGED"
    );
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8")).status,
      "pending"
    );
  } finally {
    workspace.cleanup();
  }
});

test("apply never auto-selects among multiple pending deletion handoffs", () => {
  const workspace = createWorkspace();
  try {
    let id = 5;
    let calls = 0;
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId(String(id++)),
      invokeRuntime: ({ operation }) => {
        calls += 1;
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
    };
    runWorkflow("issue.delete.preflight", ["--issue-key", ISSUE.issueKey], dependencies);
    runWorkflow("issue.delete.preflight", ["--issue-key", ISSUE.issueKey], dependencies);
    assert.throws(
      () => runWorkflow("issue.delete.handoff.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "AMBIGUOUS_PENDING_HANDOFF"
    );
    assert.equal(calls, 2);
  } finally {
    workspace.cleanup();
  }
});

test("apply rejects an existing handoff lock before the remote delete", () => {
  const workspace = createWorkspace();
  try {
    let calls = 0;
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("8"),
      invokeRuntime: ({ operation }) => {
        calls += 1;
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
    };
    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    const handoffPath = path.join(workspace.cwd, preflight.handoffPath);
    fs.writeFileSync(`${handoffPath}.apply.lock`, "", { mode: 0o600 });
    assert.throws(
      () => runWorkflow("issue.delete.handoff.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "HANDOFF_APPLY_IN_PROGRESS"
    );
    assert.equal(calls, 1);
    assert.equal(JSON.parse(fs.readFileSync(handoffPath, "utf8")).status, "pending");
  } finally {
    workspace.cleanup();
  }
});

test("apply rejects a changed handoff record before deleting", () => {
  const workspace = createWorkspace();
  try {
    let calls = 0;
    const dependencies = {
      cwd: workspace.cwd,
      artifactRoot: workspace.artifactRoot,
      environment: ENVIRONMENT,
      runtime: RUNTIME,
      now: fixedNow(),
      createId: () => createId("7"),
      invokeRuntime: ({ operation }) => {
        calls += 1;
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
    };
    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--issue-key", ISSUE.issueKey],
      dependencies
    );
    const handoffPath = path.join(workspace.cwd, preflight.handoffPath);
    const modified = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
    modified.createdAt = "2000-01-01T00:00:00.000Z";
    fs.writeFileSync(handoffPath, `${JSON.stringify(modified, null, 2)}\n`, "utf8");
    assert.throws(
      () => runWorkflow("issue.delete.handoff.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "HANDOFF_RECORD_DIGEST_MISMATCH"
    );
    assert.equal(calls, 1);
  } finally {
    workspace.cleanup();
  }
});

test("runner parser restricts the command surface", () => {
  assert.deepEqual(
    parseRunnerCliArgs(["--format", "human", "issue.delete.preflight", "--issue-key", "PROJ-1"]),
    {
      format: "human",
      workflowId: "issue.delete.preflight",
      workflowArguments: ["--issue-key", "PROJ-1"]
    }
  );
  assert.throws(
    () => parseRunnerCliArgs(["--format", "shell", "issue.delete.preflight"]),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "INVALID_FORMAT"
  );
  assert.throws(
    () => runWorkflow("issue.delete.preflight", ["--command", "rm -rf /"], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "UNKNOWN_OPTION"
  );
  assert.throws(
    () => runWorkflow("issue.delete.handoff.apply", ["--issue-key", "PROJ-1", "--apply"], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "UNKNOWN_OPTION"
  );
});
