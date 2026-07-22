# Backlog API Node Operations Map

The bundled Node runtime exposes the checked Nulab Backlog MCP Server tools
without starting an MCP transport.

The runtime is produced by <https://github.com/igapyon/backlog-api>. Use
`runtime/backlog-api-source.json` for its exact source and artifact identity.

## Runtime Discovery

Use the newest versioned runtime under `runtime/`:

```bash
node runtime/backlog-api-0.3.0.mjs --version
node runtime/backlog-api-0.3.0.mjs tools list
node runtime/backlog-api-0.3.0.mjs trace get_issue
```

The installed absolute path may differ. Resolve it from the active skill
directory rather than assuming the current working directory.

## Operation Call

Pass exactly one JSON object:

```bash
node runtime/backlog-api-0.3.0.mjs call get_issue --input request.json
```

Use `--input -` for stdin. Use `--dry-run` for schema validation without a
Backlog request. Destructive and broad-reset operations also require
`--confirm-destructive` after user confirmation.

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
