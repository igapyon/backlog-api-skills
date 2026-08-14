# Feature Feasibility

## Scope and Evidence

Checked on 2026-08-14 against the bundled `miku-backlog-api` `0.7.0` runtime,
which embeds `backlog-mcp-server@0.14.0`. The bundled runtime is the authority
for executable behavior in this Skill. The public upstream repository and
Nulab API documentation are used only to identify newer or external
capabilities that require a separate compatibility update.

Sources:

- bundled `runtime/miku-backlog-api-0.7.0.mjs` `tools list` and
  `tools describe` output
- [pinned upstream baseline](upstream-compatibility.md)
- <https://github.com/nulab/backlog-mcp-server>
- <https://developer.nulab.com/docs/backlog/api/2/get-issue-list/>
- <https://developer.nulab.com/docs/backlog/api/2/get-notification/>
- <https://developer.nulab.com/docs/backlog/api/2/read-notification/>

Do not infer that an operation described by a newer upstream checkout is
available in the pinned runtime. Synchronizing a later runtime follows the
compatibility rule in `upstream-compatibility.md`.

## Result Matrix

| TODO / feature | Bundled capability | Decision and remaining work |
| --- | --- | --- |
| #7 credential configuration | Single- and multi-organization environment-variable contracts; `BACKLOG_API_ALLOWED_PERMISSIONS` caps permissions. | Feasible now. Keep credentials outside the repository in an explicitly approved, ignored `workplace/backlog.env`; the Skill must never read or display the values. |
| `.env` evaluation | Node can load an explicitly named env file, but the runtime does not choose a file automatically. | Do not adopt a repository-root `.env`: it creates an easy accidental-commit location and conflicts with the workspace-owned credential boundary. The `workplace/backlog.env` convention is the supported local option. |
| #10 permission gates | Every described operation has a required permission; the runtime defaults to `READ`, enforces the environment maximum, and requires call-level `--allow` for writes. High-impact confirmation is available for destructive calls. | Feasible now. The Skill must retain just-in-time approval for each write and a distinct confirmation for deletes, bulk work, and unread-count reset. |
| #11 save retrieved data | No runtime operation writes result files; `workplace/` is ignored. | Feasible as a Skill-local, opt-in export adapter. It needs a purpose-specific directory, timestamped owner-only files, an explicit pre-write approval, and narrow selected fields. |
| #13 issue hygiene | `get_issues` filters by project, status, assignee, parent, due dates, and updated dates; results carry status, parent ID, due date, and updated time. | Feasible as read-only, project-scoped heuristics. “Stale” needs a caller-provided day threshold; “missing parent” can only mean an Issue with no `parentIssueId`, not a broken parent reference. Status IDs must be resolved per project. |
| #14 notification triage | `get_notifications`, `count_notifications`, `mark_notification_as_read`, and `reset_unread_notification_count` exist. A notification exposes numeric `reason`, `alreadyRead`, and `resourceAlreadyRead`. | Bell-list triage is feasible read-only. Do not label a reason as a mention until an authoritative reason-code mapping is checked for the pinned contract; preserve unknown numeric values. Marking one notification read is an `UPDATE`; resetting unread count is a broad, separately confirmed action. |
| #15 `mikuproject` proposal | The runtime supplies Issue metadata but has no `mikuproject` JSON operation or task UID model. | A read-only adapter is possible only after the `mikuproject` input contract is explicitly selected. It must define deterministic Issue-key-to-`task_uid` mapping, conflict reporting, and an approved destination before any persistence. |
| #16 `.xlsx` export | The runtime returns data only and has no Office writer. | A reviewed Markdown-table intermediate is possible. Generating `.xlsx` requires an explicitly selected compatible `miku-md2xlsx` workflow, previewed columns, a timestamped `workplace/` destination, and explicit write approval. |
| #23 reviewed Issue create/update | `add_issue`, `get_issue`, `update_issue`, `get_priorities`, and `get_project_users` exist. The pinned runtime does not expose a status catalog. | Fixed CREATE and fixed UPDATE are feasible. UPDATE is limited to non-empty summary, description, due date, priority, and assignee replacements; it must reread and digest-check the reviewed Issue before a single update. Status and clearing semantics remain outside this fixed contract. |
| #12 examples | No runtime limitation. | Feasible after the fixed workflows settle. Use only synthetic organization labels, project keys, issue keys, names, and timestamps. |

## Boundary Notes

- `get_issues` can paginate up to 100 Issues per API request. Its filtering and
  status semantics come from the selected Backlog project, so the Skill must
  resolve project metadata before presenting heuristic results.
- Notification `reason` is intentionally retained as a number. A UI label or
  assumption based on a different upstream version is not a safe substitute
  for the pinned runtime contract.
- A workspace file containing retrieved Backlog data can be tenant-sensitive
  even without a credential. Its creation is a local persistence action and
  needs an explicit, narrowly scoped user permission.
