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
request that started the workflow is not itself the approval to supply a
permission flag.

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
