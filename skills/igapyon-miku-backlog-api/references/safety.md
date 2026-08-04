# Safety and Data Handling

## Credentials

Backlog API keys, OAuth client secrets, access tokens, refresh tokens, and MCP
authorization headers are secrets.

- never request that they be pasted into chat
- never include them in generated examples, logs, tests, screenshots, or bundle
  files
- never search dotfiles or environment variables for them
- refer the user to the execution environment's secure secret configuration

## Tenant Boundaries

- resolve the organization before mutation in multi-organization environments
- do not assume that identical project or repository names belong to the same
  organization
- avoid including unrelated issue bodies, wiki text, document content, or user
  details in summaries

## Mutation Classes

Read operations do not change Backlog state.

The CLI permits `READ` only by default. `BACKLOG_API_ALLOWED_PERMISSIONS`
defines the environment-level maximum and defaults to `READ` when unset.
`--allow` cannot enable a permission omitted from that maximum. Never weaken or
modify the environment maximum implicitly.

Before every mutation, present its permission class, organization, exact
target, and material payload, then ask for just-in-time user approval. The
request that started the workflow normally is not itself the approval to supply
a permission flag.

For one destructive target, an initiating request may count as the mutation
approval only when it explicitly names the stable key/ID and destructive action
and a read resolves exactly that target. Do not ask for duplicate mutation
approval in that case. Still require the separate destructive confirmation
below. If the organization, target, operation, or material scope changes or is
ambiguous, discard the initiating approval and ask again.

Confirm that the required permission is already enabled in
`BACKLOG_API_ALLOWED_PERMISSIONS`. Only after approval, add the narrow
permission flag for the one invocation:

- `--allow CREATE` for additions
- `--allow UPDATE` for updates and notification-state changes
- `--allow DELETE` for deletions

Bind each approval to the organization, target, exact operation, and material
fields shown to the user. If any bound value changes before execution, invalidate
the approval and ask again. Do not reuse approval for another invocation.

Ordinary mutations include creating or updating a specifically requested issue,
comment, wiki, document, milestone, pull request, or watching item. They may
proceed only after the mutation approval, using only the corresponding
permission for that invocation. Do not reuse approval from another operation.

High-impact mutations include:

- any `delete_*` operation
- `remove_related_issue`
- project deletion
- broad notification-state reset
- bulk or cross-project changes
- an update that replaces substantial existing content when the user asked for
  a narrow edit

After the mutation approval, obtain a second, separate confirmation for every
high-impact mutation and state the exact scope and difficult-to-reverse effect.
One user reply must not satisfy both gates. A deletion therefore requires the
first approval before `--allow DELETE` and another confirmation before
`--confirm-destructive`. A broad reset similarly requires UPDATE approval and
then a separate destructive confirmation.

## Fixed Single-Issue Delete Runner

The exception for an exact `delete_issue` request is implemented only by
`scripts/backlog-api-skill-run.mjs`; do not reproduce it with a direct runtime
command. It requires `READ,DELETE` in the environment before preflight.

Preflight resolves the named issue exactly once and writes a `0600` pending
handoff under the agent workspace's ignored
`workplace/backlog-api-skill/delete-handoffs/` directory. The handoff binds the
resolved numeric issue ID, optional organization, reviewed title, runtime file
and checksum, and fixed delete input. It contains no credential value.

The original request may count as mutation approval only if it named the stable
issue key/ID and deletion action. The preflight human output is still the
required, separate final destructive confirmation. After that reply, invoke
only `issue.delete.handoff.apply --apply`; the runner must find exactly one
pending integrity-checked handoff. Never select a handoff by guesswork or
rebuild its target, `--allow`, or `--confirm-destructive` arguments in chat.

Apply changes the handoff to `applying` before the single remote delete call.
An unsuccessful or interrupted call is recorded as `unresolved`; do not retry
it automatically. An atomic apply lock prevents the same pending handoff from
being invoked twice concurrently. A successful delete is recorded as `applied`.
The route has no routine dry-run or post-delete read-back.

## Diagnostics

Preserve upstream authentication, authorization, validation, rate-limit,
truncation, and transport diagnostics. Redact secrets if an upstream diagnostic
unexpectedly contains them.

During the beta period, use `--verbose` for actual Backlog API calls. Treat its
stderr events as transient diagnostics and do not save them without explicit
user approval. Events are `verbose: `-prefixed JSON and may contain allowlisted
resource IDs or keys, duration, changed field names, pagination, an available
actual HTTP status, and validated rate-limit values. They omit credentials,
bodies, search text, personal data, and error bodies. Stop and report a safety
defect if any excluded value appears.
