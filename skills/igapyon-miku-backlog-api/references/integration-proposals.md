# Cross-Product Integration Proposals

These are read-only proposal contracts. They do not activate, invoke, or
configure another Skill. Select the downstream workflow explicitly before
using either proposal, and do not persist retrieved Backlog data unless the
user separately authorizes the local destination.

## `mikuproject` WBS Proposal

### Scope

The Backlog side first produces a reviewed, project-scoped Issue selection with
only stable identifiers and planning fields. No Backlog mutation occurs. A
downstream `mikuproject` workflow may then convert the proposal into a
`project_draft_view` or Patch JSON only after the user explicitly selects that
workflow and its destination.

### Proposal Record

```json
{
  "schemaVersion": "miku-backlog-api-skills.wbs-proposal/v1",
  "source": {
    "organization": "example-space",
    "projectId": 42,
    "projectKey": "DEMO",
    "retrievedAt": "2026-08-14T00:00:00.000Z"
  },
  "issues": [
    {
      "issueId": 101,
      "issueKey": "DEMO-101",
      "summary": "Synthetic planning task",
      "status": "未対応",
      "dueDate": "2026-09-01",
      "parentIssueId": null,
      "updated": "2026-08-10T00:00:00Z"
    }
  ],
  "mapping": {
    "strategy": "downstream-allocated-task-uid",
    "sourceIdentity": ["organization", "projectId", "issueId", "issueKey"]
  }
}
```

### Traceability and Conflicts

- A `task_uid` is allocated only by the selected `mikuproject` workflow. Do
  not invent a UID format in the Backlog adapter.
- The mapping key is the tuple `(organization, projectId, issueId, issueKey)`.
  Preserve it in the proposal and in any downstream task metadata or sidecar
  mapping that the selected workflow supports.
- If an existing mapping has a different project ID, issue ID, or Issue key,
  emit a `source-identity-conflict` entry. Do not overwrite either mapping.
- If the selected downstream task has changed planning fields since its last
  source timestamp, emit a `downstream-edit-conflict` entry. Present both
  values for review; do not overwrite downstream planning data automatically.
- No proposal authorizes a Backlog write-back. A later write-back requires its
  own exact target resolution, just-in-time mutation approval, and any
  applicable destructive confirmation.

## Reviewed Markdown Table for `.xlsx`

The fixed `issue.export.xlsx.preflight` workflow now prepares this minimal
Markdown table and shows the selected row count, columns, and generated
timestamped destination. It creates no workbook until the user separately
approves `issue.export.xlsx.apply --apply`; both stages require the reviewed
local `miku-md2xlsx` runtime path and explicit persistence permission.

```markdown
| Organization | Project | Issue key | Status | Summary | Due date | Updated |
| --- | --- | --- | --- | --- | --- | --- |
| example-space | DEMO | DEMO-101 | 未対応 | Synthetic planning task | 2026-09-01 | 2026-08-10T00:00:00Z |
```

The generated workbook is tenant-sensitive: the runner stores it under the
purpose-specific ignored `workplace/` path with a timestamp and UUID, retains
no credential, and stops if the reviewed converter changes. The downstream
converter owns workbook formatting and validation.
