---
name: igapyon-miku-backlog-api
description: Beta. Use only when the user explicitly names `igapyon-miku-backlog-api`, `miku-backlog-api`, `miku-backlog-api-skills`, or the compatibility triggers `igapyon-backlog-api`, `backlog-api`, or `backlog-api-skills`, explicitly asks to apply this skill for Nulab Backlog API workflows, or explicitly asks how to issue or configure a Backlog API key for this Skill. This skill provides guidance-only API-key setup and runs the bundled miku-backlog-api Node CLI converted from Nulab Backlog MCP Server tool handlers. It includes common fixed Issue search and single-Issue deletion routes, and never issues or receives API key values. Do not activate for generic backlog grooming, task management, GitHub, or project-management requests.
---

# Miku Backlog API

This Agent Skill is beta. Keep product versions numeric; do not add a beta
suffix to the version number.

Use this skill to operate Nulab Backlog through the bundled `miku-backlog-api` Node
runtime. The runtime is a traceable CLI conversion of the published Nulab
Backlog MCP Server tool handlers; it does not start or communicate through an
MCP transport.

The Node Core/CLI is maintained in `https://github.com/igapyon/miku-backlog-api`.
This Skill consumes a versioned, checksummed runtime from that repository.

## Activation

Start this skill only when at least one of these explicit triggers is present:

- the user names `igapyon-backlog-api`
- the user names `backlog-api`
- the user names `backlog-api-skills`
- the user names `igapyon-miku-backlog-api`
- the user names `miku-backlog-api`
- the user names `miku-backlog-api-skills`
- the user explicitly asks to use this skill for a Backlog API workflow
- the user explicitly asks how to issue or configure a Backlog API key for this
  Skill
- the recent conversation is already inside an explicitly activated workflow

Do not activate from the word `Backlog` alone. Do not activate merely because a
request mentions issues, projects, milestones, wikis, pull requests,
notifications, task lists, or backlog grooming.

## Session Working Context

The pinned runtime has no operation that retains a current Backlog Space or
Project. It accepts an organization and project on each request; multi-Space
connections are configured through the runtime environment. This Skill adds a
small, local session-context adapter and never stores domains or API keys.

Keep a working context in the agent conversation by default. Only when the
user explicitly permits local persistence may the agent use `context.select`
with `--persist`. This writes only the resolved organization label and project
ID, key, and name under the workspace's ignored
`workplace/backlog-api-skill/session-contexts/` directory with owner-only
permissions. Do not create or replace that file before the permission.

Use the fixed runner in this order when the user wants a persisted session
context:

1. Run `context.list` to show configured Space labels only. It never prints
   domains or API keys.
2. Resolve and explicitly select a Space and Project:

   ```bash
   node <skill-directory>/scripts/backlog-api-skill-run.mjs \
     --format human context.select --session SESSION --organization NAME \
     --project PROJECT_KEY|PROJECT_ID --persist
   ```

   `--organization` may be omitted for the runtime's default connection.
3. Use `context.show --session SESSION` whenever the current target must be
   displayed. Use `context.clear --session SESSION` to remove it explicitly.
4. Scope fixed Issue search and single-Issue deletion preflight routes with
   `--context-session SESSION`. Do not combine it with `--organization` or
   `--project`: the runner loads the saved target instead. Deletion preflight
   verifies that the resolved Issue belongs to the selected Project and names
   the resolved organization and project in its final mutation prompt.

For a non-persisted conversation context, display the resolved organization and
project before a mutation and pass them explicitly to the applicable runner or
runtime call. Clear that conversational context when the user asks to switch
or clear it; never treat a prior Space or Project as implicit after a clear.

## Recent Issue History

The Agent may remember the current or previously viewed Issue within its
conversation by default. Do not write such history locally unless the user
explicitly permits it: Issue keys and project association can be tenant
metadata. The local runner stores only organization label, project ID/key/name,
Issue ID/key, and timestamp—never a title, description, response body, domain,
or API key.

After the user permits a local history record, resolve and record one exact
Issue with:

```bash
node <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.recent.record --session SESSION \
  --issue-key PROJ-123 [--organization NAME] --persist
```

Use `issue.recent.list --session SESSION` to show the reusable targets, and
`issue.recent.clear --session SESSION` to erase that session's history. The
newest record can supply an exact target to the fixed deletion preflight:

```bash
node <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.preflight --recent-issue-session SESSION
```

The runner reads the Issue again, checks that it remains in the recorded
Project, and includes the resolved Space, Project, Issue key, and current title
in the final mutation prompt. Do not combine `--recent-issue-session` with a
different Issue key, organization, or working-context session. For references
such as “the current Issue” without approved local history, show the resolved
Issue from the conversation before reuse or mutation and ask for a stable key
if it is not unambiguous.

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

## Common Issue Search Route

Use the fixed readonly `issue.search` route for supported Backlog Issue-search
variants. The one runner owns condition parsing, resolving `自分` to the
authenticated user, `get_issues` pagination, sorting, and concise rendering.
It never exposes an arbitrary runtime-operation or JSON-input surface.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.search --project PROJECT_KEY|PROJECT_ID \
  [--organization NAME] [--incomplete] [--keyword TEXT] \
  [--assignee me|NAME|ID] [--priority NAME|ID] \
  [--milestone NAME|ID] [--category NAME|ID] [--version NAME|ID] \
  [--resolution NAME|ID] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] \
  [--created-within-days DAYS] [--updated-within-days DAYS] \
  [--sort created|updated] [--order asc|desc]
```

`--project` and at least one search condition are required. Assignee, priority,
milestone, category, version, and resolution options are repeatable. They accept
an ID or an exact name; the runner resolves names only after fixing the project
and fails closed when a match is missing or ambiguous. `--assignee me` resolves
the authenticated user's ID. The default ordering is update time descending;
relative day values are `1` through `3660`, and due dates use `YYYY-MM-DD`.
`--keyword` uses Backlog's own Issue keyword matching. It does not include a
project-wide comment-search contract; do not emulate one by fetching every
Issue's comments.

Backlog `get_issues` returns at most `100` issues per API call. The runner fixes
the page size to `100` and advances `offset` until it receives the final short
page. This is an API paging unit, not a final-result limit. Project, keyword,
resolved-ID, and date conditions are sent to Backlog before paging.
`--incomplete` is currently applied after each page is returned, so that search
may still scan completed issues in the selected project; the human result
reports both the retained issue count and the scanned issue/page counts.

For the common request `完了以外のIssue一覧` or `未完了Issue一覧`, keep using the
compatibility alias `issue.list.incomplete --project PROJECT_KEY|PROJECT_ID
[--organization NAME]`. It calls the same shared search implementation with
`--incomplete`; it is not a separate pagination implementation.

Return the runner's human output unchanged. Do not replace either route with
agent-assembled pagination, raw `get_issues` calls, or temporary JSON. Extend
the `issue.search` input contract when adding a new supported condition rather
than adding a separate MJS runner.

## Opt-In Issue Search Save

Only when the user explicitly asks to save the selected search result and
approves local persistence, use the fixed `issue.save` workflow. It accepts the
same bounded search conditions as `issue.search`, plus `--persist`; it has no
user-selectable output path:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.save --project PROJECT_KEY --incomplete \
  --updated-within-days 14 --persist
```

Before the command, state that the selected Issue key, status, summary, and
created/updated timestamps will be written to the ignored owner-only
`<agent-workspace>/workplace/backlog-api-skill/saved-issues/` directory. The
runner creates one timestamped JSON file with mode `0600`; its parent directory
has mode `0700`. It never saves API keys, domains, raw response bodies,
descriptions, comments, attachments, or verbose diagnostics. Do not invoke the
route without the user’s explicit permission and `--persist`, and return its
saved destination exactly as reported.

## Reviewed XLSX Issue Export

Use the fixed two-stage XLSX route only when the user explicitly asks for an
XLSX export through `miku-md2xlsx`. The first command runs the same bounded
Issue search and prepares an owner-only pending handoff. It requires an
explicitly supplied absolute path to a locally available `miku-md2xlsx-X.Y.Z.mjs`
runtime and the user's `--persist` permission because the selected Issue data
is retained in that handoff for the final review:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.export.xlsx.preflight --project PROJECT_KEY \
  --incomplete --md2xlsx-runtime /absolute/miku-md2xlsx-X.Y.Z.mjs --persist
```

Return the preflight output unchanged. It lists the exact row count, fixed
columns, and generated `workplace/backlog-api-skill/issue-exports/` destination.
Only after a separate affirmative reply, use the same workspace to apply the
one pending export:

```bash
node <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.export.xlsx.apply --apply
```

The runner writes an owner-only Markdown table and `.xlsx` workbook with a
generated timestamp/UUID filename. It calls the reviewed `miku-md2xlsx` runtime
with only the Markdown input, `--out`, and Project-key worksheet title. It
never accepts an arbitrary destination or template, never saves API keys,
domains, descriptions, comments, attachments, raw responses, or verbose
diagnostics, and stops if the converter checksum changes after preview.

## Fixed Single-Issue Create Route

For one new Issue with a resolved Project, type, and priority, use the fixed
create preflight. It requires `READ,CREATE` in the environment and explicit
`--persist` permission because the reviewed payload is stored in an owner-only
pending handoff before mutation approval:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.create.preflight --project PROJECT_KEY \
  --summary TEXT --issue-type NAME|ID --priority NAME|ID \
  [--description TEXT] --persist
```

Return the preflight question unchanged. It resolves names to IDs and presents
the organization, Project, type, priority, summary, and optional description.
Only after the user's just-in-time affirmative reply, use the same workspace:

```bash
node <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.create.apply --apply
```

The apply route finds exactly one pending handoff, rechecks the bundled runtime
identity, and calls `add_issue` exactly once with `--allow CREATE`. A failed or
interrupted attempt becomes `unresolved` and must not be retried automatically.
Do not add fields or replace this fixed route with a direct runtime call.

## Fixed Single-Issue Update Route

For one exact Issue, use the fixed update route when changing one or more of
`summary`, `description`, `dueDate`, `priority`, or `assignee`. It requires
`READ,UPDATE` in the environment and explicit `--persist` permission because a
compact current-value snapshot, the reviewed changes, and the fixed input are
stored in one owner-only pending handoff. The route does not clear fields and
does not support status, type, category, version, milestone, custom-field,
attachment, notification, or arbitrary JSON updates.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.update.preflight --issue-key PROJ-123 \
  [--organization NAME] [--summary TEXT] [--description TEXT] \
  [--due-date YYYY-MM-DD] [--priority NAME|ID] [--assignee NAME|ID] --persist
```

The preflight reads the exact Issue, resolves the Project and any priority or
assignee names, rejects an empty change set, then returns the reviewed change
preview unchanged. Its question is the required just-in-time UPDATE approval.
After a separate affirmative reply, invoke only:

```bash
node <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.update.apply --apply
```

Apply accepts no target or field overrides. It requires exactly one pending
handoff, checks the runtime identity, obtains an atomic lock, rereads the Issue,
and compares its canonical snapshot digest immediately before `update_issue`.
If the Issue changed after review, it records `conflict`, sends no mutation, and
must not be retried automatically. A failed or interrupted remote call becomes
`unresolved`; a successful call is recorded as `applied`.

## Read-Only Issue Hygiene and Notification Triage

Use `issue.hygiene` only for a resolved Project and at least one explicit
condition. It reports non-closed Issues that meet any selected condition; it
does not update, comment on, assign, or close them:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.hygiene --project PROJECT_KEY \
  --overdue --stale-days 30 --without-parent
```

`--overdue` means a due date before today; `--stale-days DAYS` means an updated
date strictly older than that calendar-day threshold; `--without-parent` means
that the Issue has no `parentIssueId`. It cannot identify a broken parent
reference. The runner scans the selected Project in 100-Issue pages, reports
scanned/page counts, and retains only key, status, summary, due date, and
updated date in its result.

Use `notification.triage` to inspect the Backlog bell list, optionally for
unread notifications only. It returns at most 100 latest notifications and
shows raw numeric `reason` values without calling any one a “mention”:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human notification.triage --unread --limit 50
```

The pinned runtime does not provide a reason-code mapping that this Skill can
use to infer personal mentions, so retain unknown values as numbers. Neither
route changes notification state. Marking one notification read is an `UPDATE`
operation and resetting unread count is a broad `UPDATE` operation; use the
generic mutation workflow and obtain the required just-in-time approval (and,
for reset, the second destructive confirmation) before either action.

## Required First Checks for Other Runtime Operations

1. Read [index.json](index.json) first as the generated discovery index.
2. Read `runtime/miku-backlog-api-source.json` when source identity matters.
3. Open only the references needed for the current request.
4. Locate the runtime file named by the source record before searching elsewhere.
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

- use only the bundled `miku-backlog-api` Node runtime
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
load it. Do not use a repository-root `.env`, `.env.local`, or similar dotfile
for Backlog credentials; those paths are not a supported credential boundary.

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
