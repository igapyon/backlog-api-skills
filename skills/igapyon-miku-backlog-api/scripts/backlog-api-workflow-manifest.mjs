export const WORKFLOW_MANIFEST_VERSION = "backlog-api-skills.workflow-manifest/v1";

const WORKFLOWS = [
  {
    id: "context.list",
    triggers: ["利用可能なSpace一覧", "Backlog Spaceを一覧", "接続先Spaceを確認"],
    requiredParameters: [],
    mutationLevel: "local-readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "context.select",
    triggers: ["作業Spaceを切替", "作業プロジェクトを切替"],
    requiredParameters: ["session", "project", "--persist"],
    mutationLevel: "local-persist",
    approvalGate: "user-permission-required",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_project"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "context.show",
    triggers: ["現在の作業Space", "現在の作業プロジェクト"],
    requiredParameters: ["session"],
    mutationLevel: "local-readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "context.clear",
    triggers: ["作業コンテキストをクリア", "作業Spaceを解除"],
    requiredParameters: ["session"],
    mutationLevel: "local-delete",
    approvalGate: "explicit-clear",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.recent.record",
    triggers: ["現在のIssueを記憶", "最近のIssueに追加"],
    requiredParameters: ["session", "issue-key or issue-id", "--persist"],
    mutationLevel: "local-persist",
    approvalGate: "user-permission-required",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_issue", "get_project"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.recent.list",
    triggers: ["最近のIssue一覧", "現在のIssueを確認"],
    requiredParameters: ["session"],
    mutationLevel: "local-readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.recent.clear",
    triggers: ["最近のIssueをクリア", "Issue履歴を削除"],
    requiredParameters: ["session"],
    mutationLevel: "local-delete",
    approvalGate: "explicit-clear",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.search",
    triggers: ["Issue検索", "Issueを検索", "自分に割り当てられたIssue一覧", "最近更新されたIssue一覧"],
    requiredParameters: ["project", "at least one supported search condition"],
    mutationLevel: "readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [
      "get_project",
      "get_project_users",
      "get_categories",
      "get_version_milestone_list",
      "get_priorities",
      "get_resolutions",
      "get_myself",
      "get_issues"
    ],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.save",
    triggers: ["Issue検索結果を保存", "取得したIssueをローカルへ保存"],
    requiredParameters: ["project", "at least one supported search condition", "--persist"],
    mutationLevel: "local-persist",
    approvalGate: "user-permission-required",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [
      "get_project",
      "get_project_users",
      "get_categories",
      "get_version_milestone_list",
      "get_priorities",
      "get_resolutions",
      "get_myself",
      "get_issues"
    ],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.export.xlsx.preflight",
    triggers: ["Issue検索結果をXLSXへ出力", "Backlog IssueをExcelへ出力"],
    requiredParameters: ["project", "at least one supported search condition", "--persist", "--md2xlsx-runtime"],
    mutationLevel: "local-preflight",
    approvalGate: "export-preview",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [
      "get_project",
      "get_project_users",
      "get_categories",
      "get_version_milestone_list",
      "get_priorities",
      "get_resolutions",
      "get_myself",
      "get_issues"
    ],
    designReferences: ["references/integration-proposals.md", "references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.export.xlsx.apply",
    triggers: ["XLSX出力を承認", "Excel出力を実行"],
    requiredParameters: ["--apply"],
    mutationLevel: "local-write",
    approvalGate: "apply",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/integration-proposals.md", "references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.create.preflight",
    triggers: ["Issueを作成", "Backlog Issueを登録"],
    requiredParameters: ["project", "summary", "issue-type", "priority", "--persist"],
    mutationLevel: "local-preflight",
    approvalGate: "create-preview",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_project", "get_issue_types", "get_priorities"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.create.apply",
    triggers: ["Issue作成を承認", "Issue作成を実行"],
    requiredParameters: ["--apply"],
    mutationLevel: "remote",
    approvalGate: "apply",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["add_issue"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.update.preflight",
    triggers: ["Issueを更新", "Backlog Issueを修正"],
    requiredParameters: ["issue-key or issue-id", "at least one supported fixed field", "--persist"],
    mutationLevel: "local-preflight",
    approvalGate: "update-preview",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_issue", "get_project", "get_priorities", "get_project_users"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.update.apply",
    triggers: ["Issue更新を承認", "Issue更新を実行"],
    requiredParameters: ["--apply"],
    mutationLevel: "remote",
    approvalGate: "apply",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_issue", "update_issue"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.list.incomplete",
    triggers: ["完了以外のIssue一覧", "未完了Issue一覧"],
    requiredParameters: ["project"],
    mutationLevel: "readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_project", "get_issues"],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.hygiene",
    triggers: ["期限超過Issue", "更新停滞Issue", "親Issue未設定のIssue"],
    requiredParameters: ["project", "at least one hygiene condition"],
    mutationLevel: "readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_project", "get_issues"],
    designReferences: ["references/feature-feasibility.md", "references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "notification.triage",
    triggers: ["Backlog通知一覧", "Backlogベル通知を確認", "未読通知を確認"],
    requiredParameters: [],
    mutationLevel: "readonly",
    approvalGate: "none",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: ["get_notifications"],
    designReferences: ["references/feature-feasibility.md", "references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.delete.preflight",
    triggers: ["ISSUE-123 を削除", "課題を削除"],
    requiredParameters: ["issue-key or issue-id"],
    mutationLevel: "readonly",
    approvalGate: "preflight",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  },
  {
    id: "issue.delete.handoff.apply",
    triggers: ["削除を承認", "approve"],
    requiredParameters: ["--apply"],
    mutationLevel: "remote",
    approvalGate: "apply",
    runnerEntry: "backlog-api-skill-run.mjs",
    runtimeReferences: [],
    designReferences: ["references/workflow/request-routing.md", "references/safety.md"]
  }
];

export const WORKFLOW_MANIFEST = Object.freeze(
  WORKFLOWS.map((workflow) => Object.freeze({
    ...workflow,
    runtimeReferences: Object.freeze([...workflow.runtimeReferences]),
    designReferences: Object.freeze([...workflow.designReferences])
  }))
);

export function workflowManifestById() {
  return new Map(WORKFLOW_MANIFEST.map((workflow) => [workflow.id, workflow]));
}
