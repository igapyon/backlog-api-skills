# Backlog API Node Operations Map

The bundled Node runtime exposes the checked Nulab Backlog MCP Server tools
without starting an MCP transport.

The runtime is produced by <https://github.com/igapyon/miku-backlog-api>. Use
`runtime/miku-backlog-api-source.json` for its exact source and artifact identity.

## Runtime Discovery

Use the newest versioned runtime under `runtime/`:

```bash
node runtime/miku-backlog-api-0.7.0.mjs --version
node runtime/miku-backlog-api-0.7.0.mjs tools list
node runtime/miku-backlog-api-0.7.0.mjs tools describe get_issue
node runtime/miku-backlog-api-0.7.0.mjs trace get_issue
```

The installed absolute path may differ. Resolve it from the active skill
directory rather than assuming the current working directory.

## Operation Call

Pass exactly one JSON object:

```bash
node runtime/miku-backlog-api-0.7.0.mjs call get_issue --input request.json --verbose
```

Use `--input -` for stdin. Use `tools describe <operation>` for the input JSON
Schema, result-field schema, safety metadata, and examples. Use `--dry-run` for
schema validation without resolving credentials or making a Backlog request.
Calls allow `READ` only by default. A write must be allowed by both the
environment-level `BACKLOG_API_ALLOWED_PERMISSIONS` maximum and the narrow
call-level permission supplied after just-in-time user approval:
`--allow CREATE`, `--allow UPDATE`, or `--allow DELETE`. Destructive and
broad-reset operations require a second, separate confirmation before
`--confirm-destructive`; the mutation approval cannot double as the destructive
confirmation.

During beta operation, add `--verbose` to actual Backlog API calls. It emits
`verbose: `-prefixed JSON events to stderr while leaving the result envelope on
stdout. Events may include allowlisted target/result identifiers, duration,
changed field names, pagination, an available actual HTTP status, and validated
rate-limit values. They do not expose bodies, search text, credentials, personal
data, or error bodies. Do not persist stderr without explicit user approval.
Metadata commands do not need the flag, and dry-run uses it only when
diagnostics are useful.

The request object may include a top-level GraphQL-style `fields` selection,
such as `"fields":"{ id summary }"`, to reduce returned result fields. Invalid
selections are rejected before a Backlog call.

## Compatibility Baseline

The current runtime contains 62 operations converted from upstream `v0.14.0`
plus the Node-specific `get_rate_limit` operation, for 63 operations in total.
Use `tools list` for the authoritative bundled inventory.

| Toolset | Read examples | Mutation examples |
| --- | --- | --- |
| `space` | `get_space`, `get_space_activities`, `get_users`, `get_myself`, `get_user_recent_updates`, `get_user_stars_count` | none |
| `project` | `get_project_list`, `get_project`, `get_project_users` | `add_project`, `update_project`, `delete_project` |
| `issue` | issue, comment, related-issue, metadata, watching, and milestone reads | corresponding add/update/delete operations, including related-issue and comment updates |
| `wiki` | `get_wiki_pages`, `get_wikis_count`, `get_wiki` | `add_wiki`, `update_wiki` |
| `git` | repository and pull-request reads | pull-request and comment add/update operations |
| `document` | `get_documents`, `get_document_tree`, `get_document` | upstream-named `addDocument` |
| `notifications` | `get_notifications`, `count_notifications` | mark-as-read and unread-count reset operations |
| `miku-backlog-api` | `get_rate_limit` | none |

The camelCase operation `addDocument` and `count_notifications` spelling are
preserved from the checked upstream contract. Do not silently rename them.
`remove_related_issue` is a destructive `DELETE` operation and requires the
separate destructive confirmation gate.

## Session Context Adapter

Neither the checked runtime nor the checked upstream tool inventory exposes a
current Space/Project operation. The Skill runner therefore adds only these
local workflow operations:

| Workflow | Effect | Permission boundary |
| --- | --- | --- |
| `context.list` | Lists configured Space labels without domains or keys | no Backlog call |
| `context.select` | Resolves a Project and writes an opted-in session context | `READ` plus explicit `--persist` after user permission |
| `context.show` | Displays the saved Space and Project | local read only |
| `context.clear` | Removes the named saved context | explicit local clear |

`issue.search`, `issue.list.incomplete`, and `issue.delete.preflight` can use
`--context-session SESSION` in place of their normal organization/project
arguments. The adapter supplies the saved scope. Delete preflight also confirms
the resolved Issue belongs to the selected Project before it creates a deletion
handoff or asks for final confirmation.

## Recent Issue Adapter

The local `issue.recent.record`, `issue.recent.list`, and `issue.recent.clear`
workflows provide an opt-in newest-first Issue history for one Agent session.
`record` requires `READ` plus `--persist` after explicit user permission; it
resolves the Issue and Project before storing only their stable identifiers and
labels. `list` and `clear` are local operations. Deletion preflight may consume
the newest record through `--recent-issue-session SESSION`; it rereads the
Issue and rejects a project mismatch before creating any handoff.

## Fixed Issue Mutation Adapters

`issue.create.preflight` / `issue.create.apply` provide one reviewed
`add_issue` handoff. `issue.update.preflight` / `issue.update.apply` provide
one reviewed `update_issue` handoff for summary, description, due date,
priority, and assignee replacements. The update adapter uses `get_issue` at
preflight and immediately before apply, `get_project` for the resolved scope,
and catalog reads only when a priority or assignee name requires resolution.
It compares a compact Issue snapshot digest before its one `update_issue` call;
there is no status-name catalog or field-clearing contract in this adapter.

## Result Contract

Read stdout as one JSON envelope. Report:

- organization and target identity
- exact operation name
- created or updated stable key/ID when returned
- concise result summary
- `diagnostics` and trace information
- focused read-back after mutation when practical

Do not dump a large raw `result` unless requested.
