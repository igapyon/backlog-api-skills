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
        id: "issue.list.incomplete",
        mutationLevel: "readonly",
        approvalGate: "none",
        requiredParameters: ["project"],
        runtimeReferences: ["get_project", "get_issues"]
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
