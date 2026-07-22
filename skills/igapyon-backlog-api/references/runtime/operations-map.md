# Backlog API Node Operations Map

The bundled Node runtime exposes the checked Nulab Backlog MCP Server tools
without starting an MCP transport.

The runtime is produced by <https://github.com/igapyon/backlog-api>. Use
`runtime/backlog-api-source.json` for its exact source and artifact identity.

## Runtime Discovery

Use the newest versioned runtime under `runtime/`:

```bash
node runtime/backlog-api-0.3.4.mjs --version
node runtime/backlog-api-0.3.4.mjs tools list
node runtime/backlog-api-0.3.4.mjs trace get_issue
```

The installed absolute path may differ. Resolve it from the active skill
directory rather than assuming the current working directory.

## Operation Call

Pass exactly one JSON object:

```bash
node runtime/backlog-api-0.3.4.mjs call get_issue --input request.json --verbose
```

Use `--input -` for stdin. Use `--dry-run` for schema validation without a
Backlog request. Calls allow `READ` only by default. Pass the narrow permission
needed by a mutation only after just-in-time user approval: `--allow CREATE`,
`--allow UPDATE`, or `--allow DELETE`. Destructive and broad-reset operations
require a second, separate confirmation before `--confirm-destructive`; the
mutation approval cannot double as the destructive confirmation.

During beta operation, add `--verbose` to actual Backlog API calls. It emits
`verbose: `-prefixed JSON events to stderr while leaving the result envelope on
stdout. Events may include allowlisted target/result identifiers, duration,
changed field names, pagination, and an available failure HTTP status. They do
not expose bodies, search text, credentials, personal data, or error bodies. Do
not persist stderr without explicit user approval. Metadata commands do not
need the flag, and dry-run uses it only when diagnostics are useful.

The request object may include a top-level GraphQL-style `fields` selection,
such as `"fields":"{ id summary }"`, to reduce returned result fields. Invalid
selections are rejected before a Backlog call.

## Compatibility Baseline

The current runtime contains 58 operations converted from upstream `v0.13.2`.
Use `tools list` for the authoritative bundled inventory.

| Toolset | Read examples | Mutation examples |
| --- | --- | --- |
| `space` | `get_space`, `get_space_activities`, `get_users`, `get_myself`, `get_user_recent_updates`, `get_user_stars_count` | none |
| `project` | `get_project_list`, `get_project`, `get_project_users` | `add_project`, `update_project`, `delete_project` |
| `issue` | issue, comment, metadata, watching, and milestone reads | corresponding add/update/delete operations |
| `wiki` | `get_wiki_pages`, `get_wikis_count`, `get_wiki` | `add_wiki`, `update_wiki` |
| `git` | repository and pull-request reads | pull-request and comment add/update operations |
| `document` | `get_documents`, `get_document_tree`, `get_document` | upstream-named `addDocument` |
| `notifications` | `get_notifications`, `count_notifications` | mark-as-read and unread-count reset operations |

The camelCase operation `addDocument` and `count_notifications` spelling are
preserved from the checked upstream contract. Do not silently rename them.

## Result Contract

Read stdout as one JSON envelope. Report:

- organization and target identity
- exact operation name
- created or updated stable key/ID when returned
- concise result summary
- `diagnostics` and trace information
- focused read-back after mutation when practical

Do not dump a large raw `result` unless requested.
