# Request Routing

## Session Working Context

The bundled Node runtime has no current Space/Project state. It resolves the
organization and project supplied to each call. The fixed Skill runner provides
an optional local context record only for an explicitly authorized Agent
session; it is not a runtime credential store.

1. `context.list` reports the configured multi-organization labels, or the
   single `default` connection, without revealing a domain or API key.
2. Before `context.select --session SESSION --project PROJECT_KEY|PROJECT_ID
   [--organization NAME] --persist`, obtain explicit user permission to persist
   the context. The runner resolves the Project using `get_project`, then stores
   only organization label, project ID, project key, and project name with
   owner-only file permissions.
3. `context.show --session SESSION` displays that exact target.
   `context.clear --session SESSION` explicitly removes the local record.
4. `issue.search`, `issue.list.incomplete`, and `issue.delete.preflight` accept
   `--context-session SESSION`. They must not also receive an organization or
   project argument. The runner injects the saved scope; delete preflight stops
   when the resolved Issue's project differs from the saved project.

When persistence is not approved, maintain the resolved context only in the
Agent conversation. Show its organization and project before every mutation,
pass the values explicitly, and discard it when the user asks to clear or
switch context.

## Recent Issue History

Keep a “current” or “previous” Issue in the Agent conversation by default. A
local record needs separate explicit user permission because Issue and project
identifiers can be sensitive tenant metadata. `issue.recent.record --session
SESSION` with exactly one `--issue-key KEY` or `--issue-id ID` plus optional
`--organization NAME` and `--persist` makes a
small, owner-only record only after rereading the exact Issue and its Project.
It stores organization label, project ID/key/name, Issue ID/key, and timestamp;
it does not store Issue title, description, response body, domain, or API key.

`issue.recent.list --session SESSION` displays the newest-first reusable
targets, while `issue.recent.clear --session SESSION` removes all records for
that session. `issue.delete.preflight --recent-issue-session SESSION` loads the
newest exact target, rereads it, confirms its Project still matches the saved
record, then presents the resolved organization, project, Issue key, and title
in the required final deletion prompt. It rejects a simultaneous Issue key,
organization, or working-context session.

## Common Issue Search Workflow

For supported Issue searches, invoke `issue.search` from
`scripts/backlog-api-skill-run.mjs`. It accepts a composable, bounded input
contract: optional organization plus one or more of `--incomplete`, `--keyword
TEXT`, `--assignee me|NAME|ID`, `--priority NAME|ID`, `--milestone NAME|ID`,
`--category NAME|ID`, `--version NAME|ID`, `--resolution NAME|ID`, `--due-from
YYYY-MM-DD`, `--due-to YYYY-MM-DD`, `--created-within-days DAYS`, and
`--updated-within-days DAYS`. `--project PROJECT_KEY|PROJECT_ID` and at least
one condition are required. `--sort created|updated` and `--order asc|desc` set
the ordering; update time descending is the default. Relative day values are
bounded to `1` through `3660`.

The runner resolves the project first. Assignee, priority, milestone, category,
version, and resolution options are repeatable and accept an exact name or ID.
Name lookup stops when a match is missing or ambiguous; it never guesses.
`--assignee me` uses one `get_myself` read. The runner then performs all
`get_issues` paging itself, requests only key, status, summary, created time,
and updated time, and returns a concise sorted result. `--incomplete` excludes
only terminal Backlog status ID `4` (`完了`).

Backlog limits one `get_issues` response to `100` issues. The runner therefore
uses `count: 100`, increments `offset`, and continues until a page contains
fewer than `100` issues. The number `100` is the paging unit, not the final
result limit. Backlog applies the project, keyword, resolved-ID, and date
filters before paging. The current runtime has no exclude-status input, so
`--incomplete` filters status ID `4` after retrieval and may require scanning
completed issues inside the selected project; the result exposes retained,
scanned, and page counts.

Comment text is outside this workflow. The runtime exposes comments per Issue,
not a project-wide comment-search input, so do not approximate comment search
with an unbounded Issue-by-Issue comment scan.

For `完了以外のIssue一覧` or `未完了Issue一覧`, invoke the compatibility alias
`issue.list.incomplete --project PROJECT_KEY|PROJECT_ID [--organization NAME]`;
it delegates to the same shared search implementation with `--incomplete`
enabled.

Return the runner's human output unchanged. Do not implement condition mapping,
current-user resolution, pagination, ordering, temporary request JSON, or
result reshaping in the Agent. Add future conditions to `issue.search`'s input
contract instead of adding a new MJS runner.

## Opt-In Saved Issue Search Result

`issue.save` is the only local-file route for common Issue-search results. It
uses the identical bounded search contract as `issue.search`, but requires an
additional `--persist` flag after the user explicitly authorizes persistence.
The flag represents permission to write the exact selected result; it is not
implied by the request to search or to view Issues.

The route accepts no output-path or file-name option. It writes one timestamped
JSON record under the credential-owning workspace's ignored
`workplace/backlog-api-skill/saved-issues/` directory, sets the directory to
`0700` and the file to `0600`, and reports the relative destination. The record
contains only organization label, resolved project, issue key/status/summary,
created/updated timestamps, counts, and save timestamp. It must not include an
API key, domain, issue description, comment, attachment, raw response, or
verbose diagnostic event.

## Reviewed XLSX Export

`issue.export.xlsx.preflight` uses the common bounded Issue-search contract and
requires both `--persist` and an absolute `--md2xlsx-runtime` path whose file
name matches `miku-md2xlsx-X.Y.Z.mjs`. It creates a `0600` pending handoff under
the ignored `workplace/backlog-api-skill/xlsx-export-handoffs/` directory after
reading the selected result. This retention is why the agent must obtain
explicit permission before invoking preflight.

The preflight returns the selected row count, seven fixed columns, and a
timestamp/UUID-generated XLSX path under the ignored
`workplace/backlog-api-skill/issue-exports/` directory. Return that preview
unchanged and wait for a separate affirmative reply. Only then invoke
`issue.export.xlsx.apply --apply`; it accepts no target, output path, template,
or converter override. It finds exactly one pending handoff, rechecks the
converter SHA-256, writes an owner-only Markdown table, and invokes the
reviewed Node converter with only input, `--out`, and Project-key title.

The compact table contains Organization, Project, Issue key, Status, Summary,
Created, and Updated. The intermediate Markdown and `.xlsx` output both have
mode `0600`; their directory has mode `0700`. Conversion failure or changed
converter identity makes the handoff `unresolved`; do not retry automatically.
The route never accepts an arbitrary destination and never saves credentials,
domains, descriptions, comments, attachments, raw responses, or verbose
diagnostics.

## Fixed Single-Issue Create

`issue.create.preflight` takes a Project plus summary, Issue type, priority,
optional description, and `--persist`. It first requires both `READ` and
`CREATE` in `BACKLOG_API_ALLOWED_PERMISSIONS`, resolves Project/type/priority
names to IDs, then writes the reviewed `add_issue` payload to a `0600` pending
handoff under the ignored `workplace/backlog-api-skill/issue-create-handoffs/`
directory. The local handoff contains user-supplied content, so explicit
persistence permission is required before preflight.

Return its question unchanged. That question asks for the required just-in-time
CREATE approval after presenting the organization, Project, type, priority,
summary, and description. Following a separate affirmative reply, invoke only
`issue.create.apply --apply`. It finds exactly one pending record, verifies the
runtime checksum, calls `add_issue` once with `--allow CREATE`, and marks any
unsuccessful or interrupted attempt `unresolved` without automatic retry.

The route currently supports only the fixed fields above. It has no arbitrary
JSON, attachment, custom-field, notification, or output-file surface. Do not
use it for Issue updates.

## Fixed Single-Issue Update

`issue.update.preflight` accepts exactly one `--issue-key` or `--issue-id`, an
optional organization, one or more of `--summary`, `--description`,
`--due-date YYYY-MM-DD`, `--priority NAME|ID`, and `--assignee NAME|ID`, plus
`--persist`. It rejects empty values, clearing a field, arbitrary JSON, and an
empty or no-op change set. Status updates are intentionally outside this fixed
route because the pinned runtime has no safe status-name catalog for resolution.

Preflight requires `READ,UPDATE` in the environment. It reads the named Issue
with the compact snapshot projection, resolves its Project and any priority or
assignee names, then creates exactly one owner-only `0600` handoff under
`workplace/backlog-api-skill/issue-update-handoffs/`. The handoff contains the
fixed `update_issue` input, reviewed field-by-field before/after values, runtime
identity, and a SHA-256 digest of the current snapshot. Its preview asks for the
separate just-in-time UPDATE approval.

After approval, invoke only `issue.update.apply --apply`. It accepts no target,
field, or organization override and finds exactly one pending handoff. Apply
rechecks runtime identity, obtains an exclusive lock, rereads the reviewed Issue
by stable numeric ID, and compares the snapshot digest before it calls
`update_issue` once with `--allow UPDATE`. A digest mismatch is terminal
`conflict`: no update is sent, no pending handoff remains, and the agent must
not retry automatically. A failed or interrupted read/update is terminal
`unresolved`; successful updates are `applied`.

## Read-Only Issue Hygiene

`issue.hygiene` requires one Project plus at least one of `--overdue`,
`--stale-days DAYS`, or `--without-parent`. It reads the selected Project in
100-Issue pages and excludes status ID `4` (`完了`) before applying its local
heuristics. A result matches if it satisfies at least one requested condition:

- overdue: an explicit due date is before today's local calendar date
- stale: the updated date is strictly before the selected calendar-day cutoff
- without parent: `parentIssueId` is absent or null

The last condition means “no parent was set,” not “the referenced parent is
broken.” The output reports the selected criteria and scanned/page counts so
that it cannot be mistaken for a mutation or an exhaustive semantic audit.

## Read-Only Notification Triage

`notification.triage` calls `get_notifications` once for the newest 1–100
entries, with optional `--unread` local filtering. It returns only notification
ID, read flags, numeric `reason`, created timestamp, and an optional Issue key.
Do not infer that any numeric reason means a personal mention until a pinned,
authoritative mapping exists. Unknown values remain raw numbers.

This route never marks a notification read. For `mark_notification_as_read`,
resolve one exact notification ID, confirm `UPDATE` is enabled, show the
organization and ID, and obtain just-in-time mutation approval. Treat
`reset_unread_notification_count` as broad: after that approval, obtain the
second, separate destructive confirmation before execution.

## Read Workflow

1. Identify the organization and resource kind.
2. Use list or lookup tools to resolve names to keys or IDs.
3. Request only fields and result volume needed for the answer.
4. Summarize the result and preserve meaningful upstream warnings.

## Create or Update Workflow

1. Confirm that the user explicitly requested the mutation.
2. Resolve the organization, project key, issue key, repository, user, issue
   type, milestone, and custom-field identities that matter.
3. Separate user-provided values from values discovered through read calls.
4. If a material field is ambiguous, ask before execution.
5. Confirm that the corresponding permission is already enabled in
   `BACKLOG_API_ALLOWED_PERMISSIONS`; do not modify the environment maximum
   implicitly.
6. Present the operation class, organization, exact target, and material fields,
   and ask for just-in-time mutation approval.
7. Only after approval, execute one smallest-scope mutation with its required
   `--allow CREATE` or `--allow UPDATE` permission.
8. Read back the target when practical and report its stable key or ID.

An explicit request such as “create this issue” or “post this comment” begins
the mutation workflow but does not replace the just-in-time approval above.

## Fixed Single-Issue Delete Workflow

For `delete_issue` only, use the fixed runner when the user's original request
names one stable issue key or ID and explicitly asks to delete it. The request
counts as the mutation approval only after preflight resolves exactly that
target. The runner output supplies the only separate destructive confirmation.

1. Confirm that both `READ` and `DELETE` are already enabled in
   `BACKLOG_API_ALLOWED_PERMISSIONS`; do not modify that maximum implicitly.
2. Invoke `issue.delete.preflight` in
   `scripts/backlog-api-skill-run.mjs` with exactly one of `--issue-key` or
   `--issue-id` and, only when specified, `--organization`.
3. Return its human output unchanged. It reads the target once, creates an
   integrity-checked pending handoff, and asks the concise final question.
4. After a separate affirmative reply, invoke only
   `issue.delete.handoff.apply --apply` from the same workspace. Do not repeat
   the target or reconstruct any apply argument. The runner requires exactly
   one pending handoff, verifies the reviewed runtime identity, and calls the
   bundled `delete_issue` operation once with its fixed delete gates.
5. Return the runner's human output unchanged. Do not add routine progress,
   dry-run, or read-back narration.

The fixed runner performs exactly two Backlog API calls across the normal
success path: `get_issue` at preflight and `delete_issue` at apply. It does not
run a routine `--dry-run` or post-delete read-back. A failed or interrupted
apply becomes `unresolved` and must not be retried automatically.

For example, after an exact Japanese request such as `PROJ-123 を削除`, return
the preflight result only:

> 組織 example の PROJ-123（「Example title」）を完全に削除します。復元できません。実行しますか？

After confirmation and an unambiguous successful deletion, return only:

> PROJ-123 を削除しました。

Do not use this route for `remove_related_issue`, project deletion, bulk
deletion, or an ambiguous request. Those operations use the generic mutation
flow: resolve the target, obtain mutation approval, then obtain a separate
destructive confirmation in a later turn.

Never convert “remove from my view,” “close,” “archive,” or “mark as read” into
a delete without resolving the intended Backlog operation.

## Result Wording

A concise result should include:

- action and status
- organization and target
- important returned key, ID, URL, or state
- warnings or fields not applied
- verification result, if read-back was performed

Do not narrate that an approval was received, announce routine validation, or
repeat unchanged target details between steps. After an unambiguous success,
one sentence naming the action and stable target is sufficient.
