export const WORKFLOW_MANIFEST_VERSION = "backlog-api-skills.workflow-manifest/v1";

const WORKFLOWS = [
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
