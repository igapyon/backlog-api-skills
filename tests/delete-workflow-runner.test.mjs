import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  BacklogSkillRunnerError,
  parseRunnerCliArgs,
  runWorkflow
} from "../skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs";
import { WORKFLOW_MANIFEST } from "../skills/igapyon-miku-backlog-api/scripts/backlog-api-workflow-manifest.mjs";

const RUNTIME = {
  path: "/fake/miku-backlog-api.mjs",
  file: "miku-backlog-api-0.7.0.mjs",
  sourceVersion: "0.7.0",
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

test("workflow manifest exposes common issue-search, issue-list, and issue-delete routes", () => {
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
        id: "context.list",
        mutationLevel: "local-readonly",
        approvalGate: "none",
        requiredParameters: [],
        runtimeReferences: []
      },
      {
        id: "context.select",
        mutationLevel: "local-persist",
        approvalGate: "user-permission-required",
        requiredParameters: ["session", "project", "--persist"],
        runtimeReferences: ["get_project"]
      },
      {
        id: "context.show",
        mutationLevel: "local-readonly",
        approvalGate: "none",
        requiredParameters: ["session"],
        runtimeReferences: []
      },
      {
        id: "context.clear",
        mutationLevel: "local-delete",
        approvalGate: "explicit-clear",
        requiredParameters: ["session"],
        runtimeReferences: []
      },
      {
        id: "issue.recent.record",
        mutationLevel: "local-persist",
        approvalGate: "user-permission-required",
        requiredParameters: ["session", "issue-key or issue-id", "--persist"],
        runtimeReferences: ["get_issue", "get_project"]
      },
      {
        id: "issue.recent.list",
        mutationLevel: "local-readonly",
        approvalGate: "none",
        requiredParameters: ["session"],
        runtimeReferences: []
      },
      {
        id: "issue.recent.clear",
        mutationLevel: "local-delete",
        approvalGate: "explicit-clear",
        requiredParameters: ["session"],
        runtimeReferences: []
      },
      {
        id: "issue.search",
        mutationLevel: "readonly",
        approvalGate: "none",
        requiredParameters: ["project", "at least one supported search condition"],
        runtimeReferences: [
          "get_project",
          "get_project_users",
          "get_categories",
          "get_version_milestone_list",
          "get_priorities",
          "get_resolutions",
          "get_myself",
          "get_issues"
        ]
      },
      {
        id: "issue.save",
        mutationLevel: "local-persist",
        approvalGate: "user-permission-required",
        requiredParameters: ["project", "at least one supported search condition", "--persist"],
        runtimeReferences: [
          "get_project",
          "get_project_users",
          "get_categories",
          "get_version_milestone_list",
          "get_priorities",
          "get_resolutions",
          "get_myself",
          "get_issues"
        ]
      },
      {
        id: "issue.export.xlsx.preflight",
        mutationLevel: "local-preflight",
        approvalGate: "export-preview",
        requiredParameters: ["project", "at least one supported search condition", "--persist", "--md2xlsx-runtime"],
        runtimeReferences: [
          "get_project",
          "get_project_users",
          "get_categories",
          "get_version_milestone_list",
          "get_priorities",
          "get_resolutions",
          "get_myself",
          "get_issues"
        ]
      },
      {
        id: "issue.export.xlsx.apply",
        mutationLevel: "local-write",
        approvalGate: "apply",
        requiredParameters: ["--apply"],
        runtimeReferences: []
      },
      {
        id: "issue.create.preflight",
        mutationLevel: "local-preflight",
        approvalGate: "create-preview",
        requiredParameters: ["project", "summary", "issue-type", "priority", "--persist"],
        runtimeReferences: ["get_project", "get_issue_types", "get_priorities"]
      },
      {
        id: "issue.create.apply",
        mutationLevel: "remote",
        approvalGate: "apply",
        requiredParameters: ["--apply"],
        runtimeReferences: ["add_issue"]
      },
      {
        id: "issue.update.preflight",
        mutationLevel: "local-preflight",
        approvalGate: "update-preview",
        requiredParameters: ["issue-key or issue-id", "at least one supported fixed field", "--persist"],
        runtimeReferences: ["get_issue", "get_project", "get_priorities", "get_project_users"]
      },
      {
        id: "issue.update.apply",
        mutationLevel: "remote",
        approvalGate: "apply",
        requiredParameters: ["--apply"],
        runtimeReferences: ["get_issue", "update_issue"]
      },
      {
        id: "issue.list.incomplete",
        mutationLevel: "readonly",
        approvalGate: "none",
        requiredParameters: ["project"],
        runtimeReferences: ["get_project", "get_issues"]
      },
      {
        id: "issue.hygiene",
        mutationLevel: "readonly",
        approvalGate: "none",
        requiredParameters: ["project", "at least one hygiene condition"],
        runtimeReferences: ["get_project", "get_issues"]
      },
      {
        id: "notification.triage",
        mutationLevel: "readonly",
        approvalGate: "none",
        requiredParameters: [],
        runtimeReferences: ["get_notifications"]
      },
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

test("Issue save requires explicit persistence and writes a compact owner-only result", () => {
  const workspace = createWorkspace();
  const savedIssueRoot = path.join(workspace.cwd, "saved-issues");
  const dependencies = {
    cwd: workspace.cwd,
    savedIssueRoot,
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
    runtime: RUNTIME,
    now: () => new Date("2026-08-14T00:00:00.000Z"),
    invokeRuntime: ({ operation }) => {
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      if (operation === "get_issues") {
        return {
          operation,
          success: true,
          result: [{
            issueKey: "MIGTEST01-401",
            summary: "Reviewed result",
            status: { id: 1, name: "未対応" },
            created: "2026-08-01T00:00:00Z",
            updated: "2026-08-13T00:00:00Z"
          }],
          diagnostics: []
        };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow("issue.save", ["--project", "MIGTEST01", "--incomplete"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "SAVE_PERSIST_PERMISSION_REQUIRED"
    );
    assert.equal(fs.existsSync(savedIssueRoot), false);

    const result = runWorkflow(
      "issue.save",
      ["--project", "MIGTEST01", "--incomplete", "--persist"],
      dependencies
    );
    assert.equal(result.workflow, "issue.save");
    assert.equal(result.savedIssueCount, 1);
    assert.match(result.savePath, /^saved-issues\/issues-20260814T000000Z-[a-f0-9-]+\.json$/);
    const savedPath = path.join(workspace.cwd, result.savePath);
    assert.equal(fs.statSync(savedIssueRoot).mode & 0o777, 0o700);
    assert.equal(fs.statSync(savedPath).mode & 0o777, 0o600);
    const saved = JSON.parse(fs.readFileSync(savedPath, "utf8"));
    assert.deepEqual(saved, {
      schemaVersion: "backlog-api-skills.saved-issue-result/v1",
      savedAt: "2026-08-14T00:00:00.000Z",
      purpose: "issue-search-result",
      organization: "default",
      project: { id: 8192, key: "MIGTEST01", name: "Migration test" },
      issueCount: 1,
      scannedIssueCount: 1,
      pageCount: 1,
      issues: [{
        issueKey: "MIGTEST01-401",
        summary: "Reviewed result",
        status: "未対応",
        created: "2026-08-01T00:00:00Z",
        updated: "2026-08-13T00:00:00Z"
      }]
    });
    assert.doesNotMatch(fs.readFileSync(savedPath, "utf8"), /API_KEY|domain|description|comment/i);
  } finally {
    workspace.cleanup();
  }
});

test("XLSX export previews a compact Issue selection before one owner-only conversion", () => {
  const workspace = createWorkspace();
  const converter = path.join(workspace.cwd, "miku-md2xlsx-0.9.5.mjs");
  fs.writeFileSync(converter, "// synthetic converter runtime\n", "utf8");
  const dependencies = {
    cwd: workspace.cwd,
    xlsxExportHandoffRoot: path.join(workspace.cwd, "xlsx-handoffs"),
    xlsxExportRoot: path.join(workspace.cwd, "issue-exports"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
    runtime: RUNTIME,
    now: fixedNow(),
    createXlsxExportId: () => createId("a"),
    invokeRuntime: ({ operation }) => {
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      if (operation === "get_issues") {
        return {
          operation,
          success: true,
          result: [{
            issueKey: "MIGTEST01-401",
            summary: "Reviewed export result",
            status: { id: 1, name: "未対応" },
            created: "2026-08-01T00:00:00Z",
            updated: "2026-08-13T00:00:00Z"
          }],
          diagnostics: []
        };
      }
      throw new Error(`unexpected operation: ${operation}`);
    },
    spawnMd2xlsx: (_command, argumentsList) => {
      assert.equal(argumentsList[0], converter);
      assert.equal(argumentsList[2], "--out");
      fs.writeFileSync(argumentsList[3], "synthetic xlsx", "utf8");
      return { status: 0, stdout: "", stderr: "" };
    }
  };

  try {
    assert.throws(
      () => runWorkflow(
        "issue.export.xlsx.preflight",
        ["--project", "MIGTEST01", "--incomplete", "--md2xlsx-runtime", converter],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "XLSX_EXPORT_PERSIST_PERMISSION_REQUIRED"
    );

    const preflight = runWorkflow(
      "issue.export.xlsx.preflight",
      ["--project", "MIGTEST01", "--incomplete", "--md2xlsx-runtime", converter, "--persist"],
      dependencies
    );
    assert.equal(preflight.status, "preflight-ok");
    assert.equal(preflight.issueCount, 1);
    assert.deepEqual(preflight.columns, [
      "Organization", "Project", "Issue key", "Status", "Summary", "Created", "Updated"
    ]);
    assert.match(preflight.humanOutput, /この内容でローカル XLSX を作成しますか？/);
    assert.equal(fs.existsSync(path.join(workspace.cwd, preflight.xlsxPath)), false);

    const applied = runWorkflow("issue.export.xlsx.apply", ["--apply"], dependencies);
    const xlsxPath = path.join(workspace.cwd, applied.xlsxPath);
    const markdownPath = path.join(workspace.cwd, applied.markdownPath);
    assert.equal(applied.status, "success");
    assert.equal(fs.statSync(path.dirname(xlsxPath)).mode & 0o777, 0o700);
    assert.equal(fs.statSync(xlsxPath).mode & 0o777, 0o600);
    assert.equal(fs.statSync(markdownPath).mode & 0o777, 0o600);
    assert.match(fs.readFileSync(markdownPath, "utf8"), /\| MIGTEST01 \| MIGTEST01-401 \| 未対応 \| Reviewed export result/);
    assert.doesNotMatch(fs.readFileSync(markdownPath, "utf8"), /API_KEY|description|comment/i);
    const handoff = JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8"));
    assert.equal(handoff.status, "applied");
  } finally {
    workspace.cleanup();
  }
});

test("Issue creation resolves names, previews the payload, and applies one reviewed handoff", () => {
  const workspace = createWorkspace();
  const calls = [];
  const dependencies = {
    cwd: workspace.cwd,
    issueCreateHandoffRoot: path.join(workspace.cwd, "create-handoffs"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ,CREATE" },
    runtime: RUNTIME,
    now: fixedNow(),
    createIssueCreateId: () => createId("b"),
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      if (operation === "get_issue_types") {
        return { operation, success: true, result: [{ id: 31, name: "Task" }], diagnostics: [] };
      }
      if (operation === "get_priorities") {
        return { operation, success: true, result: [{ id: 3, name: "Normal" }], diagnostics: [] };
      }
      if (operation === "add_issue") {
        return {
          operation,
          success: true,
          result: { id: 36038500, projectId: 8192, issueKey: "MIGTEST01-500", summary: "Create workflow" },
          diagnostics: []
        };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow(
        "issue.create.preflight",
        ["--project", "MIGTEST01", "--summary", "Create workflow", "--issue-type", "Task", "--priority", "Normal"],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "CREATE_HANDOFF_PERSIST_PERMISSION_REQUIRED"
    );
    assert.equal(calls.length, 0);

    const preflight = runWorkflow(
      "issue.create.preflight",
      [
        "--organization", "ALPHA",
        "--project", "MIGTEST01",
        "--summary", "Create workflow",
        "--issue-type", "Task",
        "--priority", "Normal",
        "--description", "Explicit reviewed description",
        "--persist"
      ],
      dependencies
    );
    assert.equal(preflight.status, "preflight-ok");
    assert.match(preflight.humanOutput, /作成しますか？/);
    assert.equal(fs.statSync(path.join(workspace.cwd, preflight.handoffPath)).mode & 0o777, 0o600);
    assert.deepEqual(calls, [
      {
        operation: "get_project",
        input: { organization: "ALPHA", projectKey: "MIGTEST01", fields: "{ id projectKey name }" },
        callOptions: ["--verbose"]
      },
      {
        operation: "get_issue_types",
        input: { organization: "ALPHA", projectId: 8192, fields: "{ id name }" },
        callOptions: ["--verbose"]
      },
      {
        operation: "get_priorities",
        input: { organization: "ALPHA", fields: "{ id name }" },
        callOptions: ["--verbose"]
      }
    ]);

    const applied = runWorkflow("issue.create.apply", ["--apply"], dependencies);
    assert.equal(applied.status, "success");
    assert.equal(applied.mutationInvoked, true);
    assert.deepEqual(applied.issue, { id: 36038500, issueKey: "MIGTEST01-500", summary: "Create workflow" });
    assert.deepEqual(calls[3], {
      operation: "add_issue",
      input: {
        organization: "ALPHA",
        projectId: 8192,
        summary: "Create workflow",
        issueTypeId: 31,
        priorityId: 3,
        description: "Explicit reviewed description",
        fields: "{ id projectId issueKey summary }"
      },
      callOptions: ["--allow", "CREATE", "--verbose"]
    });
    assert.equal(JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8")).status, "applied");
  } finally {
    workspace.cleanup();
  }
});

test("Issue update previews one fixed change set, rereads its snapshot, and applies it once", () => {
  const workspace = createWorkspace();
  const calls = [];
  const before = {
    id: ISSUE.id,
    projectId: ISSUE.projectId,
    issueKey: ISSUE.issueKey,
    summary: "Original summary",
    description: "Original description",
    dueDate: "2026-08-20",
    priority: { id: 3, name: "Normal" },
    assignee: { id: 100, name: "Alice" },
    updated: "2026-08-14T00:00:00Z"
  };
  const after = {
    ...before,
    summary: "Reviewed summary",
    description: "Reviewed description",
    dueDate: "2026-08-31",
    priority: { id: 2, name: "High" },
    assignee: { id: 101, name: "Bob" },
    updated: "2026-08-14T00:01:00Z"
  };
  let issueReadCount = 0;
  const dependencies = {
    cwd: workspace.cwd,
    issueUpdateHandoffRoot: path.join(workspace.cwd, "update-handoffs"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ,UPDATE" },
    runtime: RUNTIME,
    now: fixedNow(),
    createIssueUpdateId: () => createId("c"),
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_issue") {
        issueReadCount += 1;
        return { operation, success: true, result: issueReadCount === 1 ? before : before, diagnostics: [] };
      }
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      if (operation === "get_priorities") {
        return { operation, success: true, result: [{ id: 2, name: "High" }], diagnostics: [] };
      }
      if (operation === "get_project_users") {
        return { operation, success: true, result: [{ id: 101, name: "Bob" }], diagnostics: [] };
      }
      if (operation === "update_issue") {
        return { operation, success: true, result: after, diagnostics: [] };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow(
        "issue.update.preflight",
        ["--issue-key", ISSUE.issueKey, "--summary", "Reviewed summary"],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "UPDATE_HANDOFF_PERSIST_PERMISSION_REQUIRED"
    );
    assert.equal(calls.length, 0);

    const preflight = runWorkflow(
      "issue.update.preflight",
      [
        "--organization", "ALPHA",
        "--issue-key", ISSUE.issueKey,
        "--summary", "Reviewed summary",
        "--description", "Reviewed description",
        "--due-date", "2026-08-31",
        "--priority", "2",
        "--assignee", "Bob",
        "--persist"
      ],
      dependencies
    );
    assert.equal(preflight.status, "preflight-ok");
    assert.equal(preflight.changes.length, 5);
    assert.match(preflight.humanOutput, /実行しますか？/);
    assert.match(preflight.snapshotSha256, /^[a-f0-9]{64}$/);
    assert.equal(fs.statSync(path.join(workspace.cwd, preflight.handoffPath)).mode & 0o777, 0o600);
    assert.deepEqual(calls.slice(0, 3), [
      {
        operation: "get_issue",
        input: { organization: "ALPHA", issueKey: ISSUE.issueKey, fields: "{ id projectId issueKey summary description dueDate priority { id name } assignee { id name } updated }" },
        callOptions: ["--verbose"]
      },
      {
        operation: "get_project",
        input: { organization: "ALPHA", projectId: 8192, fields: "{ id projectKey name }" },
        callOptions: ["--verbose"]
      },
      {
        operation: "get_project_users",
        input: { organization: "ALPHA", projectId: 8192, fields: "{ id name }" },
        callOptions: ["--verbose"]
      }
    ]);

    const applied = runWorkflow("issue.update.apply", ["--apply"], dependencies);
    assert.equal(applied.status, "success");
    assert.equal(applied.mutationInvoked, true);
    assert.deepEqual(applied.issue, { id: ISSUE.id, issueKey: ISSUE.issueKey, summary: "Reviewed summary" });
    assert.deepEqual(calls[3], {
      operation: "get_issue",
      input: {
        issueId: ISSUE.id,
        organization: "ALPHA",
        fields: "{ id projectId issueKey summary description dueDate priority { id name } assignee { id name } updated }"
      },
      callOptions: ["--verbose"]
    });
    assert.deepEqual(calls[4], {
      operation: "update_issue",
      input: {
        organization: "ALPHA",
        issueId: ISSUE.id,
        summary: "Reviewed summary",
        description: "Reviewed description",
        dueDate: "2026-08-31",
        priorityId: 2,
        assigneeId: 101,
        fields: "{ id projectId issueKey summary description dueDate priority { id name } assignee { id name } updated }"
      },
      callOptions: ["--allow", "UPDATE", "--verbose"]
    });
    assert.equal(JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8")).status, "applied");
  } finally {
    workspace.cleanup();
  }
});

test("Issue update stops before mutation when its reviewed snapshot changed", () => {
  const workspace = createWorkspace();
  const before = {
    id: ISSUE.id,
    projectId: ISSUE.projectId,
    issueKey: ISSUE.issueKey,
    summary: "Original summary",
    description: "Original description",
    dueDate: null,
    priority: { id: 3, name: "Normal" },
    assignee: null,
    updated: "2026-08-14T00:00:00Z"
  };
  const changed = { ...before, updated: "2026-08-14T00:05:00Z" };
  const calls = [];
  let issueReadCount = 0;
  const dependencies = {
    cwd: workspace.cwd,
    issueUpdateHandoffRoot: path.join(workspace.cwd, "update-handoffs"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ,UPDATE" },
    runtime: RUNTIME,
    now: fixedNow(),
    createIssueUpdateId: () => createId("d"),
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_issue") {
        issueReadCount += 1;
        return { operation, success: true, result: issueReadCount === 1 ? before : changed, diagnostics: [] };
      }
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    const preflight = runWorkflow(
      "issue.update.preflight",
      ["--issue-key", ISSUE.issueKey, "--summary", "Reviewed summary", "--persist"],
      dependencies
    );
    assert.throws(
      () => runWorkflow("issue.update.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "ISSUE_UPDATE_SNAPSHOT_CONFLICT"
    );
    assert.equal(calls.some((call) => call.operation === "update_issue"), false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(workspace.cwd, preflight.handoffPath), "utf8")).status, "conflict");
    assert.throws(
      () => runWorkflow("issue.update.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "PENDING_ISSUE_UPDATE_HANDOFF_NOT_FOUND"
    );
  } finally {
    workspace.cleanup();
  }
});

test("Issue update rejects a pre-existing apply lock and does not clear supported fields", () => {
  const workspace = createWorkspace();
  const before = {
    id: ISSUE.id,
    projectId: ISSUE.projectId,
    issueKey: ISSUE.issueKey,
    summary: "Original summary",
    description: "Original description",
    dueDate: null,
    priority: { id: 3, name: "Normal" },
    assignee: null,
    updated: "2026-08-14T00:00:00Z"
  };
  let calls = 0;
  const dependencies = {
    cwd: workspace.cwd,
    issueUpdateHandoffRoot: path.join(workspace.cwd, "update-handoffs"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ,UPDATE" },
    runtime: RUNTIME,
    now: fixedNow(),
    createIssueUpdateId: () => createId("e"),
    invokeRuntime: ({ operation }) => {
      calls += 1;
      if (operation === "get_issue") return { operation, success: true, result: before, diagnostics: [] };
      if (operation === "get_project") {
        return { operation, success: true, result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" }, diagnostics: [] };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow(
        "issue.update.preflight",
        ["--issue-key", ISSUE.issueKey, "--description", "", "--persist"],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "INVALID_OPTION_VALUE"
    );
    assert.equal(calls, 0);
    const preflight = runWorkflow(
      "issue.update.preflight",
      ["--issue-key", ISSUE.issueKey, "--summary", "Reviewed summary", "--persist"],
      dependencies
    );
    const handoffPath = path.join(workspace.cwd, preflight.handoffPath);
    fs.writeFileSync(`${handoffPath}.apply.lock`, "", { mode: 0o600 });
    assert.throws(
      () => runWorkflow("issue.update.apply", ["--apply"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "ISSUE_UPDATE_HANDOFF_APPLY_IN_PROGRESS"
    );
    assert.equal(calls, 2);
    assert.equal(JSON.parse(fs.readFileSync(handoffPath, "utf8")).status, "pending");
  } finally {
    workspace.cleanup();
  }
});

test("Issue hygiene is read-only and reports only explicit heuristic reasons", () => {
  const calls = [];
  const result = runWorkflow(
    "issue.hygiene",
    ["--organization", "ALPHA", "--project", "MIGTEST01", "--overdue", "--stale-days", "30", "--without-parent"],
    {
      environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
      runtime: RUNTIME,
      now: () => new Date("2026-08-14T08:00:00.000Z"),
      invokeRuntime: ({ operation, input, callOptions }) => {
        calls.push({ operation, input, callOptions });
        if (operation === "get_project") {
          return {
            operation,
            success: true,
            result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
            diagnostics: []
          };
        }
        if (operation === "get_issues") {
          return {
            operation,
            success: true,
            result: [
              {
                issueKey: "MIGTEST01-401",
                summary: "Overdue and stale",
                status: { id: 1, name: "未対応" },
                dueDate: "2026-08-13",
                parentIssueId: 10,
                updated: "2026-07-01T00:00:00Z"
              },
              {
                issueKey: "MIGTEST01-402",
                summary: "Parent absent",
                status: { id: 2, name: "処理中" },
                dueDate: null,
                parentIssueId: null,
                updated: "2026-08-14T00:00:00Z"
              },
              {
                issueKey: "MIGTEST01-403",
                summary: "Closed and ignored",
                status: { id: 4, name: "完了" },
                dueDate: "2026-08-01",
                parentIssueId: null,
                updated: "2026-07-01T00:00:00Z"
              }
            ],
            diagnostics: []
          };
        }
        throw new Error(`unexpected operation: ${operation}`);
      }
    }
  );

  assert.equal(result.mutationInvoked, false);
  assert.equal(result.issueCount, 2);
  assert.deepEqual(result.issues, [
    {
      issueKey: "MIGTEST01-401",
      summary: "Overdue and stale",
      status: "未対応",
      dueDate: "2026-08-13",
      updated: "2026-07-01T00:00:00Z",
      reasons: ["期限超過", "30日以上更新なし"]
    },
    {
      issueKey: "MIGTEST01-402",
      summary: "Parent absent",
      status: "処理中",
      dueDate: null,
      updated: "2026-08-14T00:00:00Z",
      reasons: ["親Issue未設定"]
    }
  ]);
  assert.deepEqual(calls[1], {
    operation: "get_issues",
    input: {
      organization: "ALPHA",
      projectId: [8192],
      fields: "{ issueKey summary status { id name } dueDate parentIssueId updated }",
      sort: "updated",
      order: "asc",
      offset: 0,
      count: 100
    },
    callOptions: ["--verbose"]
  });
});

test("notification triage remains read-only and preserves unknown reason codes", () => {
  const calls = [];
  const result = runWorkflow("notification.triage", ["--organization", "ALPHA", "--unread", "--limit", "5"], {
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
    runtime: RUNTIME,
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      return {
        operation,
        success: true,
        result: [
          {
            id: 77,
            alreadyRead: false,
            reason: 99,
            resourceAlreadyRead: false,
            created: "2026-08-14T00:00:00Z",
            issue: { issueKey: "MIGTEST01-401" }
          },
          {
            id: 76,
            alreadyRead: true,
            reason: 1,
            resourceAlreadyRead: true,
            created: "2026-08-13T00:00:00Z",
            issue: null
          }
        ],
        diagnostics: []
      };
    }
  });
  assert.equal(result.mutationInvoked, false);
  assert.deepEqual(result.notifications, [{
    id: 77,
    alreadyRead: false,
    reason: 99,
    resourceAlreadyRead: false,
    created: "2026-08-14T00:00:00Z",
    issueKey: "MIGTEST01-401"
  }]);
  assert.match(result.humanOutput, /reason=99/);
  assert.match(result.humanOutput, /推測でメンション扱いにしません/);
  assert.deepEqual(calls, [{
    operation: "get_notifications",
    input: {
      organization: "ALPHA",
      count: 5,
      order: "desc",
      fields: "{ id alreadyRead reason resourceAlreadyRead created issue { issueKey } }"
    },
    callOptions: ["--verbose"]
  }]);
});

test("incomplete issue list paginates internally, excludes closed issues, and sorts the concise result", () => {
  const calls = [];
  const firstPage = Array.from({ length: 100 }, (_, index) => ({
    issueKey: `MIGTEST01-${index + 1}`,
    summary: `Closed ${index + 1}`,
    status: { id: 4, name: "完了" },
    created: `2026-07-01T00:${String(index).padStart(2, "0")}:00Z`,
    updated: `2026-08-01T00:${String(index).padStart(2, "0")}:00Z`
  }));
  firstPage[0] = {
    issueKey: "MIGTEST01-401",
    summary: "Older open issue",
    status: { id: 1, name: "未対応" },
    created: "2026-07-01T00:00:00Z",
    updated: "2026-08-01T00:00:00Z"
  };
  firstPage[1] = {
    issueKey: "MIGTEST01-402",
    summary: "Resolved but not closed",
    status: { id: 3, name: "処理済み" },
    created: "2026-07-01T01:00:00Z",
    updated: "2026-08-01T01:00:00Z"
  };
  const secondPage = [
    {
      issueKey: "MIGTEST01-403",
      summary: "Newest open issue",
      status: { id: 2, name: "処理中" },
      created: "2026-07-02T00:00:00Z",
      updated: "2026-08-02T00:00:00Z"
    },
    {
      issueKey: "MIGTEST01-404",
      summary: "Closed final page issue",
      status: { id: 4, name: "完了" },
      created: "2026-07-02T01:00:00Z",
      updated: "2026-08-02T01:00:00Z"
    }
  ];
  const result = runWorkflow("issue.list.incomplete", [
    "--organization", "example",
    "--project", "MIGTEST01"
  ], {
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
    runtime: RUNTIME,
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      return {
        operation,
        success: true,
        result: input.offset === 0 ? firstPage : secondPage,
        diagnostics: []
      };
    }
  });

  assert.equal(result.status, "success");
  assert.equal(result.mutationInvoked, false);
  assert.equal(result.organization, "example");
  assert.deepEqual(result.project, { id: 8192, key: "MIGTEST01", name: "Migration test" });
  assert.equal(result.issueCount, 3);
  assert.equal(result.scannedIssueCount, 102);
  assert.equal(result.pageCount, 2);
  assert.deepEqual(result.issues, [
    { issueKey: "MIGTEST01-403", summary: "Newest open issue", status: "処理中", created: "2026-07-02T00:00:00Z", updated: "2026-08-02T00:00:00Z" },
    { issueKey: "MIGTEST01-402", summary: "Resolved but not closed", status: "処理済み", created: "2026-07-01T01:00:00Z", updated: "2026-08-01T01:00:00Z" },
    { issueKey: "MIGTEST01-401", summary: "Older open issue", status: "未対応", created: "2026-07-01T00:00:00Z", updated: "2026-08-01T00:00:00Z" }
  ]);
  assert.equal(
    result.humanOutput,
    [
      "組織 example・プロジェクト MIGTEST01（Migration test）のIssue検索（完了以外、更新日時新しい順）: 3件（102件を2ページ取得）",
      "MIGTEST01-403\t処理中\tNewest open issue\t2026-08-02T00:00:00Z",
      "MIGTEST01-402\t処理済み\tResolved but not closed\t2026-08-01T01:00:00Z",
      "MIGTEST01-401\t未対応\tOlder open issue\t2026-08-01T00:00:00Z"
    ].join("\n")
  );
  assert.deepEqual(calls, [
    {
      operation: "get_project",
      input: {
        organization: "example",
        projectKey: "MIGTEST01",
        fields: "{ id projectKey name }"
      },
      callOptions: ["--verbose"]
    },
    {
      operation: "get_issues",
      input: {
        organization: "example",
        projectId: [8192],
        fields: "{ issueKey summary status { id name } created updated }",
        sort: "updated",
        order: "desc",
        offset: 0,
        count: 100
      },
      callOptions: ["--verbose"]
    },
    {
      operation: "get_issues",
      input: {
        organization: "example",
        projectId: [8192],
        fields: "{ issueKey summary status { id name } created updated }",
        sort: "updated",
        order: "desc",
        offset: 100,
        count: 100
      },
      callOptions: ["--verbose"]
    }
  ]);
});

test("common issue search combines keyword, current assignee, relative dates, and sort order", () => {
  const calls = [];
  const result = runWorkflow(
    "issue.search",
    [
      "--organization", "example",
      "--project", "MIGTEST01",
      "--keyword", "migration",
      "--assignee", "me",
      "--created-within-days", "7",
      "--updated-within-days", "7",
      "--sort", "created",
      "--order", "asc"
    ],
    {
      environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
      runtime: RUNTIME,
      now: () => new Date("2026-08-01T12:00:00Z"),
      invokeRuntime: ({ operation, input, callOptions }) => {
        calls.push({ operation, input, callOptions });
        if (operation === "get_project") {
          return {
            operation,
            success: true,
            result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
            diagnostics: []
          };
        }
        if (operation === "get_myself") {
          return { operation, success: true, result: { id: 901 }, diagnostics: [] };
        }
        return {
          operation,
          success: true,
          result: [
            {
              issueKey: "MIGTEST01-500",
              summary: "Second migration issue",
              status: { id: 1, name: "未対応" },
              created: "2026-07-30T00:00:00Z",
              updated: "2026-08-01T00:00:00Z"
            },
            {
              issueKey: "MIGTEST01-499",
              summary: "First migration issue",
              status: { id: 2, name: "処理中" },
              created: "2026-07-28T00:00:00Z",
              updated: "2026-07-31T00:00:00Z"
            }
          ],
          diagnostics: []
        };
      }
    }
  );

  assert.equal(result.workflow, "issue.search");
  assert.equal(result.issueCount, 2);
  assert.deepEqual(result.issues.map((issue) => issue.issueKey), ["MIGTEST01-499", "MIGTEST01-500"]);
  assert.match(result.humanOutput, /キーワード「migration」、担当: 自分、登録: 過去7日、更新: 過去7日、登録日時古い順/);
  assert.deepEqual(calls, [
    {
      operation: "get_project",
      input: {
        organization: "example",
        projectKey: "MIGTEST01",
        fields: "{ id projectKey name }"
      },
      callOptions: ["--verbose"]
    },
    {
      operation: "get_myself",
      input: { organization: "example", fields: "{ id }" },
      callOptions: ["--verbose"]
    },
    {
      operation: "get_issues",
      input: {
        organization: "example",
        projectId: [8192],
        keyword: "migration",
        assigneeId: [901],
        createdSince: "2026-07-25",
        updatedSince: "2026-07-25",
        fields: "{ issueKey summary status { id name } created updated }",
        sort: "created",
        order: "asc",
        offset: 0,
        count: 100
      },
      callOptions: ["--verbose"]
    }
  ]);
});

test("common issue search resolves project-scoped names and sends supported filters together", () => {
  const calls = [];
  const catalogs = {
    get_project_users: [{ id: 901, name: "Alice" }],
    get_priorities: [{ id: 2, name: "高" }],
    get_categories: [{ id: 31, name: "API" }, { id: 32, name: "Docs" }],
    get_version_milestone_list: [{ id: 41, name: "v2" }, { id: 42, name: "Sprint 3" }],
    get_resolutions: [{ id: 1, name: "対応済み" }]
  };
  const result = runWorkflow(
    "issue.search",
    [
      "--project", "MIGTEST01",
      "--assignee", "Alice",
      "--priority", "高",
      "--milestone", "Sprint 3",
      "--category", "API",
      "--category", "Docs",
      "--version", "v2",
      "--due-from", "2026-08-01",
      "--due-to", "2026-08-31",
      "--resolution", "対応済み"
    ],
    {
      environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
      runtime: RUNTIME,
      invokeRuntime: ({ operation, input, callOptions }) => {
        calls.push({ operation, input, callOptions });
        if (operation === "get_project") {
          return {
            operation,
            success: true,
            result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
            diagnostics: []
          };
        }
        return {
          operation,
          success: true,
          result: catalogs[operation] ?? [],
          diagnostics: []
        };
      }
    }
  );

  assert.equal(result.issueCount, 0);
  assert.match(
    result.humanOutput,
    /担当: Alice、優先度: 高、マイルストーン: Sprint 3、カテゴリー: API \/ Docs、発生バージョン: v2、期限日: 2026-08-01以降、期限日: 2026-08-31以前、完了理由: 対応済み/
  );
  assert.deepEqual(calls.map(({ operation }) => operation), [
    "get_project",
    "get_project_users",
    "get_priorities",
    "get_categories",
    "get_version_milestone_list",
    "get_resolutions",
    "get_issues"
  ]);
  assert.deepEqual(calls.at(-1), {
    operation: "get_issues",
    input: {
      projectId: [8192],
      assigneeId: [901],
      priorityId: [2],
      milestoneId: [42],
      categoryId: [31, 32],
      versionId: [41],
      resolutionId: [1],
      dueDateSince: "2026-08-01",
      dueDateUntil: "2026-08-31",
      fields: "{ issueKey summary status { id name } created updated }",
      sort: "updated",
      order: "desc",
      offset: 0,
      count: 100
    },
    callOptions: ["--verbose"]
  });
});

test("common issue search rejects an ambiguous resource name", () => {
  assert.throws(
    () => runWorkflow(
      "issue.search",
      ["--project", "MIGTEST01", "--category", "API"],
      {
        environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
        runtime: RUNTIME,
        invokeRuntime: ({ operation }) => {
          if (operation === "get_project") {
            return {
              operation,
              success: true,
              result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
              diagnostics: []
            };
          }
          return {
            operation,
            success: true,
            result: [{ id: 31, name: "API" }, { id: 32, name: "API" }],
            diagnostics: []
          };
        }
      }
    ),
    (error) => error instanceof BacklogSkillRunnerError
      && error.code === "SEARCH_REFERENCE_AMBIGUOUS"
  );
});

test("working context lists configured spaces without exposing credentials", () => {
  const result = runWorkflow("context.list", [], {
    environment: {
      BACKLOG_ORG_ALPHA_DOMAIN: "alpha.backlog.com",
      BACKLOG_ORG_ALPHA_API_KEY: "alpha-secret",
      BACKLOG_ORG_BETA_DOMAIN: "beta.backlog.com"
    }
  });

  assert.equal(result.status, "success");
  assert.equal(result.mutationInvoked, false);
  assert.deepEqual(result.spaces, [
    { name: "ALPHA", configured: true },
    { name: "BETA", configured: false }
  ]);
  assert.doesNotMatch(result.humanOutput, /backlog\.com|secret/i);
});

test("working context requires explicit persistence and scopes issue search", () => {
  const workspace = createWorkspace();
  const calls = [];
  const session = "conversation-17";
  const dependencies = {
    cwd: workspace.cwd,
    contextRoot: path.join(workspace.cwd, "contexts"),
    environment: { BACKLOG_API_ALLOWED_PERMISSIONS: "READ" },
    runtime: RUNTIME,
    now: () => new Date("2026-08-14T00:00:00.000Z"),
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      if (operation === "get_issues") {
        return { operation, success: true, result: [], diagnostics: [] };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow("context.select", ["--session", session, "--project", "MIGTEST01"], dependencies),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "CONTEXT_PERSIST_PERMISSION_REQUIRED"
    );
    assert.equal(calls.length, 0);

    const selected = runWorkflow(
      "context.select",
      ["--session", session, "--organization", "ALPHA", "--project", "MIGTEST01", "--persist"],
      dependencies
    );
    assert.deepEqual(selected.context, {
      organization: "ALPHA",
      project: { id: 8192, key: "MIGTEST01", name: "Migration test" }
    });
    assert.equal(fs.statSync(path.join(workspace.cwd, selected.contextPath)).mode & 0o777, 0o600);

    const searched = runWorkflow(
      "issue.search",
      ["--context-session", session, "--incomplete"],
      dependencies
    );
    assert.equal(searched.organization, "ALPHA");
    assert.deepEqual(searched.context, selected.context);
    assert.deepEqual(calls.slice(1), [
      {
        operation: "get_project",
        input: { organization: "ALPHA", projectKey: "MIGTEST01", fields: "{ id projectKey name }" },
        callOptions: ["--verbose"]
      },
      {
        operation: "get_issues",
        input: {
          organization: "ALPHA",
          projectId: [8192],
          fields: "{ issueKey summary status { id name } created updated }",
          sort: "updated",
          order: "desc",
          offset: 0,
          count: 100
        },
        callOptions: ["--verbose"]
      }
    ]);

    const shown = runWorkflow("context.show", ["--session", session], dependencies);
    assert.equal(shown.humanOutput, "現在の作業コンテキスト: 組織 ALPHA・プロジェクト MIGTEST01（Migration test）");
    runWorkflow("context.clear", ["--session", session], dependencies);
    assert.throws(
      () => runWorkflow("context.show", ["--session", session], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "CONTEXT_NOT_FOUND"
    );
  } finally {
    workspace.cleanup();
  }
});

test("working context blocks a delete preflight outside its selected project", () => {
  const workspace = createWorkspace();
  const session = "conversation-17";
  const dependencies = {
    cwd: workspace.cwd,
    contextRoot: path.join(workspace.cwd, "contexts"),
    environment: ENVIRONMENT,
    runtime: RUNTIME,
    now: fixedNow(),
    invokeRuntime: ({ operation }) => {
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 9999, projectKey: "OTHER", name: "Other project" },
          diagnostics: []
        };
      }
      if (operation === "get_issue") {
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    runWorkflow(
      "context.select",
      ["--session", session, "--project", "OTHER", "--persist"],
      dependencies
    );
    assert.throws(
      () => runWorkflow(
        "issue.delete.preflight",
        ["--issue-key", ISSUE.issueKey, "--context-session", session],
        dependencies
      ),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "CONTEXT_PROJECT_MISMATCH"
    );
  } finally {
    workspace.cleanup();
  }
});

test("recent Issue history requires permission and reuses the exact recorded target", () => {
  const workspace = createWorkspace();
  const session = "conversation-8";
  const calls = [];
  const dependencies = {
    cwd: workspace.cwd,
    artifactRoot: workspace.artifactRoot,
    recentIssueRoot: path.join(workspace.cwd, "recent-issues"),
    environment: ENVIRONMENT,
    runtime: RUNTIME,
    now: fixedNow(),
    createId: () => createId("9"),
    invokeRuntime: ({ operation, input, callOptions }) => {
      calls.push({ operation, input, callOptions });
      if (operation === "get_issue") {
        return { operation, success: true, result: ISSUE, diagnostics: [] };
      }
      if (operation === "get_project") {
        return {
          operation,
          success: true,
          result: { id: 8192, projectKey: "MIGTEST01", name: "Migration test" },
          diagnostics: []
        };
      }
      throw new Error(`unexpected operation: ${operation}`);
    }
  };

  try {
    assert.throws(
      () => runWorkflow("issue.recent.record", ["--session", session, "--issue-key", ISSUE.issueKey], dependencies),
      (error) => error instanceof BacklogSkillRunnerError
        && error.code === "RECENT_ISSUE_PERSIST_PERMISSION_REQUIRED"
    );
    assert.equal(calls.length, 0);

    const recorded = runWorkflow(
      "issue.recent.record",
      ["--session", session, "--issue-key", ISSUE.issueKey, "--persist"],
      dependencies
    );
    assert.deepEqual(recorded.recentIssue, {
      organization: "default",
      project: { id: 8192, key: "MIGTEST01", name: "Migration test" },
      issue: { id: ISSUE.id, key: ISSUE.issueKey },
      recordedAt: "2026-08-01T00:00:00.000Z"
    });
    const storedHistory = fs.readFileSync(path.join(workspace.cwd, recorded.historyPath), "utf8");
    assert.doesNotMatch(storedHistory, /Example issue|BACKLOG_API_KEY|test-secret/i);

    const listed = runWorkflow("issue.recent.list", ["--session", session], dependencies);
    assert.deepEqual(listed.recentIssues, [recorded.recentIssue]);

    const preflight = runWorkflow(
      "issue.delete.preflight",
      ["--recent-issue-session", session],
      dependencies
    );
    assert.match(
      preflight.humanOutput,
      /組織 default・プロジェクト MIGTEST01（Migration test）の MIGTEST01-392/
    );
    assert.deepEqual(preflight.recentIssue, recorded.recentIssue);

    runWorkflow("issue.recent.clear", ["--session", session], dependencies);
    assert.throws(
      () => runWorkflow("issue.recent.list", ["--session", session], dependencies),
      (error) => error instanceof BacklogSkillRunnerError && error.code === "RECENT_ISSUE_HISTORY_NOT_FOUND"
    );
  } finally {
    workspace.cleanup();
  }
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
  assert.throws(
    () => runWorkflow("issue.list.incomplete", ["--count", "100"], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "UNKNOWN_OPTION"
  );
  assert.throws(
    () => runWorkflow("issue.search", [], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "PROJECT_REQUIRED"
  );
  assert.throws(
    () => runWorkflow("issue.search", ["--project", "PROJ"], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "SEARCH_FILTER_REQUIRED"
  );
  assert.throws(
    () => runWorkflow("issue.list.incomplete", [], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "PROJECT_REQUIRED"
  );
  assert.throws(
    () => runWorkflow("issue.search", ["--keyword", "one", "--keyword", "two"], {}),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "DUPLICATE_OPTION"
  );
  assert.throws(
    () => runWorkflow(
      "issue.search",
      ["--project", "PROJ", "--due-from", "2026-02-30"],
      {}
    ),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "INVALID_OPTION_VALUE"
  );
  assert.throws(
    () => runWorkflow(
      "issue.search",
      ["--project", "PROJ", "--due-from", "2026-08-02", "--due-to", "2026-08-01"],
      {}
    ),
    (error) => error instanceof BacklogSkillRunnerError && error.code === "INVALID_DATE_RANGE"
  );
});
