export const WORKFLOW_MANIFEST_VERSION = "backlog-api-skills.workflow-manifest/v1";

const WORKFLOWS = [
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
