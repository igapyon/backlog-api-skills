---
name: igapyon-backlog-api
description: Beta. Use only when the user explicitly names `igapyon-backlog-api`, `backlog-api`, or `backlog-api-skills`, or explicitly asks to apply this skill for Nulab Backlog API workflows. This skill runs the bundled backlog-api Node CLI converted from Nulab Backlog MCP Server tool handlers. Do not activate for generic backlog grooming, task management, GitHub, or project-management requests.
---

# Backlog API

This Agent Skill is beta. Keep product versions numeric; do not add a beta
suffix to the version number.

Use this skill to operate Nulab Backlog through the bundled `backlog-api` Node
runtime. The runtime is a traceable CLI conversion of the published Nulab
Backlog MCP Server tool handlers; it does not start or communicate through an
MCP transport.

The Node Core/CLI is maintained in `https://github.com/igapyon/backlog-api`.
This Skill consumes a versioned, checksummed runtime from that repository.

## Activation

Start this skill only when at least one of these explicit triggers is present:

- the user names `igapyon-backlog-api`
- the user names `backlog-api`
- the user names `backlog-api-skills`
- the user explicitly asks to use this skill for a Backlog API workflow
- the recent conversation is already inside an explicitly activated workflow

Do not activate from the word `Backlog` alone. Do not activate merely because a
request mentions issues, projects, milestones, wikis, pull requests,
notifications, task lists, or backlog grooming.

## Required First Checks

1. Read [index.json](index.json) first as the generated discovery index.
2. Read `runtime/backlog-api-source.json` when source identity matters.
3. Open only the references needed for the current request.
4. Locate the newest `runtime/backlog-api-*.mjs` before searching elsewhere.
5. Run `node <runtime> tools list` when current operation discovery is needed.
6. Resolve the target Backlog organization and resource before mutation.

If the runtime is unavailable, stop with a hard error. Do not silently switch
to MCP, direct HTTP calls, browser automation, `npx`, Docker, or the disposable
upstream checkout under `workplace/`.

## Backend Policy

This skill is `cli-only`.

- use only the bundled `backlog-api` Node runtime
- do not probe MCP tools as an automatic fallback
- do not call the Backlog REST API directly from the skill layer
- do not read credentials from dotfiles or print environment values
- never ask the user to paste an API key into the conversation

The CLI inherits authentication configuration from its process environment.
The checked runtime preserves the upstream single- and multi-organization
environment contracts.

When the user explicitly requests local credential storage, follow
[references/runtime/setup.md](references/runtime/setup.md) and use the ignored
`<agent-workspace>/workplace/backlog.env` convention. Never inspect or print
its values; pass the resolved file path explicitly to Node with `--env-file`
immediately before the runtime path. The runtime itself does not automatically
load it.

## Core Workflow

1. Classify the request as read, create, update, comment, notification-state
   change, or delete.
2. Select the exact upstream-compatible operation name from `tools list` or the
   operations map.
3. Resolve names to stable project keys, issue keys, repository names, or IDs
   with read operations when needed.
4. Prepare one JSON input object in a temporary or user-approved file.
5. For every mutation, restate the operation class, organization, exact target,
   and material fields, then obtain just-in-time user approval.
6. If the operation is destructive or broad, obtain a second, separate
   confirmation that names its impact. Do not combine the two approvals.
7. Apply the safety rules below.
8. Run `node <runtime> call <operation> --input <json-file>`. Only after the
   mutation approval, add its required `--allow CREATE`, `--allow UPDATE`, or
   `--allow DELETE` permission. Add `--confirm-destructive` only after the
   separate destructive confirmation.
9. Inspect exit status and the JSON `success`, `diagnostics`, and `trace`
   fields before reporting success.
10. After a mutation, perform a focused read-back when proportionate.

Use `--dry-run` to validate operation input without calling Backlog. It still
requires configured client metadata, but it performs no Backlog request.

## Safety Rules

- Read-only requests may proceed when target and scope are clear.
- Before every create, update, or delete, obtain just-in-time user approval
  naming the permission class, organization, target, and material change. The
  request that initiated the workflow does not itself satisfy this approval.
- After that first approval, pass only the corresponding `--allow CREATE`,
  `--allow UPDATE`, or `--allow DELETE` permission.
- Treat every `delete_*` operation, `reset_unread_notification_count`, and any
  other broad or difficult-to-reverse operation as destructive.
- For a destructive operation, obtain a second, separate confirmation after
  the mutation approval. Restate the exact impact; never treat one reply as
  satisfying both approvals.
- Pass `--confirm-destructive` only after the second confirmation. A delete
  therefore requires an approved `--allow DELETE` gate and a separately
  approved `--confirm-destructive` gate.
- Do not broaden a mutation across organizations or projects.
- Do not invent IDs, keys, custom-field IDs, user IDs, or repository names.
- Do not expose credentials or unrelated tenant data in inputs or summaries.
- Prefer bounded queries and concise summaries for large results.

Read [references/safety.md](references/safety.md) before destructive or broad
mutations.

## Runtime Result

The runtime writes one JSON envelope to stdout containing:

- `schemaVersion`
- `operation` and `toolset`
- `success`
- `result` on success
- structured `diagnostics`
- `trace` with upstream repository, version, commit, tool, source, and test

Treat a nonzero exit code, `success: false`, configuration failure, validation
failure, or upstream error diagnostic as a failed operation.

## References

Read these only when needed:

- [index.json](index.json) for generated bundled-file discovery
- [references/INDEX.md](references/INDEX.md) for the reference map
- [references/runtime/operations-map.md](references/runtime/operations-map.md)
  for Node CLI routing and operation categories
- [references/runtime/setup.md](references/runtime/setup.md) for Node and
  authentication requirements
- [references/workflow/request-routing.md](references/workflow/request-routing.md)
  for target resolution and result reporting
- [references/safety.md](references/safety.md) for mutation and credential rules
- [references/upstream-compatibility.md](references/upstream-compatibility.md)
  for the checked upstream source and conversion boundary
