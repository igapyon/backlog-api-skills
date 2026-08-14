# miku-backlog-api-skills

`miku-backlog-api-skills` provides an installable Agent Skill for operating Nulab
Backlog through the bundled `miku-backlog-api` Node CLI runtime.

This product is currently beta. Its version remains a numeric Semantic Version
such as `0.7.5`; beta status is not encoded in the version number.

The Backlog MCP-equivalent Node Core/CLI is maintained separately in the sister
[`miku-backlog-api`](https://github.com/igapyon/miku-backlog-api) repository. This
repository adds explicit activation, user-facing safety policy, working-context
guidance, and Agent-oriented workflows around a pinned Node runtime.

## Repository Boundary

```text
skills/igapyon-miku-backlog-api/ Agent Skill, references, notices, and runtime
scripts/                         Skill bundle and runtime synchronization tools
tests/                           Skill contract, provenance, and bundle tests
docs/                            Skill development and product reference notes
workplace/                       ignored local scratch and approved data outputs
```

Node Core/CLI source, upstream operation mapping, direct handler tests, and Node
release artifacts belong to `backlog-api`, not this repository.

## Agent Skill

- maturity: beta
- installed name: `igapyon-miku-backlog-api`
- explicit triggers: `igapyon-miku-backlog-api`, `miku-backlog-api`, or
  `miku-backlog-api-skills`; compatibility triggers: `igapyon-backlog-api`,
  `backlog-api`, or `backlog-api-skills`
- backend policy: CLI only
- Skill version: `0.7.5`
- bundled runtime: `runtime/miku-backlog-api-0.7.0.mjs`
- runtime source record: `runtime/miku-backlog-api-source.json`

Generic mentions of Backlog, issues, projects, wikis, or pull requests do not
activate the Skill by themselves.

The Skill and the bundled runtime are versioned independently. Consult the
runtime source record for the exact runtime version and provenance rather than
inferring it from the Skill version.

## Working Context

The bundled runtime deliberately has no saved “current Space/Project”
operation. The Skill can retain an organization and resolved project as an
explicit, session-scoped context for its fixed workflows.

By default, keep that context in the Agent conversation. Before creating a
local context record, the Agent must obtain the user's explicit permission. A
persisted context contains only the organization label and project ID, key, and
name—never an API key or domain—and is written with owner-only permissions
under the ignored `workplace/backlog-api-skill/session-contexts/` directory.

```bash
# Show configured Space labels; credentials and domains are never printed.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human context.list

# Only after the user permits local context persistence.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human context.select --session agent-session-1 \
  --organization SPACE_NAME --project PROJECT_KEY --persist

# Confirm or clear the selected target explicitly.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human context.show --session agent-session-1
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human context.clear --session agent-session-1
```

Use `--context-session agent-session-1` with `issue.search`,
`issue.list.incomplete`, or `issue.delete.preflight` to load that exact target.
The runner rejects an additional organization or project argument, and deletion
preflight stops if the resolved Issue is outside the selected Project.

## Recent Issue History

The Agent may keep a recent Issue only in the conversation by default. Issue
keys and project association can be sensitive tenant metadata, so local history
needs separate explicit user permission. The opted-in local record contains
only organization label, project ID/key/name, Issue ID/key, and timestamp; it
does not store titles, descriptions, response data, domains, or credentials.

```bash
# Only after permission to persist Issue history.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.recent.record --session agent-session-1 \
  --issue-key PROJECT-123 --persist

node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.recent.list --session agent-session-1

# Reuse the newest exact target. Preflight rereads and verifies its Project.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.preflight --recent-issue-session agent-session-1

# Remove this local history when it is no longer needed.
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.recent.clear --session agent-session-1
```

## Requirements and Authentication

- Node.js 22 or later
- a Backlog account with API access
- `BACKLOG_DOMAIN` and `BACKLOG_API_KEY`, or the Node runtime's
  multi-organization environment variables
- `BACKLOG_API_ALLOWED_PERMISSIONS` when write operations are allowed

Credentials are inherited from the runtime process environment. They are not
stored, printed, or bundled by this repository.

The bundled CLI allows read operations by default. Create, update, and delete
operations must be enabled both by the environment-level
`BACKLOG_API_ALLOWED_PERMISSIONS` maximum and by an explicit `--allow CREATE`,
`--allow UPDATE`, or `--allow DELETE` argument for that invocation. The Agent
must obtain the user's just-in-time approval before supplying the call-level
permission. A destructive or broad operation requires a second, separate
confirmation after the mutation approval; one approval cannot satisfy both
gates.

During the beta period, run actual Backlog API calls with `--verbose` by
default. The CLI keeps the JSON result on stdout and writes a safe access
summary to stderr as `verbose: `-prefixed JSON. It includes allowlisted resource
IDs or keys, execution metadata, an available actual HTTP status, and validated
rate-limit values, but excludes credentials, bodies, search text, personal data,
and error bodies. Do not persist verbose diagnostics unless the user explicitly
approves the destination and handling. Metadata commands do not need
`--verbose`. Dry-run does not resolve credentials or call Backlog and uses
`--verbose` only when diagnostic output is useful.

### Exact Single-Issue Deletion

For an explicit request to delete one named Backlog issue, the bundled fixed
runner replaces the agent-assembled read/dry-run/delete/read-back sequence.
It makes one target read at preflight, asks the one final destructive question,
then makes one delete call after the user's reply. It does not use a routine
dry-run or post-delete read-back.

Start preflight from the same agent workspace that owns the ignored
`workplace/` directory:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.preflight --issue-key PROJ-123
```

Return the runner's question unchanged. Only after the user separately
confirms it, apply the sole pending handoff without repeating the issue key,
organization, or delete flags:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.handoff.apply --apply
```

The handoff is stored locally under
`workplace/backlog-api-skill/delete-handoffs/`, with permissions restricted to
the workspace owner. It binds the reviewed issue and runtime checksum, never
contains an API-key value, requires exactly one pending record, and never
retries an unresolved delete automatically. The route is limited to one
`delete_issue`; other destructive operations retain the normal confirmation
workflow.

### Common Issue Search

One fixed `issue.search` workflow covers the supported Issue-search variants.
It owns authenticated-user resolution, pagination, filtering, and ordering, so
an Agent does not construct page requests or receive raw response pages. The
result contains only issue key, status, summary, and relevant timestamp.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.search --project MIGTEST01 --incomplete \
  --keyword migration --assignee me --updated-within-days 7
```

`--project PROJECT_KEY|PROJECT_ID` is required. Supported conditions are
`--incomplete`, `--keyword TEXT`, `--assignee me|NAME|ID`, `--priority
NAME|ID`, `--milestone NAME|ID`, `--category NAME|ID`, `--version NAME|ID`,
`--resolution NAME|ID`, `--due-from YYYY-MM-DD`, `--due-to YYYY-MM-DD`,
`--created-within-days DAYS`, and `--updated-within-days DAYS`. The assignee,
priority, milestone, category, version, and resolution options may be repeated.
The runner resolves names by exact match after resolving the project and stops
instead of guessing when a name is missing or ambiguous.

Use `--sort created|updated` and `--order asc|desc` when the default newest
updated order is unsuitable. At least one search condition is required;
relative day values are `1` through `3660`. Add `--organization NAME` only when
the target Backlog organization is explicitly specified. Backlog's Issue
keyword condition is used as-is. Comment text is not part of this route, and
the runner does not emulate project-wide comment search by fetching every
Issue's comments.

`issue.list.incomplete` remains as the concise compatibility alias for
`issue.search --incomplete`; pass the required project as
`issue.list.incomplete --project PROJECT_KEY|PROJECT_ID`. Both routes use the
same MJS search implementation. Future supported conditions extend this shared
contract rather than adding another MJS runner.

Backlog returns at most `100` issues per `get_issues` call. The shared runner
uses that maximum page size and follows `offset` until the final short page;
`100` is not the final list limit. Project, keyword, resolved-ID, and date
filters run in Backlog before paging. The current `--incomplete` condition is
applied after retrieval, so it can still scan completed issues in the selected
project. Results show both the retained count and the scanned issue/page
counts.

### Saving a Reviewed Issue Search Result

Saving is opt-in because Issue metadata can be tenant-sensitive. After the user
explicitly approves a local file, use `issue.save` with the same bounded search
conditions and the required `--persist` gate:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.save --project MIGTEST01 --incomplete \
  --updated-within-days 14 --persist
```

The runner has no arbitrary destination option. It writes one timestamped
owner-only JSON file under the ignored
`workplace/backlog-api-skill/saved-issues/` directory and reports its path. The
file contains only the reviewed result's organization label, project, Issue
key/status/summary, created/updated timestamps, and counts; it excludes
credentials, domains, descriptions, comments, attachments, raw responses, and
verbose diagnostics.

### Reviewed XLSX Export

For an actual Excel workbook, use the two-stage `issue.export.xlsx` route with
a reviewed local `miku-md2xlsx` runtime. The preflight has the same bounded
search conditions as `issue.search`; `--persist` explicitly authorizes its
owner-only pending handoff, not the final file write:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.export.xlsx.preflight --project MIGTEST01 --incomplete \
  --md2xlsx-runtime /absolute/miku-md2xlsx-0.9.5.mjs --persist
```

Return the preflight preview unchanged. It identifies the selected row count,
fixed columns, and generated destination under
`workplace/backlog-api-skill/issue-exports/`. Only after a separate approval,
apply the single pending export:

```bash
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.export.xlsx.apply --apply
```

The runner creates a timestamped owner-only Markdown table and `.xlsx` file,
uses no arbitrary output path or template, and checks the converter checksum
again before it writes. The fixed export columns are Organization, Project,
Issue key, Status, Summary, Created, and Updated.

### Creating One Reviewed Issue

The fixed create route resolves Project, Issue type, and priority names before
showing the precise one-Issue payload. The local handoff contains the reviewed
content, so `--persist` needs explicit permission; the response to the
preflight is the separate just-in-time CREATE approval.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.create.preflight --project MIGTEST01 \
  --summary "Review fixed workflow" --issue-type Task --priority Normal \
  --description "Synthetic example" --persist
```

After the user approves the exact preview, apply only the pending handoff:

```bash
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.create.apply --apply
```

The runner requires `READ,CREATE` in the environment, rechecks the bundled
runtime, calls `add_issue` exactly once with `--allow CREATE`, and never
retries an unresolved result.

### Updating One Reviewed Issue

Use the fixed two-stage UPDATE route for one Issue's summary, description, due
date, priority, or assignee. It does not support clearing values or changing
status, type, categories, versions, milestones, custom fields, or attachments.
Preflight needs explicit local `--persist` permission because it stores the
reviewed change set and a compact current-value snapshot in an owner-only
handoff; its output is the separate just-in-time UPDATE approval.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.update.preflight --issue-key MIGTEST01-500 \
  --summary "Reviewed summary" --priority High --assignee "Example User" --persist
```

After the user approves that exact preview, apply only the pending handoff:

```bash
node skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.update.apply --apply
```

The runner requires `READ,UPDATE`, checks its bundled runtime identity, locks
the handoff, rereads the Issue, and compares the reviewed snapshot digest before
calling `update_issue` once with `--allow UPDATE`. A changed Issue becomes a
`conflict` without sending an update; failures become `unresolved`. Neither is
automatically retried.

### Read-Only Hygiene and Notification Review

Find potentially neglected Issues without changing Backlog state:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.hygiene --project MIGTEST01 \
  --overdue --stale-days 30 --without-parent
```

The result is a project-scoped heuristic: `--overdue` means a due date before
today, `--stale-days` uses a strict calendar cutoff, and `--without-parent`
means no `parentIssueId` was set (not a broken parent reference). Closed Issues
are excluded and the output gives the scanned/page counts.

Review the Backlog bell list without making anything read:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human notification.triage --unread --limit 50
```

The pinned contract exposes numeric notification reasons but does not give this
Skill an authoritative mention mapping, so it reports the raw number and never
guesses. Marking one notification read needs an exact ID and just-in-time
`UPDATE` approval; resetting unread count additionally needs the separate broad
operation confirmation.

### Issuing a Backlog API Key

In Backlog, open the user menu in the upper-right corner, then select
**Personal settings** and **API**. Enter a purpose-only note such as
`Agent Skills connection`, select **Register**, and copy the newly issued key.

This is a guidance-only workflow. The user performs the registration and copy
steps; the Skill does not operate the settings UI or receive the key value.

Do not put the API key value in the note, documentation, screenshots, chat, or
tracked files. Keep the value only in the local connection file below.

### Local Connection Configuration

When a local Backlog connection file is explicitly requested, create
`workplace/backlog.env` in the Agent or operator workspace that owns local
credentials, not inside the installed Skill. Use this template and replace the
example domain:

```dotenv
BACKLOG_DOMAIN=userunique.backlog.com
BACKLOG_API_KEY=
BACKLOG_API_ALLOWED_PERMISSIONS=READ
```

Apply the following safety rules:

- create the file only after an explicit request
- set its permissions to `600`
- never overwrite an existing file
- never print or copy its values into chat, logs, tracked files, or generated
  artifacts
- specify `BACKLOG_DOMAIN` as a host name only, without `https://` or a trailing
  slash
- confirm that the credential-owning workspace ignores the file under
  `workplace/`
- begin a connection test with the read-only `get_space` operation

The CLI does not automatically load this file. Pass its resolved path to Node
explicitly when running the bundled runtime:

```bash
printf '{}\n' | node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-miku-backlog-api/runtime/miku-backlog-api-0.7.0.mjs \
  call get_space --input - --verbose
```

Repository-root `.env` files are intentionally unsupported for Backlog
credentials. They blur the boundary between the checked-in Skill and the
credential-owning workspace, and are easy to include accidentally in unrelated
tooling or commits. Use only the explicitly approved, ignored
`<agent-workspace>/workplace/backlog.env` path. On rotation or suspected
exposure, revoke the Backlog key, issue a replacement, and update that local
file without opening, copying, or committing its value.

## Build and Test

The committed runtime lets this repository build and test independently of a
local `backlog-api` checkout.

```bash
npm install
npm test
npm run smoke:runtime
npm run build:bundle:zip
```

Generated output:

- `bundle/igapyon-miku-backlog-api-skills-<version>.zip`

## Refresh the Node Runtime

Use the published `backlog-api` Release asset as the source of a releasable
Skill runtime. Download the versioned CLI asset and `SHA256SUMS`, verify the
checksum, then import the asset with its exact Release tag and commit:

```bash
npm run import:runtime:release -- \
  --version 0.7.0 \
  --tag v0.7.0 \
  --commit 2ee5cd26cd412906b771987e1491618d137ab993 \
  --artifact /path/to/miku-backlog-api-0.7.0.mjs \
  --expected-sha256 30ab58105b5c06c5b15fc932e1a4fe8b790c0d8cf32f57f0e10f51a76d31d872
```

The import validates the asset checksum and reported version, then records the
source repository, version, Release tag, Git commit, Release URL, asset URL,
SHA-256, and upstream anchor in
`skills/igapyon-miku-backlog-api/runtime/miku-backlog-api-source.json`.

`npm run sync:runtime` remains available for local development builds from the
sister checkout, but a distributable Skill release should use the published
Release asset. After changing bundled Skill files, regenerate
`skills/igapyon-miku-backlog-api/index.json` with `miku-indexgen --refresh-index`.

## Install

Build the Skill zip, extract it, and copy its top-level `skills/` directory into
the target agent's skill root. The installed path is
`skills/igapyon-miku-backlog-api/`.

## License

This project is MIT licensed. The bundled Node runtime contains MIT-licensed
Nulab Backlog MCP Server handler code; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
