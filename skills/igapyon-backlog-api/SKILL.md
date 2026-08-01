---
name: igapyon-backlog-api
description: Beta. Use only when the user explicitly names `igapyon-backlog-api`, `backlog-api`, or `backlog-api-skills`, explicitly asks to apply this skill for Nulab Backlog API workflows, or explicitly asks how to issue or configure a Backlog API key for this Skill. This skill provides guidance-only API-key setup and runs the bundled backlog-api Node CLI converted from Nulab Backlog MCP Server tool handlers. It never issues or receives API key values. Do not activate for generic backlog grooming, task management, GitHub, or project-management requests.
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
- the user explicitly asks how to issue or configure a Backlog API key for this
  Skill
- the recent conversation is already inside an explicitly activated workflow

Do not activate from the word `Backlog` alone. Do not activate merely because a
request mentions issues, projects, milestones, wikis, pull requests,
notifications, task lists, or backlog grooming.

## Fixed Single-Issue Deletion Route

When the user's original request explicitly names one Backlog issue key or ID
and asks to delete that issue, use this fixed route in preference to the
generic workflow below. It is currently the only runner-backed deletion route.
Do not use it for `remove_related_issue`, project deletion, bulk deletion, or
an ambiguous target.

The original exact request is the mutation approval only when it names the
stable key/ID and destructive action and the preflight resolves the same target
without ambiguity. The runner's resulting question is the one required,
separate final destructive confirmation. Do not ask a separate question to
authorize `--allow DELETE`, and do not narrate that either approval was
received.

1. From the agent workspace that owns the ignored `workplace/` directory, run
   the fixed preflight with the named target. If a local credential file was
   explicitly approved, pass it as Node's `--env-file` without reading it:

   ```bash
   node --env-file=<agent-workspace>/workplace/backlog.env \
     <skill-directory>/scripts/backlog-api-skill-run.mjs \
     --format human issue.delete.preflight --issue-key PROJ-123
   ```

   Use `--issue-id` instead of `--issue-key` when that is the stable target;
   add `--organization NAME` only when the user specified the organization.
2. Return the runner's human output unchanged. It is the concise final
   confirmation prompt. Do not run `tools list`, `tools describe`, a direct
   runtime call, `--dry-run`, or a read-back for this route.
3. Only after the user separately confirms that exact prompt, run the fixed
   apply command from the same workspace:

   ```bash
   node --env-file=<agent-workspace>/workplace/backlog.env \
     <skill-directory>/scripts/backlog-api-skill-run.mjs \
     --format human issue.delete.handoff.apply --apply
   ```

   Do not repeat a target key, ID, organization, `--allow`, or a
   `--confirm-destructive` argument. The runner finds exactly one pending,
   integrity-checked handoff and supplies the fixed delete invocation itself.
   If there are zero or multiple pending handoffs, stop; never choose or
   reconstruct one in the conversation.
4. Return the runner's human output unchanged. Do not add routine progress,
   dry-run, or post-read narration. If the runner reports an unresolved
   outcome, do not retry automatically.

If the fixed runner cannot proceed, stop and report its concise result. Do not
fall back to a direct `delete_issue` CLI command.

## Required First Checks for Other Runtime Operations

1. Read [index.json](index.json) first as the generated discovery index.
2. Read `runtime/backlog-api-source.json` when source identity matters.
3. Open only the references needed for the current request.
4. Locate the newest `runtime/backlog-api-*.mjs` before searching elsewhere.
5. Run `node <runtime> tools list` when current operation discovery is needed.
6. Run `node <runtime> tools describe <operation>` before constructing input.
7. Resolve the target Backlog organization and resource before mutation.

For API-key setup guidance only, read
[references/runtime/setup.md](references/runtime/setup.md) and follow the
guidance flow below. Runtime discovery and operation checks are not required
until the user explicitly asks for a connection test or Backlog API operation.

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
environment contracts. Write operations also require their permission in the
environment-level `BACKLOG_API_ALLOWED_PERMISSIONS` maximum. `--allow` cannot
exceed that maximum. When the variable is unset, only `READ` is enabled.

When the user explicitly requests local credential storage, follow
[references/runtime/setup.md](references/runtime/setup.md) and use the ignored
`<agent-workspace>/workplace/backlog.env` convention. Never inspect or print
its values; pass the resolved file path explicitly to Node with `--env-file`
immediately before the runtime path. The runtime itself does not automatically
load it.

## API Key Setup Guidance

Provide procedural guidance only. Do not issue an API key, operate the Backlog
settings UI on the user's behalf, or receive the key value.

1. Read [references/runtime/setup.md](references/runtime/setup.md).
2. Tell the user that they will perform the registration and copy steps in
   Backlog and that the key value must not be sent to the agent.
3. Guide the user through the documented UI path one step at a time. Discuss
   only a purpose memo; never ask for or infer the key value.
4. Show only the blank local connection template from the setup reference. If
   the user explicitly requests file creation, create an empty credential
   template under the approved `workplace/` path and leave `BACKLOG_API_KEY=`
   blank for the user to fill locally.
5. After the user says the key is stored, offer a read-only `get_space`
   connection test. Do not run it unless the user requests the test, and pass
   the approved environment-file path without reading its contents.

Do not ask for a screenshot after registration. If an API key appears in the
conversation, an image, or any supplied text, do not repeat, transcribe, store,
or use it. Tell the user to revoke that key and issue a replacement.

## Core Workflow

Use this workflow for runtime-backed Backlog API operations, not for the
guidance-only API-key setup flow above or the fixed single-issue deletion route.

1. Classify the request as read, create, update, comment, notification-state
   change, or delete.
2. Select the exact upstream-compatible operation name from `tools list`.
3. Read its machine-readable input and safety contract with
   `tools describe <operation>` or `call <operation> --help`.
4. Resolve names to stable project keys, issue keys, repository names, or IDs
   with read operations when needed.
5. Prepare one JSON input object in a temporary or user-approved file.
6. For every mutation, confirm that the corresponding permission is available
   in `BACKLOG_API_ALLOWED_PERMISSIONS`. Do not modify that environment setting
   implicitly.
7. Restate the operation class, organization, exact target, and material
   fields, then obtain just-in-time user approval.
8. If the operation is destructive or broad, obtain a second, separate
   confirmation that names its impact. Do not combine the two approvals.
9. Apply the safety rules below.
10. Run `node <runtime> call <operation> --input <json-file> --verbose` for an
   actual Backlog API call during the beta period. Only after the
   mutation approval, add its required `--allow CREATE`, `--allow UPDATE`, or
   `--allow DELETE` permission. Add `--confirm-destructive` only after the
   separate destructive confirmation.
11. Inspect exit status and the JSON `success`, `diagnostics`, and `trace`
   fields before reporting success.
12. After a mutation, perform a focused read-back when proportionate.

Keep routine progress messages to one short sentence and do not narrate receipt
of each approval.

Use `--dry-run` when input is complex or uncertain, or when the user requests
validation. Do not run it by default for a resolved single-target mutation. It
still enforces environment and call-level write permissions and destructive
confirmation, but it does not resolve credentials or perform a Backlog request.
Use `--verbose` with dry-run only when its diagnostic output is useful.
Metadata commands such as `--version`, `tools list`, `tools describe`, and
`trace` do not need it.

## Safety Rules

- Read-only requests may proceed when target and scope are clear.
- Treat `BACKLOG_API_ALLOWED_PERMISSIONS` as an environment-level maximum.
  Never weaken or modify it implicitly. If the required permission is absent,
  stop and tell the user which permission the environment must enable.
- Before every create, update, or delete, obtain just-in-time user approval
  naming the permission class, organization, target, and material change. The
  request that initiated the workflow normally does not itself satisfy this
  approval. The fixed single-issue deletion route is the narrow exception:
  its original exact deletion request may be the mutation approval, and its
  runner output still requires the separate final destructive confirmation.
- Treat approval as valid only for the organization, target, operation, and
  material fields presented to the user. If any of them changes, discard the
  prior approval and obtain a new one before invoking the CLI.
- After that first approval, pass only the corresponding `--allow CREATE`,
  `--allow UPDATE`, or `--allow DELETE` permission.
- Do not imply that `--allow` can exceed `BACKLOG_API_ALLOWED_PERMISSIONS`.
- Treat every `delete_*` operation, `reset_unread_notification_count`, and any
  other broad or difficult-to-reverse operation as destructive.
- For a destructive operation, obtain a second, separate confirmation after
  the mutation approval. Restate the exact impact; never treat one reply as
  satisfying both approvals.
- Pass `--confirm-destructive` only after the second confirmation. A generic
  delete therefore requires an approved `--allow DELETE` gate and a separately
  approved `--confirm-destructive` gate. The fixed single-issue deletion route
  supplies those flags inside its runner only after its handoff approval.
- Do not broaden a mutation across organizations or projects.
- Do not invent IDs, keys, custom-field IDs, user IDs, or repository names.
- Do not expose credentials or unrelated tenant data in inputs or summaries.
- Treat verbose stderr as transient diagnostics. Do not persist it without
  explicit user approval, and stop if it unexpectedly exposes arguments,
  credentials, results, organization names, or error bodies.
- Prefer bounded queries and concise summaries for large results.

Read [references/safety.md](references/safety.md) before destructive or broad
mutations outside the fixed single-issue deletion route. That route is fully
specified and enforced by its fixed runner and handoff.

## Runtime Result

The runtime writes one JSON envelope to stdout containing:

- `schemaVersion`
- `operation` and `toolset`
- `success`
- `result` on success
- structured `diagnostics`
- `trace` with upstream repository, version, commit, tool, source, and test

With `--verbose`, safe API access events are written separately to stderr as
`verbose: `-prefixed JSON. Inspect them for operation, method, CRUD permission,
organization class, start/success/failure state, allowlisted target/result IDs
or keys, duration, changed field names, pagination, an available actual HTTP
status, and validated rate-limit values. Do not merge these events into the
stdout JSON envelope.

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
- [scripts/backlog-api-workflow-manifest.mjs](scripts/backlog-api-workflow-manifest.mjs)
  for fixed deletion route identifiers
- [references/upstream-compatibility.md](references/upstream-compatibility.md)
  for the checked upstream source and conversion boundary
